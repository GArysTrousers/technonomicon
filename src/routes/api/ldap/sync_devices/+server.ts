import { json } from "@sveltejs/kit";
import { db } from "$lib/db";
import { t_device } from "$lib/schema";
import ldap from "ldapjs-promise";
import { LDAP_COMPUTER_BASE, LDAP_PASSWORD, LDAP_URL, LDAP_USER } from "$env/static/private";
import { sql } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {

  const client = ldap.createClient({
    url: [LDAP_URL]
  })
  try {
    await client.bind(LDAP_USER, LDAP_PASSWORD)
  } catch (err) {
    client.destroy()
    throw "Wrong password"
  }

  try {
    let res = await client.searchReturnAll(
      LDAP_COMPUTER_BASE,
      {
        filter: `(objectclass=computer)`,
        scope: 'sub',
        attributes: ['name', 'userAccountControl', 'memberOf'],
        paged: true,
      }
    );

    client.destroy()
    
    let devices = []
    for (const m of res.entries) {
      devices.push(parseLdapMachine(m))
    }

    await db
      .insert(t_device)
      .values(devices)
      .onDuplicateKeyUpdate({
        set: {
          model_id: sql`values(${t_device.model_id})`,
          enabled: sql`values(${t_device.enabled})`,
        }
      })
    return json({
      Machines: devices.length
    })
  }
  catch (err) {
    client.destroy()
    throw err
  }

};

const models = new Map<string, number>()
// groups.set('CN=BSC Students,OU=Groups - Other,OU=Groups,DC=bsc,DC=local', 'Student')
models.set('CN=Lenovo 11E,OU=Computer Groups,OU=Groups,OU=BSC,DC=bsc,DC=local', 2)

function parseLdapMachine(entry: ldap.SearchEntry) {
  let data = {}
  data.model = 1
  for (const a of entry.attributes) {
    if (a.type == "memberOf" && typeof a.values === 'object') {
      for (const group of a.values) {
        if (models.has(group)) {
          data.model = models.get(group)
        }
      }
    }
    else if (a.values.length == 1) {
      data[a.type] = a.values[0]
    }
  }
  // console.log(data);

  let device = {
    device_id: String(data.name),
    model_id: data.model,
    enabled: Number(!(data.userAccountControl & 0b10))
  }
  // console.log(user);
  return device;
}

