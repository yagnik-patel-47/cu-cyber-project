import {
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: text("password"),
	name: varchar("name", { length: 255 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("session", {
	id: varchar("id", {
		length: 255,
	}).primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const vaults = pgTable("vaults", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	color: varchar("color", { length: 7 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const passwords = pgTable("passwords", {
	id: uuid("id").primaryKey().defaultRandom(),
	vaultId: uuid("vault_id")
		.references(() => vaults.id, { onDelete: "cascade" })
		.notNull(),
	categoryId: uuid("category_id").references(() => categories.id, {
		onDelete: "set null",
	}),
	title: varchar("title", { length: 255 }).notNull(),
	username: varchar("username", { length: 255 }),
	password: text("password").notNull(),
	url: text("url"),
	notes: text("notes"),
	isFavorite: boolean("is_favorite").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
	vaults: many(vaults),
	categories: many(categories),
}));

export const vaultsRelations = relations(vaults, ({ one, many }) => ({
	user: one(users, {
		fields: [vaults.userId],
		references: [users.id],
	}),
	passwords: many(passwords),
}));

export const passwordsRelations = relations(passwords, ({ one }) => ({
	vault: one(vaults, {
		fields: [passwords.vaultId],
		references: [vaults.id],
	}),
	category: one(categories, {
		fields: [passwords.categoryId],
		references: [categories.id],
	}),
}));

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type Vault = InferSelectModel<typeof vaults>;
export type Category = InferSelectModel<typeof categories>;
export type Password = InferSelectModel<typeof passwords>;
