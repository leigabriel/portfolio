import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { buildAssetBase } from './src/lib/asset-base.js'

// Vercel serves 404.html with a real 404 status for unknown paths. The app
// renders its own Not Found view from the same shell, so reuse index.html.
function notFoundShell() {
    return {
        name: 'not-found-shell',
        apply: 'build',
        closeBundle() {
            const index = resolve('dist/index.html')
            if (existsSync(index)) copyFileSync(index, resolve('dist/404.html'))
        },
    }
}

// Replaces %SUPABASE_ASSET_BASE% in index.html with the same public asset base
// the app uses at runtime. Keeping one source of truth avoids an OG image that
// points at a different project or bucket than the rest of the site.
function supabaseAssetBase(env, mode) {
    const base = buildAssetBase(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_BUCKET)

    return {
        name: 'supabase-asset-base',
        configResolved() {
            if (mode === 'production' && !base) {
                throw new Error(
                    'VITE_SUPABASE_URL is required for production builds. ' +
                        'Copy .env.example to .env and set the Supabase project URL.'
                )
            }
        },
        transformIndexHtml(html) {
            return html.replaceAll('%SUPABASE_ASSET_BASE%', base)
        },
    }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '')

    return {
        plugins: [
            react(),
            tailwindcss(),
            notFoundShell(),
            supabaseAssetBase(env, mode),
        ],
        build: {
            // three.js is ~630 kB on its own and is loaded lazily, off the entry chunk.
            chunkSizeWarningLimit: 700,
            rollupOptions: {
                output: {
                    // Keep the large 3D and animation libraries out of the entry chunk.
                    manualChunks(id) {
                        if (id.includes('node_modules/three')) return 'three'
                        if (id.includes('node_modules/gsap')) return 'gsap'
                    },
                },
            },
        },
    }
})
