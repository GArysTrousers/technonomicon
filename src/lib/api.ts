// export async function api<T = any>(url: string, body = {}, fetchMethod = fetch): Promise<T> {
//   return await fetchMethod(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body)
//   }).then(async (t) =>  {
//     if (t.ok) return await t.json()
//     else throw new Error(t.status.toString())
//   })
// }
//                 Get    Get-fr  New/over  Update    Delete
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export class api {
  static async get<T = any>(url: string, body = {}, fetchMethod = fetch) {
    return await api.sendRequest(url, "POST", body, fetchMethod) as T
  }

  static async post<T = any>(url: string, body = {}, fetchMethod = fetch) {
    return await api.sendRequest(url, "POST", body, fetchMethod) as T
  }

  static async put<T = any>(url: string, body = {}, fetchMethod = fetch) {
    return await api.sendRequest(url, "PUT", body, fetchMethod) as T
  }

  static async patch<T = any>(url: string, body = {}, fetchMethod = fetch) {
    return await api.sendRequest(url, "PATCH", body, fetchMethod) as T
  }

  static async delete<T = any>(url: string, body = {}, fetchMethod = fetch) {
    return await api.sendRequest(url, "DELETE", body, fetchMethod) as T
  }

  static async sendRequest(url: string, method: HttpMethod, body = {}, fetchMethod = fetch) {
    return await fetchMethod(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(async (t) => {
      if (t.ok) return await t.json()
      else throw new Error(t.status.toString())
    })
  }
}
