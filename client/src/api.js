export const BASE_URL = import.meta.env.VITE_HOST || 'http://localhost:8081/'

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  const options = { method, headers }

  if (body instanceof FormData) {
    // the browser sets the multipart boundary itself
    options.body = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }
  if (auth) {
    headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
  }

  const res = await fetch(BASE_URL + path, options)
  if (!res.ok) {
    let message
    try {
      message = (await res.json()).message
    } catch {
      // response body was not JSON
    }
    throw new Error(message || `${method} ${path} failed (${res.status})`)
  }

  // some endpoints return JSON, others plain text ("Ok", "It worked!")
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  delete: (path, body, opts) => request(path, { ...opts, method: 'DELETE', body })
}
