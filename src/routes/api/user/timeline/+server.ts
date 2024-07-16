import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "../../../../hooks.server";
import { t_device, t_model, t_user, t_user_device, t_user_note } from "$lib/schema";
import { desc, eq } from "drizzle-orm";
import { ZodError, z } from 'zod'

const schema = {
  body: z.object({
    id: z.string(),
  })
}
export const POST: RequestHandler = async ({ request, url }) => {
  try {
    let body = schema.body.parse(await request.json())

    const devices = await db
      .select({
        device_id: t_device.device_id,
        model: t_model.name,
        enabled: t_device.enabled,
        user_device_id: t_user_device.user_device_id,
        date: t_user_device.started,
        ended: t_user_device.ended,
        status: t_user_device.status,
        admin_id: t_user_device.admin_id,
        assign_type: t_user_device.assign_type,
        notes: t_user_device.notes,
      })
      .from(t_user_device)
      .innerJoin(t_device, eq(t_device.device_id, t_user_device.device_id))
      .leftJoin(t_model, eq(t_device.model_id, t_model.model_id))
      .where(eq(t_user_device.user_id, body.id))
      .orderBy(desc(t_user_device.started));

    const notes = await db
      .select()
      .from(t_user_note)
      .where(eq(t_user_note.user_id, body.id))
      .orderBy(desc(t_user_note.date));

      const timeline = [
        ...notes.map((v) => ({...v, type: "note"})),
        ...devices.map((v) => ({...v, type: "device"}))
      ].sort((a, b) => {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0
      })

    return json(timeline)

  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    throw error(400);
  }
};

export type GetTimelineRes = ({
  type: "note";
  note_id: number;
  user_id: string;
  note_type: number;
  text: string;
  date: string;
} | {
  type: "device";
  device_id: string;
  model: string | null;
  enabled: number;
  user_device_id: number;
  date: string;
  ended: string | null;
  status: number;
  admin_id: string;
  assign_type: number;
  notes: string;
})[]