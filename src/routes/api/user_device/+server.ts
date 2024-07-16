import { error, json } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import { db } from "$lib/db";
import { t_user_device } from '$lib/schema';
import type { RequestHandler } from './$types';

const schema = {
  params: z.object({}),
  body: z.object({
    user_id: z.string(),
    device_id: z.string(),
    assign_type: z.number(),
    notes: z.string(),
  })
}

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    let body = schema.body.parse(await request.json());

    await db
      .insert(t_user_device)
      .values({
        ...body,
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