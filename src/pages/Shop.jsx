import { useState } from 'react'
import Header from '../components/layout/Header'

const prints = []
const shopNotes = []

export default function Shop({ setIsMenuOpen, navigate }) {
    const [activeTab, setActiveTab] = useState(0)

    const toggleTab = (index) => {
        if (activeTab !== index) {
            const audio = new Audio('/sounds/folder_sfx.mp3')
            audio.volume = 0.5
            audio.play().catch(() => { })
        }
        setActiveTab(activeTab === index ? null : index)
    }

    return (
        <main className="bg-white min-h-screen text-black flex flex-col overflow-x-hidden">
            <style>{`
                .shop-title { font-size: clamp(2.75rem, 8vw, 8rem); letter-spacing: -0.035em; }
                .shop-section-title { font-size: clamp(1.6rem, 5.5vw, 3rem); line-height: 0.95; }
                .shop-folder-title { max-width: min(540px, calc(100% - 5rem)); padding-right: 1rem; white-space: nowrap; }
                .shop-content { padding-left: clamp(1.25rem, 3vw, 3rem); padding-right: clamp(1.25rem, 3vw, 3rem); }
                .shop-folder { clip-path: polygon(0 0, min(540px, calc(100% - 5rem)) 0, min(590px, calc(100% - 1rem)) 5rem, 100% 5rem, 100% 100%, 0 100%); transition: transform .5s cubic-bezier(.16,1,.3,1); }
                .shop-dots { background-image: radial-gradient(circle, rgba(0,0,0,.5) 1.5px, transparent 1.5px); background-size: 8px 8px; height: 3px; }
                @media (hover: hover) { .shop-folder:hover { transform: translateY(-8px); } }
                @media (max-width: 768px) {
                    .shop-folder { clip-path: polygon(0 0, min(540px, calc(100% - 2.75rem)) 0, calc(100% - 0.75rem) 4.5rem, 100% 4.5rem, 100% 100%, 0 100%); }
                    .shop-folder-title { max-width: min(540px, calc(100% - 2.75rem)); }
                }
            `}</style>

            <div className="fixed top-0 left-0 z-50 w-full p-4 sm:p-6 md:p-10 pointer-events-none">
                <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />
            </div>

            <header className="px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-10 sm:pb-12">
                <h1 className="shop-title font-title leading-none">Shop</h1>
            </header>

            <div className="w-full mt-auto flex flex-col pt-6 sm:pt-12">
                <section className={`shop-folder bg-[#ffff00] w-full relative z-10 ${activeTab === 0 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => toggleTab(0)} className="w-full group h-18 md:h-20 flex flex-col justify-end text-left cursor-pointer">
                        <h2 className="shop-folder-title shop-section-title font-title pl-5 sm:pl-8 md:pl-12 pb-3 md:pb-4 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3 transition-all duration-500">01 Print Editions</h2>
                        <div className="shop-dots" />
                    </button>
                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 0 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="shop-content pt-7 pb-10">
                                {prints.length === 0 ? (
                                    <div className="flex flex-col items-start gap-3 py-10 border-b-2 border-dotted border-black/20">
                                        <span className="font-title text-5xl text-black/20">—</span>
                                        <p className="text-xs tracking-widest uppercase text-black/40">Coming soon</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7 sm:gap-8">
                                        {prints.map((print) => (
                                            <article key={print.title} className="border-b-2 border-dotted border-black/30 pb-4">
                                                <div className="aspect-4/5 overflow-hidden bg-black/5">
                                                    <img src={print.image} alt={print.title} className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-[1.02] transition-all duration-500" />
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pt-3 text-[9px] sm:text-[10px] tracking-widest uppercase">
                                                    <span>{print.title}</span>
                                                    <span className="text-black/40">{print.type}</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                                <p className="border-t-2 border-dotted border-black/30 pt-4 text-[10px] tracking-[0.2em] uppercase text-black/40">
                                    {String(prints.length).padStart(2, '0')} editions
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-18 md:h-20" />
                </section>

                <section className={`shop-folder bg-[#b3b3b3] w-full relative z-20 -mt-18 md:-mt-20 ${activeTab === 1 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => toggleTab(1)} className="w-full group h-18 md:h-20 flex flex-col justify-end text-left cursor-pointer">
                        <h2 className="shop-folder-title shop-section-title font-title pl-5 sm:pl-8 md:pl-12 pb-3 md:pb-4 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3 transition-all duration-500">02 Shop Notes</h2>
                        <div className="shop-dots" />
                    </button>
                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 1 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="shop-content py-8">
                                {shopNotes.length === 0 ? (
                                    <div className="flex flex-col items-start gap-3 py-10 border-b-2 border-dotted border-black/20">
                                        <span className="font-title text-5xl text-black/20">—</span>
                                        <p className="text-xs tracking-widest uppercase text-black/40">Coming soon</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-3 gap-6 text-xs tracking-widest uppercase">
                                        {shopNotes.map((note) => (
                                            <p key={note} className="border-b-2 border-dotted border-black/30 pb-4">{note}</p>
                                        ))}
                                    </div>
                                )}
                                <p className="border-t-2 border-dotted border-black/30 pt-4 text-[10px] tracking-[0.2em] text-black/40">
                                    {String(shopNotes.length).padStart(2, '0')} notes
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-18 md:h-20" />
                </section>
            </div>
        </main>
    )
}
