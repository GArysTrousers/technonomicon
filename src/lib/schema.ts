import { sql, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type User = InferSelectModel<typeof t_user>
export const t_user = sqliteTable('users', {
  user_id: text('user_id').primaryKey(),
  fn: text('fn').notNull().default(''),
  ln: text('ln').notNull().default(''),
  dn: text('dn').notNull().default(''),
  groups: text('groups').notNull().default(''),
  type: integer('type').notNull().default(0),
  enabled: integer('enabled').notNull(),
});

export type Device = InferSelectModel<typeof t_device>
export const t_device = sqliteTable('device', {
  device_id: text('device_id').primaryKey(),
  model_id: text('model_id').references(() => t_model.model_id).notNull(),
  enabled: integer('enabled').notNull().notNull()
});

export type Model = InferSelectModel<typeof t_model>
export const t_model = sqliteTable('model', {
  model_id: integer('model_id').primaryKey(),
  name: text('name').notNull().default(''),
  group: text('group').notNull().default(''),
})

export type UserDevice = InferSelectModel<typeof t_user_device>
export const t_user_device = sqliteTable('user_device', {
  user_device_id: integer('user_device_id').primaryKey(),
  started: text('started').notNull().default(sql`CURRENT_TIMESTAMP`),
  ended: text('ended').default(sql`NULL`),
  status: integer('status').notNull().default(0),
  user_id: text('user_id').references(() => t_user.user_id).notNull(),
  device_id: text('device_id').references(() => t_device.device_id).notNull(),
  admin_id: text('admin_id').references(() => t_admin.admin_id).notNull(),
  assign_type: integer('assign_type').notNull(),
  notes: text('notes').notNull().default(''),
})

export type Admin = InferSelectModel<typeof t_admin>
export const t_admin = sqliteTable('admin', {
  admin_id: text('admin_id').primaryKey(),
  dn: text('dn').notNull(),
  enabled: integer('enabled').notNull().default(1),
});

export type UserNote = InferSelectModel<typeof t_user_note>
export const t_user_note = sqliteTable('user_note', {
  note_id: integer('note_id').primaryKey(),
  user_id: text('user_id').notNull().references(() => t_user.user_id),
  note_type: integer('note_type').notNull().default(0),
  text: text('text').notNull().default(''),
  date: text('date').notNull().default(sql`CURRENT_TIMESTAMP`)
});
