import { type Message, type InsertMessage, type Admin, type InsertAdmin } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getAllMessages(): Promise<Message[]>;
  deleteMessage(id: string): Promise<boolean>;
  
  // Admin operations
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class MemStorage implements IStorage {
  private messages: Map<string, Message>;
  private admins: Map<string, Admin>;

  constructor() {
    this.messages = new Map();
    this.admins = new Map();
    
    // Create default admin user
    const defaultAdmin: Admin = {
      id: randomUUID(),
      username: "admin",
      password: "hushed2024", // In production, this should be hashed
    };
    this.admins.set(defaultAdmin.id, defaultAdmin);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      emotion: insertMessage.emotion,
      type: insertMessage.type,
      content: insertMessage.content || null,
      audioFilename: insertMessage.audioFilename || null,
      duration: insertMessage.duration || null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deleteMessage(id: string): Promise<boolean> {
    return this.messages.delete(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const admin: Admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
  }
}

export const storage = new MemStorage();
