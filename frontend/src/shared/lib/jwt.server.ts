/**
 * Server-only JWT payload decoder.
 * Reads the JWT payload (base64url) without verifying the signature.
 *
 * This is safe because:
 * - Only runs on the Next.js server (uses Buffer, not available in browser)
 * - The token comes from our own HttpOnly `access_cookie`, never user-supplied
 * - Actual signature verification happens in Django on every API call
 * - We only use this to derive UI state (e.g., show admin links)
 */

type JwtPayload = {
  is_admin?: boolean
  is_staff?: boolean
  is_superuser?: boolean
  role?: string
  username?: string
  exp?: number
  [key: string]: unknown
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    // base64url → standard base64 → utf-8 string
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = Buffer.from(base64, 'base64').toString('utf-8')
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function getIsAdminFromToken(token: string | undefined): boolean {
  if (!token) return false
  const payload = decodeJwtPayload(token)
  return payload?.is_admin === true
}
