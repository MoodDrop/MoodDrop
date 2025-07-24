import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emotion: text("emotion").notNull(),
  type: text("type").notNull(), // 'voice' or 'text'
  content: text("content"), // text content for text messages
  audioFilename: text("audio_filename"), // filename for voice messages
  duration: text("duration"), // recording duration for voice messages
  status: text("status").notNull().default("active"), // 'active', 'flagged', 'hidden'
  flagReason: text("flag_reason"), // reason for flagging
  reviewedBy: text("reviewed_by"), // admin who reviewed
  reviewedAt: timestamp("reviewed_at"), // when reviewed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  emotion: true,
  type: true,
  content: true,
  audioFilename: true,
  duration: true,
});

export const updateMessageSchema = createInsertSchema(messages).pick({
  status: true,
  flagReason: true,
  reviewedBy: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UpdateMessage = z.infer<typeof updateMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Admin user schema for simple authentication
export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
