import { error, json } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import { db } from '../../../../hooks.server';
import { t_user_device } from '$lib/schema';
import type { RequestHandler } from './$types';
import { eq, sql } from 'drizzle-orm';
import { AssignStatus } from '$lib/types';

const schema = {
  params: z.object({}),
  body: z.object({
    id: z.number(),
    status: z.number(),
  })
}

export const PATCH: RequestHandler = async ({ request, url }) => {
  try {
    let body = schema.body.parse(await request.json());

    await db
    .update(t_user_device)
    .set({
      ended: body.status === AssignStatus.Assigned ? sql`NULL` : sql`CURRENT_TIMESTAMP`,
      status: body.status
    })
    .where(eq(t_user_device.user_device_id, body.id))

    return json({})
  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    throw error(400);
  }
};