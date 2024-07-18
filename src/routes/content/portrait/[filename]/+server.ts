import { error, json } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import type { RequestHandler } from './$types';
import { readFile } from "node:fs/promises";
import { CONTENT_DIR } from '$env/static/private';

const schema = {
  params: z.object({
    filename: z.string()
  }),
  body: z.object({})
}

export const GET: RequestHandler = async ({ params, request, locals, url }) => {
  try {
    let { filename } = schema.params.parse(params)

    try {
      let data = await readFile(`${CONTENT_DIR}/portraits/${filename}`)
      return new Response(data, {
        headers: {
          'Content-Type': 'img/*'
        }
      })
    } catch (e) {
      
    }

    return json({})
  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    throw error(400);
  }
  throw error(404)
};