import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Header from '../components/layout/Header'
import { assetUrl } from '../lib/assets'

const Footer = lazy(() => import('../components/layout/Footer'))

const archiveItems = [
    { title: 'Call Me', image: assetUrl('images/archive/call_me.webp') },
    { title: 'Evil Jordan', image: assetUrl('images/archive/evil_jordan.webp') },
    { title: 'Giselle', image: assetUrl('images/archive/giselle.webp') },
    { title: 'Like Jennie', image: assetUrl('images/archive/jennie.webp') },
    { title: 'New Jeans', image: assetUrl('images/archive/new_jeans.webp') },
    { title: 'Heaven Sent', image: assetUrl('images/archive/ningning.webp') },
    { title: 'Perception', image: assetUrl('images/archive/perception.webp') },
    { title: 'Pusa', image: assetUrl('images/archive/pusa.webp') },
    { title: 'Rockstar', image: assetUrl('images/archive/rockstar.webp') },
    { title: 'Vintage', image: assetUrl('images/archive/vintage.webp') },
    { title: 'Althea', image: assetUrl('images/archive/althea.webp') },
    { title: 'Die For You', image: assetUrl('images/archive/die_for_you.webp') },
    { title: 'Queen Yunjin', image: assetUrl('images/archive/queen_yunjin.webp') },
    {
        title: 'Aeri',
        image: assetUrl('images/archive/aeri.webp'),
        width: 1131,
        height: 1600,
    },
    {
        title: 'Chromurai',
        image: assetUrl('images/archive/chromurai.webp'),
        width: 1131,
        height: 1600,
    },
    {
        title: 'Ferrari F50',
        image: assetUrl('images/archive/ferrari-f50.webp'),
        width: 1131,
        height: 1600,
    },
    {
        title: 'Koenigsegg',
        image: assetUrl('images/archive/koenigsegg.webp'),
        width: 1131,
        height: 1600,
    },
    {
        title: 'Kundiman',
        image: assetUrl('images/archive/kundiman.webp'),
        width: 1600,
        height: 1600,
    },
    {
        title: 'One Piece: Garp',
        image: assetUrl('images/archive/one-piece-garp.webp'),
        width: 1600,
        height: 1600,
    },
    {
        title: 'One Piece: Nami',
        image: assetUrl('images/archive/one-piece-nami.webp'),
        width: 1600,
        height: 1600,
    },
    {
        title: 'One Piece: Robin',
        image: assetUrl('images/archive/one-piece-robin.webp'),
        width: 1600,
        height: 1600,
    },
    {
        title: 'Run',
        image: assetUrl('images/archive/run.webp'),
        width: 1600,
        height: 1600,
    },
    {
        title: 'Solace',
        image: assetUrl('images/archive/solace.webp'),
        width: 1080,
        height: 1350,
    },
    {
        title: 'Vampire Heart',
        image: assetUrl('images/archive/vampire-heart.webp'),
        width: 1600,
        height: 1600,
    },
    {
        title: 'Void',
        image: assetUrl('images/archive/void.webp'),
        width: 1131,
        height: 1600,
    },
]

export default function Archive({ setIsMenuOpen, navigate }) {
    const [selected, setSelected] = useState(null)
    const contactRef = useRef(null)

    useEffect(() => {
        if (!selected) return undefined

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setSelected(null)
        }
        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [selected])

    return (
        <main className="relative min-h-screen bg-white text-black overflow-x-hidden">
            <style>{`
                @keyframes archiveCellIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .archive-cell {
                    animation: archiveCellIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
            `}</style>

            <div className="relative z-1 bg-white">
                <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />

                <header className="flex items-end justify-between px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-10 sm:pb-12">
                    <h1 className="archive-title font-title leading-none">Archive</h1>
                </header>

                <section className="px-5 sm:px-8 md:px-12 pb-16 sm:pb-24">
                    <ol className="m-0 grid list-none grid-cols-2 gap-x-[clamp(0.75rem,1.6vw,1.25rem)] gap-y-[clamp(1.25rem,3vw,2.5rem)] p-0 sm:grid-cols-3 lg:grid-cols-5">
                        {archiveItems.map((item, index) => (
                            <li key={item.title} className="m-0 p-0">
                                <button
                                    type="button"
                                    onClick={() => setSelected(item)}
                                    aria-label={`Open ${item.title}`}
                                    title={item.title}
                                    className="archive-cell group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        width={item.width || 800}
                                        height={item.height || 1000}
                                        loading={index < 8 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        draggable="false"
                                        className="block h-auto w-full select-none object-contain opacity-95 transition-opacity duration-300 group-hover:opacity-100"
                                    />
                                </button>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>

            <div ref={contactRef} className="relative z-0 h-dvh min-h-125">
                <div className="fixed inset-x-0 bottom-0 z-0 h-dvh min-h-125">
                    <Suspense fallback={<div className="h-dvh min-h-125 w-full bg-[#ffea00]" />}>
                        <Footer navigate={navigate} watchRef={contactRef} />
                    </Suspense>
                </div>
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
