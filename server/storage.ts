import { type Message, type InsertMessage, type UpdateMessage, type Admin, type InsertAdmin, type User, type UpsertUser, messages, admins, users } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and, like, count } from "drizzle-orm";

export interface IStorage {
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getAllMessages(filters?: { status?: string; emotion?: string; search?: string }): Promise<Message[]>;
  getUserMessages(userId: string): Promise<Message[]>;
  getFavoriteMessages(userId: string): Promise<Message[]>;
  toggleFavorite(messageId: string, userId: string): Promise<Message | undefined>;
  deleteMessage(id: string): Promise<boolean>;
  updateMessage(id: string, updates: UpdateMessage): Promise<Message | undefined>;
  bulkDeleteMessages(ids: string[]): Promise<number>;
  bulkUpdateMessages(ids: string[], updates: UpdateMessage): Promise<number>;
  getMessageStats(): Promise<{ total: number; byEmotion: Record<string, number>; byStatus: Record<string, number> }>;
  
  // Admin operations
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStreak(userId: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getAllMessages(filters?: { status?: string; emotion?: string; search?: string }): Promise<Message[]> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(messages.status, filters.status));
    }
    
    if (filters?.emotion) {
      conditions.push(eq(messages.emotion, filters.emotion));
    }
    
    if (filters?.search && filters.search.trim()) {
      conditions.push(like(messages.content, `%${filters.search}%`));
    }
    
    let query = db.select().from(messages);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(messages.createdAt));
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(and(
        eq(messages.userId, userId),
        eq(messages.status, 'active')
      ))
      .orderBy(desc(messages.createdAt));
  }

  async getFavoriteMessages(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(and(
        eq(messages.userId, userId),
        eq(messages.isFavorite, 1),
        eq(messages.status, 'active')
      ))
      .orderBy(desc(messages.createdAt));
  }

  async toggleFavorite(messageId: string, userId: string): Promise<Message | undefined> {
    // First get the message to verify ownership
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));
    
    if (!message || message.userId !== userId) {
      return undefined;
    }

    // Toggle favorite status
    const newFavoriteStatus = message.isFavorite === 1 ? 0 : 1;
    
    const [updatedMessage] = await db
      .update(messages)
      .set({ isFavorite: newFavoriteStatus })
      .where(eq(messages.id, messageId))
      .returning();
    
    return updatedMessage;
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await db
      .delete(messages)
      .where(eq(messages.id, id));
    return (result.rowCount || 0) > 0;
  }

  async updateMessage(id: string, updates: UpdateMessage): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({
        ...updates,
        reviewedAt: new Date()
      })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }

  async bulkDeleteMessages(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(messages)
      .where(sql`${messages.id} = ANY(${ids})`);
    return result.rowCount || 0;
  }

  async bulkUpdateMessages(ids: string[], updates: UpdateMessage): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .update(messages)
      .set({
        ...updates,
        reviewedAt: new Date()
      })
      .where(sql`${messages.id} = ANY(${ids})`);
    return result.rowCount || 0;
  }

  async getMessageStats(): Promise<{ total: number; byEmotion: Record<string, number>; byStatus: Record<string, number> }> {
    const [totalResult] = await db
      .select({ count: count() })
      .from(messages);
    
    const emotionStats = await db
      .select({ emotion: messages.emotion, count: count() })
      .from(messages)
      .groupBy(messages.emotion);
    
    const statusStats = await db
      .select({ status: messages.status, count: count() })
      .from(messages)
      .groupBy(messages.status);
    
    return {
      total: totalResult.count,
      byEmotion: Object.fromEntries(emotionStats.map(s => [s.emotion, s.count])),
      byStatus: Object.fromEntries(statusStats.map(s => [s.status, s.count]))
    };
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db
      .insert(admins)
      .values(insertAdmin)
      .returning();
    return admin;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStreak(userId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let newStreak = 1;
    let newLongestStreak = user.longestStreak || 0;

    if (user.lastPostDate) {
      const lastPost = new Date(user.lastPostDate);
      const lastPostDay = new Date(lastPost.getFullYear(), lastPost.getMonth(), lastPost.getDate());
      const diffDays = Math.floor((today.getTime() - lastPostDay.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Posted today already - maintain current streak
        newStreak = user.currentStreak || 1;
      } else if (diffDays === 1) {
        // Posted yesterday - increment streak
        newStreak = (user.currentStreak || 0) + 1;
      } else {
        // Gap > 1 day - reset streak
        newStreak = 1;
      }
    }

    // Update longest streak if current streak is higher
    if (newStreak > newLongestStreak) {
      newLongestStreak = newStreak;
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastPostDate: now,
        updatedAt: now,
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }
}

export const storage = new DatabaseStorage();
