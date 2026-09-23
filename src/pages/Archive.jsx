import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'

const archiveItems = [
    { title: 'Call Me', image: '/images/archive/call_me.png' },
    { title: 'Evil Jordan', image: '/images/archive/evil_jordan.png' },
    { title: 'Giselle', image: '/images/archive/giselle.jpg' },
    { title: 'Like Jennie', image: '/images/archive/jennie.png' },
    { title: 'New Jeans', image: '/images/archive/new_jeans.png' },
    { title: 'Heaven Sent', image: '/images/archive/ningning.png' },
    { title: 'Perception', image: '/images/archive/perception.png' },
    { title: 'Pusa', image: '/images/archive/pusa.png' },
    { title: 'Rockstar', image: '/images/archive/rockstar.png' },
    { title: 'Vintage', image: '/images/archive/vintage.png' },
]

export default function Archive({ setIsMenuOpen, navigate }) {
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        if (!selected) return undefined

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setSelected(null)
        }
        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [selected])

    return (
        <main className="bg-white min-h-screen text-black overflow-x-hidden">
            <style>{`
                .archive-title { font-size: clamp(2.75rem, 8vw, 8rem); letter-spacing: -0.035em; }
                .archive-number { font-size: clamp(2rem, 4vw, 4rem); line-height: .95; }
            `}</style>

            <div className="fixed top-0 left-0 z-50 w-full p-4 sm:p-6 md:p-10 pointer-events-none">
                <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />
            </div>

            <header className="px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-10 sm:pb-12">
                <h1 className="archive-title font-title leading-none">Archive</h1>
            </header>

            <section className="bg-[#f2f2f2] border-t-2 border-dotted border-black/30 px-5 sm:px-8 md:px-12 py-6 sm:py-10">
                <div className="flex justify-between items-end border-b-2 border-dotted border-black/30 pb-4 mb-6">
                    <h2 className="archive-number font-title">2026</h2>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-black/45">{archiveItems.length} records</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-7 gap-y-8 sm:gap-y-12">
                    {archiveItems.map((item, index) => (
                        <button key={item.title} onClick={() => setSelected(item)} className="text-left group cursor-pointer">
                            <div className="aspect-4/5 overflow-hidden bg-black/10">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.025] transition-all duration-500" />
                            </div>
                            <div className="grid grid-cols-[auto_1fr] gap-4 pt-3 border-b-2 border-dotted border-black/25 pb-3 text-[9px] sm:text-[10px] tracking-widest uppercase">
                                <span className="text-black/35">{String(index + 1).padStart(2, '0')}</span>
                                <span>{item.title}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {selected && (
                <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/80 backdrop-blur-xl p-5" onClick={() => setSelected(null)} role="dialog" aria-modal="true" aria-label={`${selected.title} preview`}>
                    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 pointer-events-none">
                        <span className="truncate text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-white/60">{selected.title}</span>
                        <button type="button" className="pointer-events-auto shrink-0 rounded-full border border-white/40 bg-black/25 px-4 py-2 text-[9px] tracking-[0.2em] uppercase text-white transition-all hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={() => setSelected(null)} autoFocus>
                            Close <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <img src={selected.image} alt={selected.title} draggable="false" className="max-w-[90vw] max-h-[82dvh] object-contain" onClick={(event) => event.stopPropagation()} />
                </div>
            )}
        </main>
    )
}
