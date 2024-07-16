import { error, json } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import type { RequestHandler } from './save/$types';
import { db } from '../../../hooks.server';
import { t_user_note } from '$lib/schema';
import { sql } from 'drizzle-orm';

const schema = {
  body: z.object({
    note_id: z.number(),
    user_id: z.string(),
    note_type: z.number(),
    text: z.string(),
    date: z.string(),
  })
}

export const PUT: RequestHandler = async ({ params, request, locals, url }) => {
  try {
    let body = schema.body.parse(await request.json());

    if (body.note_id === 0) {
      await db
      .insert(t_user_note)
      .values({
        user_id: body.user_id,
        note_type: body.note_type,
        text: body.text,
        date: sql`CURRENT_TIMESTAMP`,
      })
    }

    

    return json({})
  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    throw error(400);
  }
};