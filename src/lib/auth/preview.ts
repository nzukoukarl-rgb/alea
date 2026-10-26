/**
 * Live-preview host allowlist (server-only).
 *
 * The sandbox serves each live preview on a dynamic `https://*.grok-sandbox.com` URL. Better Auth
 * validates the request host against this list. No OAuth client, secret or broker address lives
 * here: sign-in is email and password only (see `providers.ts`).
 */

/**
 * Host patterns whose callbacks the preview client accepts. Better Auth derives
 * the live preview's real origin from the request host and validates it against
 * this list (wildcard-matched), so the OAuth `redirect_uri` becomes the concrete
 * `https://<preview-host>/api/auth/oauth2/callback/...` the broker allows.
 */
export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
