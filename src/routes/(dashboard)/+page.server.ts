import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { t_device, t_user, t_user_device } from '$lib/schema';
import { count, countDistinct, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
  const [users] = await db
    .select({ count: count() }).from(t_user).where(eq(t_user.enabled, 1))

  const [usersWithDevices] = await db
    .select({ count: countDistinct(t_user.user_id) }).from(t_user)
    .innerJoin(t_user_device, eq(t_user.user_id, t_user_device.user_id))
    .where(eq(t_user.enabled, 1))
    //theres needs to be a check here to see if the assignment is active


  const [devices] = await db
  .select({ count: count() }).from(t_device).where(eq(t_device.enabled, 1))

  const [devicesWithUsers] = await db
    .select({ count: countDistinct(t_device.device_id) }).from(t_device)
    .innerJoin(t_user_device, eq(t_device.device_id, t_user_device.device_id))
    .where(eq(t_device.enabled, 1))

  return {
    users: users.count,
    usersWithDevices: usersWithDevices.count,
    devices: devices.count,
    devicesWithoutUsers: devices.count - devicesWithUsers.count
  };

  error(404, 'Not found');
};