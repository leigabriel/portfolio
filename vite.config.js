import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        notFoundShell(),
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
})
