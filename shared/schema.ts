import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),
  lenderId: integer("lender_id").notNull(),
  borrowerId: integer("borrower_id").notNull(),
  amount: numeric("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isSimplified: integer("is_simplified").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
});

export const insertDebtSchema = createInsertSchema(debts).pick({
  lenderId: true,
  borrowerId: true,
  amount: true,
  isSimplified: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDebt = z.infer<typeof insertDebtSchema>;
export type Debt = typeof debts.$inferSelect;

// Graph related types
export type GraphUser = {
  id: number;
  name: string;
};

export type GraphDebt = {
  source: number | string;
  target: number | string;
  amount: number;
};

export type GraphData = {
  nodes: GraphUser[];
  links: GraphDebt[];
};
