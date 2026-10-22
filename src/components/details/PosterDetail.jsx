import Header from '../layout/Header'

export default function PosterDetail({ setIsMenuOpen, navigate, poster }) {
    if (!poster) return null

    return (
        <main className="bg-white min-h-screen text-black flex flex-col overflow-x-hidden">

            <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />

            <header className="px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-6 sm:pb-8">
                <button
                    type="button"
                    onClick={() => navigate('projects')}
                    className="text-xs sm:text-sm tracking-widest uppercase text-black/60 hover:text-black transition-colors cursor-pointer bg-transparent border-none -ml-2 px-2 py-3 mb-3 sm:mb-5"
                >
                    ← View All Works
                </button>
                <h1 className="poster-detail-title font-title leading-none">
                    {poster.title}
                </h1>
            </header>

            <div className="flex-1 px-5 sm:px-8 md:px-12 pb-12 sm:pb-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    <div className="flex-1 min-w-0 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm tracking-widest uppercase text-black/60">{poster.year}</span>
                        </div>
                        <div className="w-16 h-px bg-black/10"></div>
                        <div>
                            <h3 className="text-[11px] tracking-[0.2em] uppercase text-black/60 mb-3">About</h3>
                            <div className="flex flex-col gap-3">
                                {poster.description.split('\n\n').map((paragraph, i) => (
                                    <p key={i} className="text-sm leading-relaxed text-black/70">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[55%] shrink-0">
                        <img
                            src={poster.img}
                            decoding="async"
                            alt={poster.title}
                            draggable="false"
                            className="w-full h-auto object-contain border border-[#212631]/50"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
