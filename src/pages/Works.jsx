import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Header from '../components/layout/Header'
import { playSfx } from '../lib/sfx'
import { posterProjects, webProjects, motionProjects } from '../data'
const WorksKeychain = lazy(() => import('../components/works/WorksKeychain'))

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

    useEffect(() => {
        const media = window.matchMedia(query)
        const update = () => setMatches(media.matches)
        update()
        media.addEventListener('change', update)
        return () => media.removeEventListener('change', update)
    }, [query])

    return matches
}

// Rows are clickable blocks that hold images and paragraphs, so they cannot be
// buttons; give them link semantics and keyboard activation instead.
function rowProps(onActivate) {
    return {
        role: 'link',
        tabIndex: 0,
        onClick: onActivate,
        onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onActivate()
            }
        },
    }
}

// Matches the folder open transition. The decorative keychain and the motion
// films are mounted after it completes so they cannot stall the animation.
const FOLDER_SETTLE_MS = 520

function MotionPreview({ src, title, className = '' }) {
    const videoRef = useRef(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return undefined

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { rootMargin: '200px 0px' },
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (inView) video.play().catch(() => {})
        else video.pause()
    }, [inView])

    return (
        <video
            ref={videoRef}
            src={inView ? src : undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-label={title}
            className={className}
        />
    )
}

export default function Works({ setIsMenuOpen, navigate, activeTab, setActiveTab }) {
    const showKeychain = useMediaQuery('(min-width: 768px)')
    const [settledTab, setSettledTab] = useState(null)
    const initialTab = useRef(activeTab)
    const tabRefs = useRef([])
    const readyTab = settledTab === activeTab ? activeTab : null

    useEffect(() => {
        if (!Number.isInteger(activeTab)) return undefined
        const timer = setTimeout(() => setSettledTab(activeTab), FOLDER_SETTLE_MS)
        return () => clearTimeout(timer)
    }, [activeTab])

    useEffect(() => {
        const index = initialTab.current
        const folder = index === null || index === undefined ? null : tabRefs.current[index]
        if (!folder) return undefined
        const top = index > 0 ? Math.max(0, folder.getBoundingClientRect().top + window.scrollY - 72) : 0
        const timer = setTimeout(() => window.scrollTo({ top, behavior: 'smooth' }), 150)
        return () => clearTimeout(timer)
    }, [])

    const handleTabClick = (index) => {
        const isOpening = activeTab !== index
        if (isOpening) {
            playSfx({ volume: 0.5 })
        }
        setSettledTab(null)
        setActiveTab(activeTab === index ? null : index)
    }

    return (
        <main className="bg-white min-h-screen text-black flex flex-col overflow-x-hidden">
            <style>{`
                .projects-content {
                    position: relative;
                    z-index: 10;
                    padding-left: clamp(1.25rem, 3vw, 3rem);
                    padding-right: clamp(1.25rem, 3vw, 3rem);
                }

                .works-keychain {
                    z-index: 0;
                    top: calc(var(--head) + 0.5rem);
                    left: clamp(0.5rem, 1.5vw, 1.25rem);
                    width: min(34vw, 20rem);
                    height: min(34vw, 20rem);
                }

                /* Folder geometry. Every folder is one numbered tab plus a big title
                   row (--head tall), and the next folder starts right under it, so
                   closed folders form a staircase. The outline is a polygon with
                   small chamfers standing in for rounded corners. */
                .folder-tab {
                    --tab-slant: 2.25rem;
                    --head: 6.5rem;
                    --spacer: 4.5rem;
                    --edge: 1rem;
                    --r: 0.5rem;
                    --r-tab: 0px;
                    --tab-offset: 0px;
                    --tab-width: min(17.25rem, calc(100% - 4.5rem));
                    clip-path: polygon(
                        calc(var(--tab-offset) + var(--r-tab)) 0,
                        min(calc(var(--tab-offset) + var(--tab-width)), calc(100% - var(--tab-slant))) 0,
                        min(calc(var(--tab-offset) + var(--tab-width) + var(--tab-slant)), 100%) var(--tab-slant),
                        calc(100% - var(--r)) var(--tab-slant),
                        calc(100% - var(--r) * 0.293) calc(var(--tab-slant) + var(--r) * 0.293),
                        100% calc(var(--tab-slant) + var(--r)),
                        100% 100%,
                        0 100%,
                        0 var(--tab-slant),
                        var(--tab-offset) var(--tab-slant),
                        var(--tab-offset) var(--r-tab),
                        calc(var(--tab-offset) + var(--r-tab) * 0.293) calc(var(--r-tab) * 0.293)
                    );
                }

                .folder-tab--2, .folder-tab--3 { margin-top: calc(var(--spacer) * -1); }
                .folder-spacer { height: var(--spacer); }

                .folder-tab .tab-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    width: 100%;
                    height: var(--head);
                    padding: 0 var(--edge) 0 calc(var(--tab-offset) + var(--edge));
                    text-align: left;
                }

                .folder-index {
                    display: flex;
                    align-items: center;
                    height: var(--tab-slant);
                    font-family: var(--font-body);
                    font-size: 12px;
                    letter-spacing: 0.06em;
                }

                .folder-tab .folder-title {
                    max-width: none;
                    padding: 0;
                    margin-top: 0.15rem;
                    font-size: clamp(2.5rem, 11vw, 3.5rem);
                    line-height: 1;
                    white-space: nowrap;
                }

                @media (min-width: 1024px) {
                    .folder-tab {
                        --tab-slant: 2.4375rem;
                        --head: 8.125rem;
                        --spacer: 6rem;
                        --edge: 2rem;
                        --tab-step: clamp(18rem, 25.52vw, 42rem);
                        --tab-width: calc(var(--tab-step) - var(--tab-slant) - 0.625rem);
                    }
                    .folder-tab--2 { --tab-offset: var(--tab-step); --r-tab: 0.5rem; }
                    .folder-tab--3 { --tab-offset: calc(var(--tab-step) * 2); --r-tab: 0.5rem; }
                    .folder-tab .folder-title { font-size: clamp(4rem, 5.3vw, 6rem); }

                    /* The keychain hangs in its own left gutter so it never
                       sits behind the project rows. */
                    .works-keychain {
                        left: 1rem;
                        width: 12rem;
                        height: 12rem;
                    }

                    .projects-content {
                        padding-left: 12rem;
                    }
                }

                .project-row {
                    padding: clamp(0.75rem, 2vw, 1.25rem) 0;
                    cursor: url('/cursors/link.svg') 12 0, pointer !important;
                    transition: background 0.15s;
                }

                .project-row-thumb {
                    object-fit: contain;
                }

                .folder-tab .project-row,
                .folder-tab .project-row *,
                .folder-tab .project-row img,
                .folder-tab .project-row span,
                .folder-tab .project-row-thumb {
                    cursor: url('/cursors/pointer.svg') 12 0, pointer !important;
                }

                .folder-tab .tab-btn,
                .folder-tab .tab-btn *,
                .folder-tab .tab-btn h2,
                .folder-tab .tab-btn div {
                    cursor: url('/cursors/pointer.svg') 12 0, pointer !important;
                }
            `}</style>

            <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />

            <header className="flex items-end justify-between px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-10 sm:pb-12">
                <h1 className="projects-title font-title leading-none">
                    Works
                </h1>
            </header>

            <div className="w-full text-black mt-auto flex flex-col pt-6 sm:pt-12">

                <div ref={(el) => { tabRefs.current[0] = el }} className="folder-tab bg-[#b3b3b3] w-full relative z-10">
                    <button type="button" onClick={() => handleTabClick(0)} aria-expanded={activeTab === 0} aria-controls="works-folder-0" className="tab-btn group">
                        <span className="folder-index">01</span>
                        <h2 className="folder-title projects-section-title font-title transition-transform duration-500 md:group-hover:translate-x-3">Web Projects</h2>
                    </button>

                    {showKeychain && readyTab === 0 && (
                        <Suspense fallback={null}>
                            <WorksKeychain src="/models/web-01.glb" />
                        </Suspense>
                    )}

                    <div id="works-folder-0" className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 0 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden" inert={activeTab !== 0}>
                            <div className="projects-content pt-6 sm:pt-8 pb-8 sm:pb-10">

                                {webProjects.length === 0 ? (
                                    <div className="flex flex-col items-start gap-3 py-10 border-b-2 border-dotted border-black/20">
                                        <span className="font-title text-5xl text-black/20">—</span>
                                        <p className="text-xs tracking-widest uppercase text-black/70">Coming soon</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="hidden md:flex items-center justify-between pb-4 border-b-2 border-dotted border-black/20 text-xs md:text-[13px] lg:text-sm tracking-widest uppercase text-black/70">
                                            <div className="flex-1">Title & About</div>
                                            <div className="w-72 lg:w-md shrink-0 text-center">Project</div>
                                        </div>

                                        {webProjects.map((p) => (
                                            <div
                                                key={p.id}
                                                className="project-row flex flex-col md:flex-row items-start gap-4 md:gap-6 border-b-2 border-dotted border-black/15 hover:bg-black/5"
                                                {...rowProps(() => navigate('web-detail', { ...p, type: 'web' }))}
                                            >
                                                <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <span className="text-xs sm:text-sm md:text-base lg:text-lg tracking-widest uppercase text-black">{p.title}</span>
                                                        <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-xs tracking-widest uppercase text-black/70">{p.year}</span>
                                                    </div>
                                                    <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-xs tracking-widest uppercase text-black/70">{p.stack}</span>
                                                    <p className="text-xs sm:text-[13px] md:text-sm lg:text-base text-black/70 leading-relaxed line-clamp-2 md:line-clamp-none">{p.description}</p>
                                                </div>
                                                <div className="w-72 lg:w-md shrink-0 self-end md:self-auto">
                                                    <img src={p.img} alt={p.title} decoding="async" className="project-row-thumb w-full h-auto object-contain rounded border border-[#212631]/50" />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                <div className="pt-6 flex justify-between items-center">
                                    <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-xs tracking-widest uppercase text-black/70">{webProjects.length} WORKS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="folder-spacer" aria-hidden="true"></div>
                </div>

                <div ref={(el) => { tabRefs.current[1] = el }} className="folder-tab folder-tab--2 bg-[#212121] text-white w-full relative z-20">
                    <button type="button" onClick={() => handleTabClick(1)} aria-expanded={activeTab === 1} aria-controls="works-folder-1" className="tab-btn group">
                        <span className="folder-index">02</span>
                        <h2 className="folder-title projects-section-title font-title transition-transform duration-500 md:group-hover:translate-x-3">Poster Design</h2>
                    </button>

                    {showKeychain && readyTab === 1 && (
                        <Suspense fallback={null}>
                            <WorksKeychain src="/models/poster-02.glb" />
                        </Suspense>
                    )}

                    <div id="works-folder-1" className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 1 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden" inert={activeTab !== 1}>
                            <div className="projects-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                                <div className="hidden md:flex items-center justify-between pb-4 border-b-2 border-dotted border-white/20 text-xs md:text-[13px] lg:text-sm tracking-widest uppercase text-white/65">
                                    <div className="flex-1">Title & About</div>
                                    <div className="w-40 lg:w-52 shrink-0 text-center">Poster</div>
                                </div>

                                <div className="flex flex-col">
                                    {posterProjects.map((p) => (
                                        <div
                                            key={p.id}
                                            className="project-row flex flex-col md:flex-row items-start gap-4 md:gap-6 border-b-2 border-dotted border-white/15 hover:bg-white/5"
                                            {...rowProps(() => navigate('poster-detail', { ...p, type: 'poster' }))}
                                        >
                                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                    <span className="text-xs sm:text-sm md:text-base lg:text-lg tracking-widest uppercase text-white">{p.title}</span>
                                                    <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-xs tracking-widest uppercase text-white/65">{p.year}</span>
                                                </div>
                                            </div>
                                            <div className="w-40 lg:w-52 shrink-0 self-end md:self-auto">
                                                <img
                                                    src={p.img}
                                                    alt={p.title}
                                                    draggable="false"
                                                    decoding="async"
                                                    className="w-full aspect-3/4 object-cover rounded border border-white/20"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 flex justify-between items-center">
                                    <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-xs tracking-widest uppercase text-white/65">
                                        {posterProjects.length} WORKS
                                    </span>
                                    <button
                                        onClick={() => navigate('about')}
                                        className="-my-3 -mr-2 px-2 py-3 text-[11px] lg:text-xs tracking-widest uppercase text-white/65 hover:text-white transition-colors cursor-pointer"
                                    >
                                        ABOUT ME →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="folder-spacer" aria-hidden="true"></div>
                </div>

                <div ref={(el) => { tabRefs.current[2] = el }} className="folder-tab folder-tab--3 bg-[#ffff00] w-full relative z-30">
                    <button type="button" onClick={() => handleTabClick(2)} aria-expanded={activeTab === 2} aria-controls="works-folder-2" className="tab-btn group">
                        <span className="folder-index">03</span>
                        <h2 className="folder-title projects-section-title font-title transition-transform duration-500 md:group-hover:translate-x-3">Motion Design</h2>
                    </button>

                    {showKeychain && readyTab === 2 && (
                        <Suspense fallback={null}>
                            <WorksKeychain src="/models/motion-03.glb" />
                        </Suspense>
                    )}

                    <div id="works-folder-2" className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 2 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden" inert={activeTab !== 2}>
                            <div className="projects-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                                <div className="hidden md:flex items-center justify-between pb-4 border-b-2 border-dotted border-black/20 text-xs md:text-[13px] lg:text-sm tracking-widest uppercase text-black/70">
                                    <div className="flex-1">Title & About</div>
                                    <div className="w-40 lg:w-52 shrink-0 text-center">Motion</div>
                                </div>

                                <div className="flex flex-col">
                                    {motionProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="project-row flex flex-col md:flex-row items-start gap-4 md:gap-6 border-b-2 border-dotted border-black/15 hover:bg-black/5"
                                            {...rowProps(() => navigate('motion-detail', { ...project, type: 'motion' }))}
                                        >
                                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                    <span className="text-xs sm:text-sm md:text-base lg:text-lg tracking-widest uppercase text-black">{project.title}</span>
                                                    <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-xs tracking-widest uppercase text-black/70">{project.year}</span>
                                                </div>
                                            </div>
                                            <div className="w-40 lg:w-52 shrink-0 self-end md:self-auto">
                                                {readyTab === 2 ? (
                                                    <MotionPreview
                                                        src={project.video}
                                                        title={project.title}
                                                        className="w-full aspect-3/4 object-cover rounded bg-black/10"
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-3/4 rounded bg-black/10" aria-hidden="true" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 flex justify-between items-center">
                                    <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-xs tracking-widest uppercase text-black/70">
                                        {motionProjects.length} WORKS
                                    </span>
                                    <button
                                        onClick={() => navigate('about')}
                                        className="-my-3 -mr-2 px-2 py-3 text-[11px] lg:text-xs tracking-widest uppercase text-black/70 hover:text-black transition-colors cursor-pointer"
                                    >
                                        ABOUT ME →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="folder-spacer" aria-hidden="true"></div>
                </div>

            </div>
        </main>
    )
}
