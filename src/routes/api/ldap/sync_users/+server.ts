import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { t_user } from "$lib/schema";
import ldap from "ldapjs-promise";
import { LDAP_BASE, LDAP_PASSWORD, LDAP_STUDENT_BASE, LDAP_URL, LDAP_USER } from "$env/static/private";
import { sql } from "drizzle-orm";
import { UserType } from "$lib/types";

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
      LDAP_STUDENT_BASE,
      {
        filter: `(objectclass=user)`,
        scope: 'sub',
        attributes: ['sAMAccountName', 'userAccountControl', 'givenName', 'sn', 'memberOf', 'displayName', 'mail'],
        paged: true,
      }
    );

    client.destroy()
    // return parseLdapUser(res.entries[0]);
    let users = []
    for (const u of res.entries) {
      let user = parseLdapUser(u)
      user.type = UserType.Student
      users.push(user)
    }

    await db
      .insert(t_user)
      .values(users)
      .onDuplicateKeyUpdate({
        set: {
          fn: sql`values(${t_user.fn})`,
          ln: sql`values(${t_user.ln})`,
          dn: sql`values(${t_user.dn})`,
          type: sql`values(${t_user.type})`,
          groups: sql`values(${t_user.groups})`,
          enabled: sql`values(${t_user.enabled})`,
        }
      })

    return json({
      Users: users.length
    })
  }
  catch (err) {
    client.destroy()
    throw err
  }

};

const groups = new Map<string, string>()
// groups.set('CN=BSC Students,OU=Groups - Other,OU=Groups,DC=bsc,DC=local', 'Student')
groups.set('CN=Year 12,OU=Year Levels,OU=Groups,OU=BSC,DC=bsc,DC=local', 'Year 12')
groups.set('CN=Year 11,OU=Year Levels,OU=Groups,OU=BSC,DC=bsc,DC=local', 'Year 11')
groups.set('CN=Year 10,OU=Year Levels,OU=Groups,OU=BSC,DC=bsc,DC=local', 'Year 10')
groups.set('CN=Year 09,OU=Year Levels,OU=Groups,OU=BSC,DC=bsc,DC=local', 'Year 09')
groups.set('CN=Year 08,OU=Year Levels,OU=Groups,OU=BSC,DC=bsc,DC=local', 'Year 08')
groups.set('CN=Year 07,OU=Year Levels,OU=Groups,OU=BSC,DC=bsc,DC=local', 'Year 07')

function parseLdapUser(entry: ldap.SearchEntry) {
  let data = {}
  data.groups = []
  for (const a of entry.attributes) {
    if (a.type == "memberOf" && typeof a.values === 'object') {
      for (const group of a.values) {
        if (groups.has(group)) {
          data.groups.push(groups.get(group))
        }
      }
    }
    else if (a.values.length == 1) {
      data[a.type] = a.values[0]
    }
  }
  // console.log(data);

  let user = {
    user_id: String(data.sAMAccountName),
    fn: String(data.givenName),
    ln: String(data.sn),
    dn: String(data.displayName),
    type: 0,
    groups: data.groups.join(', '),
    enabled: Number(!(data.userAccountControl & 0b10))
  }
  // console.log(user);
  return user;
}

