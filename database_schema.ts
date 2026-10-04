import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Database Schema Definition
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  priceInCents: integer("price_in_cents").notNull(),
  stripePriceId: text("stripe_price_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Automatically infer Zod validation schemas from Drizzle ORM definitions
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

// TypeScript Types inferred directly from DB schemas
export type Product = z.infer<typeof selectProductSchema>;
export type NewProduct = z.infer<typeof insertProductSchema>;