import { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/layout/Header'

const archiveItems = [
    { title: 'Call Me', image: '/images/archive/call_me.webp' },
    { title: 'Evil Jordan', image: '/images/archive/evil_jordan.webp' },
    { title: 'Giselle', image: '/images/archive/giselle.webp' },
    { title: 'Like Jennie', image: '/images/archive/jennie.webp' },
    { title: 'New Jeans', image: '/images/archive/new_jeans.webp' },
    { title: 'Heaven Sent', image: '/images/archive/ningning.webp' },
    { title: 'Perception', image: '/images/archive/perception.webp' },
    { title: 'Pusa', image: '/images/archive/pusa.webp' },
    { title: 'Rockstar', image: '/images/archive/rockstar.webp' },
    { title: 'Vintage', image: '/images/archive/vintage.webp' },
].map((item) => ({ ...item, type: 'Poster Design', year: '2026' }))

const PREVIEW_WIDTH = 240
const PREVIEW_HEIGHT = 300
const CURSOR_GAP = 28

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function Archive({ setIsMenuOpen, navigate }) {
    const [selected, setSelected] = useState(null)
    const [preview, setPreview] = useState({ item: null, on: false })
    const previewRef = useRef(null)
    const target = useRef({ x: 0, y: 0 })
    const current = useRef({ x: 0, y: 0, tilt: 0 })

    useEffect(() => {
        if (!selected) return undefined

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setSelected(null)
        }
        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [selected])

    // The floating image trails the cursor with a little ease and leans into
    // the direction it is moving. It only runs while a card is hovered.
    useEffect(() => {
        if (!preview.on) return undefined
        const el = previewRef.current
        if (!el) return undefined

        let frame
        const tick = () => {
            const c = current.current
            const dx = target.current.x - c.x
            c.x += dx * 0.18
            c.y += (target.current.y - c.y) * 0.18
            c.tilt += (clamp(dx * 0.12, -9, 9) - c.tilt) * 0.2
            el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) rotate(${c.tilt}deg)`
            frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [preview.on])

    const aim = useCallback((clientX, clientY) => {
        const flip = clientX + CURSOR_GAP + PREVIEW_WIDTH > window.innerWidth - 8
        target.current = {
            x: flip ? clientX - CURSOR_GAP - PREVIEW_WIDTH : clientX + CURSOR_GAP,
            y: clamp(clientY - PREVIEW_HEIGHT / 2, 8, window.innerHeight - PREVIEW_HEIGHT - 8),
        }
    }, [])

    const showPreview = (item, event) => {
        if (event.pointerType && event.pointerType !== 'mouse') return
        if (!preview.on) {
            // First show: start where the pointer is instead of sliding in from the corner.
            aim(event.clientX, event.clientY)
            current.current = { ...target.current, tilt: 0 }
        }
        setPreview({ item, on: true })
    }

    const showForFocus = (item, event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        aim(rect.left + rect.width * 0.6, rect.top + rect.height / 2)
        current.current = { ...target.current, tilt: 0 }
        setPreview({ item, on: true })
    }

    const hidePreview = () => setPreview((state) => ({ ...state, on: false }))

    return (
        <main className="bg-[#f2f2f2] min-h-screen text-[#212121] overflow-x-hidden">
            <style>{`
                .archive-page { padding-left: clamp(1.25rem, 3vw, 3rem); padding-right: clamp(1.25rem, 3vw, 3rem); }

                .archive-cols,
                .archive-card {
                    display: grid;
                    grid-template-columns: 3.5rem minmax(0, 1fr) auto;
                    align-items: center;
                    column-gap: 1rem;
                }
                .archive-cols {
                    padding: 0 1.25rem 0.75rem;
                    font-family: var(--font-body);
                    font-size: 11px;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: rgba(33, 33, 33, 0.55);
                }
                .archive-cols { display: none; }

                .archive-list { display: flex; flex-direction: column; gap: 0.6rem; padding-bottom: 1rem; }

                .archive-card {
                    position: relative;
                    width: 100%;
                    padding: 0.7rem 1.25rem 0.7rem 0.7rem;
                    text-align: left;
                    background: #fff;
                    border-radius: 12px;
                    border: 1px solid rgba(33, 33, 33, 0.08);
                    cursor: url('/cursors/pointer.svg') 12 0, pointer;
                    transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease;
                    animation: archiveIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                    animation-delay: calc(var(--i, 0) * 45ms);
                }
                @keyframes archiveIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .archive-thumb { width: 3.5rem; aspect-ratio: 4 / 5; border-radius: 6px; object-fit: cover; background: rgba(0, 0, 0, 0.08); display: block; }
                .archive-no { display: none; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.1em; }
                .archive-name { font-family: var(--font-title); font-size: clamp(1.5rem, 6vw, 2rem); line-height: 1; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
                .archive-type { display: block; margin-top: 0.4rem; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(33, 33, 33, 0.6); }
                .archive-type--col { display: none; }
                .archive-year { font-family: var(--font-body); font-size: 12px; letter-spacing: 0.1em; }

                .archive-card:focus-visible { outline: 2px solid #212121; outline-offset: 3px; }
                @media (hover: hover) {
                    .archive-card:hover, .archive-card:focus-visible {
                        transform: translateY(-6px);
                        background: #ffe430;
                        box-shadow: 0 18px 32px -14px rgba(0, 0, 0, 0.35);
                    }
                    .archive-card:hover .archive-name, .archive-card:focus-visible .archive-name { transform: translateX(8px); }
                    .archive-card:active { transform: translateY(-2px); }
                }

                /* Floating preview (pointer devices only). */
                .archive-preview {
                    position: fixed;
                    top: 0; left: 0;
                    z-index: 40;
                    width: ${PREVIEW_WIDTH}px;
                    height: ${PREVIEW_HEIGHT}px;
                    pointer-events: none;
                    will-change: transform;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
                .archive-preview.is-on { opacity: 1; }
                .archive-preview img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    border-radius: 10px;
                    box-shadow: 0 24px 50px -18px rgba(0, 0, 0, 0.5);
                    transform: scale(0.9);
                    transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
                    animation: previewIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .archive-preview.is-on img { transform: scale(1); }
                @keyframes previewIn { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
                @media (hover: none), (pointer: coarse) { .archive-preview { display: none; } }

                @media (min-width: 768px) {
                    .archive-cols, .archive-card { grid-template-columns: 3rem minmax(0, 1.2fr) minmax(0, 1fr) 4rem; }
                    .archive-cols { display: grid; }
                    .archive-cols span:last-child { text-align: right; }
                    .archive-thumb { display: none; }
                    .archive-no { display: block; }
                    .archive-card { padding: 1.15rem 1.25rem; }
                    .archive-name { font-size: clamp(1.75rem, 2.6vw, 2.5rem); }
                    .archive-type--inline { display: none; }
                    .archive-type--col { display: block; margin: 0; }
                    .archive-year { text-align: right; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .archive-card, .archive-name, .archive-preview img { animation: none; transition: none; }
                }
            `}</style>

            <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />

            <header className="archive-page pt-20 sm:pt-24 pb-8 sm:pb-12">
                <h1 className="archive-title font-title leading-none">Archive</h1>
            </header>

            <section className="archive-page pb-16 sm:pb-24">
                <div className="archive-cols" aria-hidden="true">
                    <span className="col-no">No.</span>
                    <span>Project</span>
                    <span className="col-type">Category</span>
                    <span>Year</span>
                </div>

                <ul className="archive-list" onPointerLeave={hidePreview} onPointerMove={(event) => { if (preview.on && event.pointerType === 'mouse') aim(event.clientX, event.clientY) }}>
                    {archiveItems.map((item, index) => (
                        <li key={item.title}>
                            <button
                                type="button"
                                className="archive-card"
                                style={{ '--i': index }}
                                onClick={() => setSelected(item)}
                                onPointerEnter={(event) => showPreview(item, event)}
                                onFocus={(event) => showForFocus(item, event)}
                                onBlur={hidePreview}
                                aria-label={`Open ${item.title}`}
                            >
                                <img className="archive-thumb" src={item.image} alt="" width="224" height="280" loading={index < 5 ? 'eager' : 'lazy'} decoding="async" />
                                <span className="archive-no">{String(index + 1).padStart(2, '0')}</span>
                                <span>
                                    <span className="archive-name">{item.title}</span>
                                    <span className="archive-type archive-type--inline">{item.type}</span>
                                </span>
                                <span className="archive-type archive-type--col">{item.type}</span>
                                <span className="archive-year">{item.year}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <p className="pt-4 text-[11px] tracking-[0.2em] uppercase text-black/55">{archiveItems.length} records</p>
            </section>

            <div ref={previewRef} className={`archive-preview${preview.on ? ' is-on' : ''}`} aria-hidden="true">
                {preview.item && <img key={preview.item.image} src={preview.item.image} alt="" draggable="false" />}
            </div>

            {selected && (
                <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/80 backdrop-blur-xl p-5" onClick={() => setSelected(null)} role="dialog" aria-modal="true" aria-label={`${selected.title} preview`}>
                    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 pointer-events-none">
                        <span className="truncate text-[11px] sm:text-[11px] tracking-[0.18em] uppercase text-white/60">{selected.title}</span>
                        <button type="button" className="pointer-events-auto shrink-0 rounded-full border border-white/40 bg-black/25 px-4 py-2 text-[11px] tracking-[0.2em] uppercase text-white transition-all hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={() => setSelected(null)} autoFocus>
                            Close <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <img src={selected.image} alt={selected.title} draggable="false" className="max-w-[90vw] max-h-[82dvh] object-contain" onClick={(event) => event.stopPropagation()} />
                </div>
            )}
        </main>
    )
}
