import Header from '../layout/Header'

export default function MotionDetail({ setIsMenuOpen, navigate, project }) {
    if (!project) return null

    return (
        <main className="bg-[#212121] min-h-screen text-white flex flex-col overflow-x-hidden">
            <style>{`
                .motion-detail-title {
                    font-size: clamp(2rem, 6vw, 5rem);
                    letter-spacing: -0.035em;
                    line-height: 0.95;
                }
            `}</style>

            <div className="fixed top-0 left-0 z-50 w-full p-4 sm:p-6 md:p-10 pointer-events-none">
                <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="light" />
            </div>

            <header className="px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-6 sm:pb-8">
                <button
                    onClick={() => navigate('projects')}
                    className="text-xs sm:text-sm tracking-widest uppercase text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none mb-6 sm:mb-8"
                >
                    ← View All Projects
                </button>
                <h1 className="motion-detail-title font-title leading-none">
                    {project.title}
                </h1>
            </header>

            <div className="flex-1 px-5 sm:px-8 md:px-12 pb-12 sm:pb-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    <div className="flex-1 min-w-0 flex flex-col gap-4">
                        <span className="text-[9px] tracking-[0.2em] uppercase text-white/40">{project.year}</span>
                        <div className="w-16 h-px bg-white/10"></div>
                        <div>
                            <h3 className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">About</h3>
                            <div className="flex flex-col gap-3">
                                {project.description.split('\n\n').map((paragraph, i) => (
                                    <p key={i} className="text-sm leading-relaxed text-white/70">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[55%] shrink-0 self-end lg:self-auto">
                        <video
                            src={project.video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
