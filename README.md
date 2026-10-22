<img src="public/images/1001.png" alt="Hello there, this is Lei Gabriel" width="1200" />

# Lei Gabriel — portfolio

Personal portfolio of Lei Gabriel, web developer and graphic designer.
Live at [leigabriel.vercel.app](https://leigabriel.vercel.app).

## Stack

React 19, Vite, Tailwind CSS 4, GSAP, Lenis and three.js.

## Scripts

```bash
npm install
npm run dev      # start the dev server
npm run lint     # eslint
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Notes

- Routes use the URL hash (`#/about`, `#/works`, `#/archive`). Unknown paths get a real 404 from `404.html`, which is a copy of the app shell generated at build time.
- Poster, archive and project images are served as WebP. The original PNG/JPG files are kept in `public/images` as sources and are not referenced by the site.
- Fonts are self-hosted as woff2 in `public/fonts`.
