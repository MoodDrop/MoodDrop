import { type Message, type InsertMessage, type UpdateMessage, type Admin, type InsertAdmin, messages, admins } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and, like, count } from "drizzle-orm";

export interface IStorage {
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getAllMessages(filters?: { status?: string; emotion?: string; search?: string }): Promise<Message[]>;
  deleteMessage(id: string): Promise<boolean>;
  updateMessage(id: string, updates: UpdateMessage): Promise<Message | undefined>;
  bulkDeleteMessages(ids: string[]): Promise<number>;
  bulkUpdateMessages(ids: string[], updates: UpdateMessage): Promise<number>;
  getMessageStats(): Promise<{ total: number; byEmotion: Record<string, number>; byStatus: Record<string, number> }>;
  
  // Admin operations
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
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
}

export const storage = new DatabaseStorage();
