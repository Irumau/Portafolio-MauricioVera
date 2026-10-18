import { request, tokenStorage } from './api.js'

export async function login(email, password) {
  const { token, user } = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  tokenStorage.set(token)
  return user
}

export function getMe() {
  return request('/auth/me', { auth: true })
}

export function logout() {
  tokenStorage.clear()
}
