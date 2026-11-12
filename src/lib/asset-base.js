// Builds the public base URL for Supabase Storage objects.
//
// Kept as a plain function so both the browser helper (src/lib/assets.js) and
// vite.config.js can use the same logic. Vite config runs in Node, where
// import.meta.env is not available, so the URL and bucket are passed in.
export function buildAssetBase(url, bucket = 'portfolio') {
    const projectUrl = String(url || '').trim().replace(/\/+$/, '')
    if (!projectUrl) return ''

    const cleanBucket = String(bucket || 'portfolio').trim().replace(/^\/+|\/+$/g, '')
    return `${projectUrl}/storage/v1/object/public/${encodeURIComponent(cleanBucket)}`
}
