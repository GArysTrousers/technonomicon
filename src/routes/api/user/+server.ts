import { error, json } from "@sveltejs/kit";
import { db } from "$lib/db";
import { t_user } from "$lib/schema";
import { eq, inArray } from "drizzle-orm";
import { ZodError, z } from "zod";
import type { RequestHandler } from "./$types";

const post = {
  body: z.object({
    id: z.string().optional(),
    ids: z.array(z.string()).optional(),
    onlyEnabled: z.boolean().optional().default(true)
  })
}

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    let body = post.body.parse(await request.json());

    if (body.id) {
      const res = await db
        .select()
        .from(t_user)
        .where(eq(t_user.user_id, body.id))
      if (res.length > 0) return json(res[0])
      else error(404)
    } else if (body.ids) {
      const res = await db
        .select()
        .from(t_user)
        .where(inArray(t_user.user_id, body.ids))
      return json(res)
    } else {
      const res = await db
        .select()
        .from(t_user)
        .where(eq(t_user.enabled, +body.onlyEnabled))
      return json(res)
    }
  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    else console.log(e);
    throw error(400);
  }
};

export type GetUserOneRes = {
  type: number;
  user_id: string;
  fn: string;
  ln: string;
  dn: string;
  groups: string;
  enabled: number;
}

export type GetUserListRes = {
  type: number;
  user_id: string;
  fn: string;
  ln: string;
  dn: string;
  groups: string;
  enabled: number;
}[]

export type GetUserAllRes = {
  type: number;
  user_id: string;
  fn: string;
  ln: string;
  dn: string;
  groups: string;
  enabled: number;
}[]
