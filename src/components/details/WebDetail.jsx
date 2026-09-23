import Header from '../layout/Header'

export default function WebDetail({ setIsMenuOpen, navigate, project }) {
    if (!project) return null

    return (
        <main className="bg-white min-h-screen text-black flex flex-col overflow-x-hidden">
            <style>{`
                .web-detail-title {
                    font-size: clamp(2rem, 6vw, 5rem);
                    letter-spacing: -0.035em;
                    line-height: 0.95;
                }
            `}</style>

            <div className="fixed top-0 left-0 z-50 w-full p-4 sm:p-6 md:p-10 pointer-events-none">
                <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />
            </div>

            <header className="px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-6 sm:pb-8">
                <button
                    onClick={() => navigate('projects')}
                    className="text-xs sm:text-sm tracking-widest uppercase text-black/40 hover:text-black transition-colors cursor-pointer bg-transparent border-none mb-6 sm:mb-8"
                >
                    ← View All Projects
                </button>
                <h1 className="web-detail-title font-title leading-none">
                    {project.title}
                </h1>
            </header>

            <div className="flex-1 px-5 sm:px-8 md:px-12 pb-12 sm:pb-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    <div className="flex-1 min-w-0 flex flex-col gap-5">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-black/40">{project.role}</span>

                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 rounded-full border border-black/10 text-[9px] tracking-[0.15em] uppercase text-black/50">{project.year}</span>
                            {project.stack.split(' · ').map((tech, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full border border-black/10 text-[9px] tracking-[0.15em] uppercase text-black/50">{tech}</span>
                            ))}
                        </div>

                        <div className="w-16 h-px bg-black/10"></div>

                        <div>
                            <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 mb-3">Overview</h3>
                            <div className="flex flex-col gap-3">
                                {project.description.split('\n\n').map((paragraph, i) => (
                                    <p key={i} className="text-sm leading-relaxed text-black/70">{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 mb-3">Key Features</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {project.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-black/60">
                                        <span className="w-1 h-1 rounded-full bg-black shrink-0"></span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-2">
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-[10px] tracking-[0.15em] uppercase font-medium hover:bg-black/80 transition-colors"
                            >
                                Visit Live Site
                                <span>→</span>
                            </a>
                        </div>
                    </div>

                    <div className="w-full lg:w-[55%] shrink-0 self-end lg:self-auto">
                        <img
                            src={project.img}
                            alt={project.title}
                            className="w-full h-auto object-contain border border-[#212631]/50"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
