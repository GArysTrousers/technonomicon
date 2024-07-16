import { json } from "@sveltejs/kit";
import { db } from "../../../hooks.server";
import { t_device, t_model } from "$lib/schema";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
  const res = await db
    .select({
      device_id: t_device.device_id,
      model_name: t_model.name
    })
    .from(t_device)
    .innerJoin(t_model, eq(t_model.model_id, t_device.model_id))
    .where(eq(t_device.enabled, 1))
    .orderBy(t_device.device_id)
  return json(res)
};

export type GetDeviceRes = {
  device_id: string;
  model_name: string;
}[]