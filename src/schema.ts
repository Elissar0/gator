import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  last_fetched_at: timestamp("updated_at"),
  name: text("name").notNull().unique(),
  url:  text('url').unique(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const feedFollows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  feed_id: uuid('feed_id').references(() => feeds.id, { onDelete: 'cascade' }),
});

export type Feed = typeof feeds.$inferSelect;
export type User = typeof feeds.$inferSelect;
