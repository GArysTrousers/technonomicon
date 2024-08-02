import { error, json } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import { db } from "$lib/db";
import { t_user_device, t_user_device_note } from '$lib/schema';
import type { RequestHandler } from './$types';
import { eq, inArray } from 'drizzle-orm';


const put = {
  body: z.object({
		user_device_id: z.number(),
		date: z.string().datetime(),
		text: z.string(),
		note_type: z.number(),
	})
}
export const PUT: RequestHandler = async ({ request, url }) => {
  try {
    let body = put.body.parse(await request.json());
    let date = new Date(body.date)
    
    await db
      .insert(t_user_device_note)
      .values({
        ...body,
        date,
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

const patch = {
  body: z.object({
    note_id: z.number(),
		user_device_id: z.number(),
		date: z.string().datetime(),
		text: z.string(),
		note_type: z.number(),
	})
}
export const PATCH: RequestHandler = async ({ request, url }) => {
  try {
    let body = patch.body.parse(await request.json());
    let date = new Date(body.date)
    
    await db
      .insert(t_user_device_note)
      .values({
        ...body,
        date,
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