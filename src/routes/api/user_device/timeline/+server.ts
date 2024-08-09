import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { t_device, t_model, t_user, t_user_device, t_user_device_note, t_user_note } from "$lib/schema";
import { desc, eq } from "drizzle-orm";
import { ZodError, z } from 'zod'

const post = {
  body: z.object({
    id: z.number(),
  })
}
export const POST: RequestHandler = async ({ request, url }) => {
  try {
    let body = post.body.parse(await request.json())

    const notes = await db
      .select()
      .from(t_user_device_note)
      .where(eq(t_user_device_note.user_device_id, body.id))
      .orderBy(desc(t_user_device_note.date));

    return json(notes)

  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    else
      console.log(e)
    throw error(400);
  }
};

export type GetTimelineRes = {
  status: number;
  date: Date;
  note_id: number;
  user_device_id: number;
  text: string;
  note_type: number;
}[]