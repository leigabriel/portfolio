import { useEffect, useRef, useState } from 'react'
import Header from '../components/layout/Header'
import { posterProjects, webProjects, motionProjects } from '../data'

export default function Works({ setIsMenuOpen, navigate, activeTab, setActiveTab }) {
    const [modal, setModal] = useState(null)
    const initialTab = useRef(activeTab)
    const tabRefs = useRef([])

    useEffect(() => {
        const index = initialTab.current
        const folder = index === null || index === undefined ? null : tabRefs.current[index]
        if (!folder) return undefined
        const top = index > 0 ? Math.max(0, folder.getBoundingClientRect().top + window.scrollY - 72) : 0
        const timer = setTimeout(() => window.scrollTo({ top, behavior: 'smooth' }), 150)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!modal) return undefined

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setModal(null)
        }
        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [modal])

    const handleTabClick = (index) => {
        const isOpening = activeTab !== index
        if (isOpening) {
            const audio = new Audio('/sounds/folder_sfx.mp3')
            audio.volume = 0.5
            audio.play().catch(() => { })
        }
        setActiveTab(activeTab === index ? null : index)
    }

    return (
        <main className="bg-white min-h-screen text-black flex flex-col overflow-x-hidden">
            <style>{`
                .projects-title {
                    font-size: clamp(2.75rem, 8vw, 8rem);
                    letter-spacing: -0.035em;
                }

                .projects-section-title {
                    font-size: clamp(1.6rem, 5.5vw, 3rem);
                    line-height: 0.95;
                }

                .folder-title {
                    max-width: min(540px, calc(100% - 5rem));
                    padding-right: 1rem;
                    white-space: nowrap;
                }

                .projects-content {
                    padding-left: clamp(1.25rem, 3vw, 3rem);
                    padding-right: clamp(1.25rem, 3vw, 3rem);
                }

                .folder-tab {
                    clip-path: polygon(0 0, min(540px, calc(100% - 5rem)) 0, min(590px, calc(100% - 1rem)) 5rem, 100% 5rem, 100% 100%, 0 100%);
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
                }

                @media (max-width: 768px) {
                    .folder-tab {
                        clip-path: polygon(0 0, min(540px, calc(100% - 2.75rem)) 0, calc(100% - 0.75rem) 4.5rem, 100% 4.5rem, 100% 100%, 0 100%);
                    }

                    .folder-title {
                        max-width: min(540px, calc(100% - 2.75rem));
                    }
                }

                @media (hover: hover) {
                    .folder-tab:hover {
                        transform: translateY(-8px);
                        filter: brightness(1.03);
                    }
                }

                .dotted-line {
                    background-image: radial-gradient(circle, rgba(0,0,0,0.5) 1.5px, transparent 1.5px);
                    background-size: 8px 8px;
                    height: 3px;
                    width: 100%;
                }

                .dotted-line-white {
                    background-image: radial-gradient(circle, rgba(255,255,255,0.5) 1.5px, transparent 1.5px);
                    background-size: 8px 8px;
                    height: 3px;
                    width: 100%;
                }

                .project-row {
                    padding: clamp(0.75rem, 2vw, 1.25rem) 0;
                    cursor: pointer !important;
                    transition: background 0.15s;
                }

                .project-row *,
                .project-row img,
                .project-row span {
                    cursor: pointer !important;
                }

                .project-row-thumb {
                    object-fit: contain;
                    cursor: pointer !important;
                }

                .tab-btn {
                    cursor: url('/cursors/pointer.svg') 2 0, pointer !important;
                }

                .tab-btn *,
                .tab-btn h2,
                .tab-btn div {
                    cursor: url('/cursors/pointer.svg') 2 0, pointer !important;
                }

                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.96) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }

                .modal-panel { animation: modalIn 0.22s ease-out forwards; }
            `}</style>

            <div className="fixed top-0 left-0 z-50 w-full p-4 sm:p-6 md:p-10 pointer-events-none">
                <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />
            </div>

            <header className="flex items-end justify-between px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-10 sm:pb-12">
                <h1 className="projects-title font-title leading-none">
                    Works
                </h1>
                <div className="flex gap-4 pb-2">
                    <button onClick={() => navigate('archive')} className="font-title text-lg sm:text-4xl tracking-widest cursor-pointer bg-transparent border-none text-gray-500 hover:text-black transition-colors duration-300">
                        Archive
                    </button>
                    <button onClick={() => navigate('shop')} className="font-title text-lg sm:text-4xl tracking-widest cursor-pointer bg-transparent border-none text-gray-500 hover:text-black transition-colors duration-300">
                        Shop
                    </button>
                </div>
            </header>

            <div className="w-full text-black mt-auto flex flex-col pt-6 sm:pt-12">

                <div ref={(el) => { tabRefs.current[0] = el }} className={`folder-tab bg-[#b3b3b3] w-full relative z-10 ${activeTab === 0 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => handleTabClick(0)} className="tab-btn w-full group h-18 md:h-20 flex flex-col justify-end text-left">
                        <div className="pb-3 md:pb-4">
                            <h2 className="folder-title projects-section-title font-title pl-5 sm:pl-8 md:pl-12 text-black transition-all duration-500 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3">
                                01 Web Projects
                            </h2>
                        </div>
                        <div className="dotted-line transition-all duration-500 opacity-60 group-hover:opacity-100"></div>
                    </button>

                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 0 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="projects-content pt-6 sm:pt-8 pb-8 sm:pb-10">

                                {webProjects.length === 0 ? (
                                    <div className="flex flex-col items-start gap-3 py-10 border-b-2 border-dotted border-black/20">
                                        <span className="font-title text-5xl text-black/20">—</span>
                                        <p className="text-xs tracking-widest uppercase text-black/40">Coming soon</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="hidden md:flex items-center justify-between pb-4 border-b-2 border-dotted border-black/20 text-xs tracking-widest uppercase text-black/50">
                                            <div className="flex-1">Title & About</div>
                                            <div className="w-72 lg:w-md shrink-0 text-center">Project</div>
                                        </div>

                                        {webProjects.map((p) => (
                                            <div
                                                key={p.id}
                                                className="project-row flex flex-col md:flex-row items-start gap-4 md:gap-6 border-b-2 border-dotted border-black/15 hover:bg-black/5"
                                                onClick={() => navigate('web-detail', { ...p, type: 'web' })}
                                            >
                                                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs sm:text-sm tracking-widest uppercase text-black">{p.title}</span>
                                                        <span className="text-[9px] tracking-widest uppercase text-black/40">{p.year}</span>
                                                    </div>
                                                    <span className="text-[9px] tracking-widest uppercase text-black/50">{p.stack}</span>
                                                    <p className="text-xs text-black/40 leading-relaxed line-clamp-2">{p.description}</p>
                                                </div>
                                                <div className="w-72 lg:w-md shrink-0 self-end md:self-auto">
                                                    <img src={p.img} alt={p.title} className="project-row-thumb w-full h-auto object-contain rounded border border-[#212631]/50" />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                <div className="pt-6 flex justify-between items-center">
                                    <span className="text-[9px] tracking-widest uppercase text-black/40">{webProjects.length} WORKS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-18 md:h-20"></div>
                </div>

                <div ref={(el) => { tabRefs.current[1] = el }} className={`folder-tab bg-[#ffff00] w-full relative z-20 -mt-18 md:-mt-20 ${activeTab === 1 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => handleTabClick(1)} className="tab-btn w-full group h-18 md:h-20 flex flex-col justify-end text-left">
                        <div className="pb-3 md:pb-4">
                            <h2 className="folder-title projects-section-title font-title pl-5 sm:pl-8 md:pl-12 transition-all duration-500 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3">
                                02 Poster Design
                            </h2>
                        </div>
                        <div className="dotted-line transition-all duration-500 opacity-60 group-hover:opacity-100"></div>
                    </button>

                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 1 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="projects-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                                <div className="hidden md:flex items-center justify-between pb-4 border-b-2 border-dotted border-black/20 text-xs tracking-widest uppercase text-black/50">
                                    <div className="flex-1">Title & About</div>
                                    <div className="w-40 lg:w-52 shrink-0 text-center">Poster</div>
                                </div>

                                <div className="flex flex-col">
                                    {posterProjects.map((p) => (
                                        <div
                                            key={p.id}
                                            className="project-row flex flex-col md:flex-row items-start gap-4 md:gap-6 border-b-2 border-dotted border-black/15 hover:bg-black/5"
                                            onClick={() => navigate('poster-detail', { ...p, type: 'poster' })}
                                        >
                                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs sm:text-sm tracking-widest uppercase text-black">{p.title}</span>
                                                    <span className="text-[9px] tracking-widest uppercase text-black/40">{p.year}</span>
                                                </div>
                                            </div>
                                            <div className="w-40 lg:w-52 shrink-0 self-end md:self-auto">
                                                <img
                                                    src={p.img}
                                                    alt={p.title}
                                                    draggable="false"
                                                    className="w-full aspect-3/4 object-cover rounded border border-[#212631]/50"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 flex justify-between items-center">
                                    <span className="text-[9px] tracking-widest uppercase text-black/25">
                                        {posterProjects.length} WORKS
                                    </span>
                                    <button
                                        onClick={() => navigate('about')}
                                        className="text-[9px] tracking-widest uppercase text-black/40 hover:text-black transition-colors cursor-pointer"
                                    >
                                        ABOUT ME →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-18 md:h-20"></div>
                </div>

                <div ref={(el) => { tabRefs.current[2] = el }} className={`folder-tab bg-[#212121] text-white w-full relative z-30 -mt-18 md:-mt-20 ${activeTab === 2 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => handleTabClick(2)} className="tab-btn w-full group h-18 md:h-20 flex flex-col justify-end text-left">
                        <div className="pb-3 md:pb-4">
                            <h2 className="folder-title projects-section-title font-title pl-5 sm:pl-8 md:pl-12 transition-all duration-500 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3">
                                03 Motion Design
                            </h2>
                        </div>
                        <div className="dotted-line-white transition-all duration-500 opacity-60 group-hover:opacity-100"></div>
                    </button>

                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 2 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="projects-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                                <div className="hidden md:flex items-center justify-between pb-4 border-b-2 border-dotted border-white/20 text-xs tracking-widest uppercase text-white/50">
                                    <div className="flex-1">Title & About</div>
                                    <div className="w-40 lg:w-52 shrink-0 text-center">Motion</div>
                                </div>

                                <div className="flex flex-col">
                                    {motionProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="project-row flex flex-col md:flex-row items-start gap-4 md:gap-6 border-b-2 border-dotted border-white/15 hover:bg-white/5"
                                            onClick={() => navigate('motion-detail', { ...project, type: 'motion' })}
                                        >
                                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs sm:text-sm tracking-widest uppercase text-white">{project.title}</span>
                                                    <span className="text-[9px] tracking-widest uppercase text-white/40">{project.year}</span>
                                                </div>
                                            </div>
                                            <div className="w-40 lg:w-52 shrink-0 self-end md:self-auto">
                                                <video
                                                    src={activeTab === 2 ? project.video : undefined}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    preload="metadata"
                                                    className="w-full aspect-3/4 object-cover rounded"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 flex justify-between items-center">
                                    <span className="text-[9px] tracking-widest uppercase text-white/30">
                                        {motionProjects.length} WORKS
                                    </span>
                                    <button
                                        onClick={() => navigate('about')}
                                        className="text-[9px] tracking-widest uppercase text-white/40 hover:text-white transition-colors cursor-pointer"
                                    >
                                        ABOUT ME →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-18 md:h-20"></div>
                </div>

            </div>

            {modal && (
                <div
                    className="fixed inset-0 z-80 flex items-center justify-center bg-black/50 backdrop-blur-md"
                    onClick={() => setModal(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${modal.title} details`}
                >
                    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 pointer-events-none">
                        <span className="truncate bg-white px-3 py-2 text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-black/60 shadow-sm">
                            {modal.type === 'web' ? `Case Study · ${modal.title}` : modal.title}
                        </span>
                        <button
                            type="button"
                            onClick={() => setModal(null)}
                            className="pointer-events-auto shrink-0 bg-black px-2 py-1 text-[9px] tracking-[0.2em] uppercase text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            autoFocus
                        >
                            close
                        </button>
                    </div>

                    {modal.type === 'web' ? (
                        <div
                            className="modal-panel w-full max-w-2xl mx-4 max-h-[85dvh] overflow-y-auto rounded-lg bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 sm:p-10">
                                <div className="flex items-start gap-5 mb-8">
                                    <img src={modal.img} alt={modal.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover" />
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <h2 className="font-title text-2xl sm:text-3xl text-black leading-tight">{modal.title}</h2>
                                        <span className="text-[10px] tracking-[0.2em] uppercase text-black/40">{modal.role}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-8">
                                    <div className="px-3 py-1.5 rounded-full border border-black/10 text-[9px] tracking-[0.15em] uppercase text-black/50">{modal.year}</div>
                                    {modal.stack.split(' · ').map((tech, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-full border border-black/10 text-[9px] tracking-[0.15em] uppercase text-black/50">{tech}</span>
                                    ))}
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 mb-3">Overview</h3>
                                    <p className="text-sm leading-relaxed text-black/70">{modal.description}</p>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 mb-3">Key Features</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {modal.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-black/60">
                                                <span className="w-1 h-1 rounded-full bg-black shrink-0"></span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-black/10">
                                    <a
                                        href={modal.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-[10px] tracking-[0.15em] uppercase font-medium hover:bg-black/80 transition-colors"
                                    >
                                        Visit Live Site
                                        <span>→</span>
                                    </a>
                                    <button
                                        onClick={() => setModal(null)}
                                        className="flex items-center justify-center px-5 py-2.5 rounded-full border border-black/20 text-black/60 text-[10px] tracking-[0.15em] uppercase hover:bg-black/5 transition-colors cursor-pointer"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : modal.type === 'motion' ? (
                        <div className="modal-panel flex max-h-[82dvh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
                            <video
                                src={modal.video}
                                controls
                                autoPlay
                                playsInline
                                className="block h-auto max-h-[82dvh] w-auto max-w-[92vw] object-contain shadow-2xl"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={modal.img}
                                alt={modal.title}
                                draggable="false"
                                className="modal-panel block"
                                style={{ maxWidth: '90vw', maxHeight: '82dvh', width: 'auto', height: 'auto', objectFit: 'contain', cursor: 'default' }}
                            />
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}
