import { sql, type InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, varchar, text, datetime } from "drizzle-orm/mysql-core";

export type User = InferSelectModel<typeof t_user>
export const t_user = mysqlTable('users', {
  user_id: varchar('user_id', { length: 255 }).primaryKey(),
  fn: varchar('fn', { length: 255 }).notNull().default(''),
  ln: varchar('ln', { length: 255 }).notNull().default(''),
  dn: varchar('dn', { length: 255 }).notNull().default(''),
  groups: text('groups').notNull().default(''),
  type: int('type', { unsigned: true }).notNull().default(0),
  enabled: int('enabled', {unsigned: true}).notNull(),
});


export type Model = InferSelectModel<typeof t_model>
export const t_model = mysqlTable('model', {
  model_id: int('model_id', { unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  group: text('group').notNull().default(''),
})

export type Device = InferSelectModel<typeof t_device>
export const t_device = mysqlTable('device', {
  device_id: varchar('device_id', { length: 255 }).primaryKey(),
  model_id: int('model_id', { unsigned: true }).references(() => t_model.model_id).notNull(),
  enabled: int('enabled', { unsigned: true }).notNull().notNull()
});

export type UserDevice = InferSelectModel<typeof t_user_device>
export const t_user_device = mysqlTable('user_device', {
  user_device_id: int('user_device_id', { unsigned: true }).primaryKey().autoincrement(),
  started: datetime('started').notNull().default(sql`CURRENT_TIMESTAMP`),
  ended: datetime('ended').default(sql`NULL`),
  status: int('status', {unsigned: true}).notNull().default(0),
  user_id: varchar('user_id', { length: 255 }).references(() => t_user.user_id).notNull(),
  device_id: varchar('device_id', { length: 255 }).references(() => t_device.device_id).notNull(),
  admin_id: varchar('admin_id', { length: 255 }).references(() => t_admin.admin_id).notNull(),
  assign_type: int('assign_type', { unsigned: true }).notNull(),
  notes: varchar('notes', { length: 255 }).notNull().default(''),
})

export type UserDeviceNote = InferSelectModel<typeof t_user_device_note>
export const t_user_device_note = mysqlTable('user_device_note', {
  note_id: int('note_id', { unsigned: true }).primaryKey().autoincrement(),
  user_device_id: int('user_device_id', { unsigned: true }).notNull().references(() => t_user_device.user_device_id),
  note_type: int('note_type', { unsigned: true }).notNull().default(0),
  text: text('text').notNull().default(''),
  date: datetime('date').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export type Admin = InferSelectModel<typeof t_admin>
export const t_admin = mysqlTable('admin', {
  admin_id: varchar('admin_id', { length: 255 }).primaryKey(),
  dn: varchar('dn', { length: 255 }).notNull(),
  enabled: int('enabled', { unsigned: true }).notNull().default(1),
});

export type UserNote = InferSelectModel<typeof t_user_note>
export const t_user_note = mysqlTable('user_note', {
  note_id: int('note_id', { unsigned: true }).primaryKey().autoincrement(),
  user_id: varchar('user_id', { length: 255 }).notNull().references(() => t_user.user_id),
  note_type: int('note_type', { unsigned: true }).notNull().default(0),
  text: text('text').notNull().default(''),
  date: datetime('date').notNull().default(sql`CURRENT_TIMESTAMP`)
});
