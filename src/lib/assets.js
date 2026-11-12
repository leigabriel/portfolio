import { buildAssetBase } from './asset-base'

// Media lives in Supabase Storage instead of public/. The base URL is
// inlined at build time, so public files are never part of the bundle.
const ASSET_BASE = buildAssetBase(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_BUCKET
)

const ABSOLUTE_URL_RE = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i
const LOCAL_SCHEME_RE = /^(?:data|blob):/i

// Resolves a media path (for example "images/me.webp") to its public Supabase
// URL. Absolute URLs are passed through, and local paths are used as a
// development fallback when Supabase is not configured.
export function assetUrl(path) {
    if (!path) return ''

    const value = String(path)
    if (ABSOLUTE_URL_RE.test(value) || LOCAL_SCHEME_RE.test(value)) return value

    const cleanPath = value.replace(/^\/+/, '')
    return ASSET_BASE ? `${ASSET_BASE}/${cleanPath}` : `/${cleanPath}`
}
