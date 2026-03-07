const AUTH_STORAGE_KEY = "atlasai_admin_session"

export function getAdminUsername() {
  return process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? "Admin"
}

export function getAdminPassword() {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "Admin@123"
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true"
}

export function login(username: string, password: string) {
  const valid =
    username === getAdminUsername() && password === getAdminPassword()

  if (valid && typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, "true")
  }

  return valid
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}