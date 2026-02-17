import { pgTable, varchar, timestamp, uniqueIndex, pgEnum, boolean } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["active", "inactive"]);
export const authProviderEnum = pgEnum("auth_provider", ["email", "google", "apple"]);

export const userSchema = pgTable(
  "users",
  {
    userId: varchar("user_id", { length: 20 }).primaryKey().notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    authProvider: authProviderEnum("auth_provider").notNull().default("email"),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    oauthProviderId: varchar("oauth_provider_id", { length: 255 }),
    status: statusEnum().default("active"),
    isProfileCompleted: boolean("is_profile_completed").default(false),
    emailVerified: boolean("email_verified").default(false),
    blocked: boolean("blocked").default(false),
    phoneNumber: varchar("phone_number"),
    countryCode: varchar("country_code"),
    city: varchar("city"),
    state: varchar("state"),
    country: varchar("country"),
    currency: varchar("currency"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    emailIndex: uniqueIndex("uq_user_email").on(table.email),
    oauthIndex: uniqueIndex("uq_oauth_provider_user").on(table.authProvider, table.oauthProviderId),
  }),
);
