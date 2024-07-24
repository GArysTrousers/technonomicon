import { error, json } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import { db } from "$lib/db";
import { t_user_device } from '$lib/schema';
import type { RequestHandler } from './$types';
import { eq, inArray } from 'drizzle-orm';


const post = {
  body: z.object({
    id: z.number().optional(),
    ids: z.array(z.number()).optional(),
    onlyEnabled: z.boolean().optional().default(true)
  })
}

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    let body = post.body.parse(await request.json());

    if (body.id) {
      const res = await db
        .select()
        .from(t_user_device)
        .where(eq(t_user_device.user_device_id, body.id))
      if (res.length > 0) return json(res[0])
      else error(404)
    } else if (body.ids) {
      const res = await db
        .select()
        .from(t_user_device)
        .where(inArray(t_user_device.user_device_id, body.ids))
      return json(res)
    } else {
      const res = await db
        .select()
        .from(t_user_device)
      return json(res)
    }
  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    throw error(400);
  }
};

const put = {
  body: z.object({
    user_id: z.string(),
    device_id: z.string(),
    assign_type: z.number(),
    started: z.string().datetime(),
    notes: z.string(),
  })
}
export const PUT: RequestHandler = async ({ request, url }) => {
  try {
    let body = put.body.parse(await request.json());
    let started = new Date(body.started)
    
    await db
      .insert(t_user_device)
      .values({
        ...body,
        started,
        admin_id: 'abc',
      })

    return json({})
  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    else
      console.log(e);
    throw error(400);
  }
};