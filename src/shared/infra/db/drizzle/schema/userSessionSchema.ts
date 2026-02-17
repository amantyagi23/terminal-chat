import { pgTable, varchar, timestamp, text, boolean, index, uuid } from "drizzle-orm/pg-core";
import { userSchema } from "./userSchema";

export const userSessionSchema = pgTable(
  "user_sessions",
  {
    userSessionId: uuid("user_session_id").primaryKey(),
    userId: varchar("user_id", { length: 20 })
      .notNull()
      .references(() => userSchema.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    token: text("token").notNull(),

    isDeleted: boolean("is_deleted").notNull().default(false),

    expiryDate: timestamp("expiry_date").notNull(),

    fcmToken: varchar("fcm_token", { length: 255 }),

    ipAddress: varchar("ip_address", { length: 255 }),

    location: varchar("location", { length: 255 }),

    userAgent: text("user_agent"),

    deviceId: varchar("device_id", { length: 255 }),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("user_session_id_idx").on(table.userId),
  }),
);
