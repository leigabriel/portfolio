import { useRef, useState } from 'react'
import Header from '../components/layout/Header'

const skillGroups = [
    {
        title: 'Tools',
        items: [
            { label: 'Affinity by Canva', icon: '/svg/affinity.svg' },
            { label: 'VS Code', icon: 'https://svgl.app/library/vscode.svg' },
            { label: 'Canva', icon: 'https://svgl.app/library/canva.svg' },
            { label: 'Android Studio', icon: '/svg/androidstudio.svg' },
        ],
    },
    {
        title: 'Technologies',
        items: [
            { label: 'React.js', icon: 'https://svgl.app/library/react_light.svg' },
            { label: 'Tailwind CSS', icon: 'https://svgl.app/library/tailwindcss.svg' },
            { label: 'Three.js', icon: '/svg/threejs.svg' },
        ],
    },
    {
        title: 'AI',
        items: [
            { label: 'Gemini', icon: 'https://svgl.app/library/gemini.svg' },
            { label: 'ChatGPT', icon: 'https://svgl.app/library/openai.svg' },
            { label: 'Qwen', icon: 'https://svgl.app/library/qwen_light.svg' },
            { label: 'Claude', icon: 'https://svgl.app/library/claude-ai-icon.svg' },
            { label: 'DeepSeek', icon: 'https://svgl.app/library/deepseek.svg' },
        ],
    },
]

const experiences = [
    {
        company: 'FREELANCE',
        location: 'ORIENTAL MINDORO, PH',
        position: 'POSTER DESIGN FOR FRIENDS & CLIENTS',
    },
]

const skills = ['UI/UX DESIGN', 'GRAPHIC DESIGN', 'WEB DEVELOPMENT']

const achievements = []

const bio = [
    'I’m passionate about creating digital experiences that are simple, clear, and easy to use. I enjoy working on designs that not only look good but also make sense to the people who use them.',
    'My background in graphic design and web design has helped me develop an eye for visual details while also understanding how design works in a functional environment. I like turning ideas into clean and practical interfaces, whether I’m working on a website, application, or other digital project.',
    'I’m always interested in learning new tools and improving the way I approach design and development. For me, good work comes from paying attention to the small details, understanding the purpose behind a project, and creating something that feels both useful and well put together.',
]

function playFolderSound() {
    const audio = new Audio('/sounds/folder_sfx.mp3')
    audio.volume = 0.5
    audio.play().catch(() => { })
}

const TABS = [
    { id: 'about', label: 'About' },
    { id: 'details', label: 'Details' },
    { id: 'experiences', label: 'Experiences' },
]

const workLinks = ['Web Projects', 'Poster Design', 'Motion Design']

// A collapsible block inside a paper. Closed content is `inert`, so its links
// cannot be focused while it is visually collapsed.
function Section({ id, title, count, open, onToggle, children }) {
    return (
        <section className="border-t-2 border-dotted border-black/40 first:border-t-0">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={`section-${id}`}
                className="group flex min-h-14 w-full cursor-pointer items-end justify-between gap-4 py-4 text-left"
            >
                <span className="about-section-title font-title transition-transform duration-500 md:group-hover:translate-x-2">
                    {title}
                    {count !== undefined && <sup className="ml-1 text-[0.45em] tracking-widest">({count})</sup>}
                </span>
                <span className="shrink-0 pb-1 text-[11px] uppercase tracking-widest text-black/60 transition-colors group-hover:text-black">
                    {open ? 'Tap to close' : 'Tap to view'}
                </span>
            </button>
            <div id={`section-${id}`} className="grid transition-all duration-500" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                <div className="overflow-hidden" inert={!open}>
                    <div className="pb-6">{children}</div>
                </div>
            </div>
        </section>
    )
}

// A label/value row. Every row shares the same label column so values line up.
function ProfileRow({ label, children, as = 'div', ...rest }) {
    const Tag = as
    return (
        <Tag
            className="grid w-full grid-cols-1 gap-1 border-b border-dotted border-[#212631] py-3 text-left hover:bg-black/5 sm:grid-cols-[9rem_1fr] sm:gap-x-8"
            {...rest}
        >
            <span className="font-title text-lg sm:text-xl uppercase tracking-widest">{label}</span>
            <span className="min-w-0 text-sm sm:text-base tracking-widest uppercase [overflow-wrap:anywhere]">{children}</span>
        </Tag>
    )
}

function TableHead({ columns }) {
    return (
        <div className="hidden md:grid grid-cols-3 gap-8 pb-4 border-b-2 border-dotted border-black/40 text-xs tracking-widest uppercase text-black/70">
            {columns.map((column) => <span key={column}>{column}</span>)}
        </div>
    )
}

function AboutPanel({ navigate }) {
    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(16rem,22rem)_1fr] lg:gap-14">
            <figure className="about-photo mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-none">
                <div className="aspect-4/5 w-full overflow-hidden bg-[#212121]">
                    <img
                        src="/images/me.jpg"
                        alt="Portrait of Lei Gabriel"
                        width="1000"
                        height="1000"
                        decoding="async"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>
                <figcaption className="mt-3 text-[11px] uppercase tracking-widest text-black/60">
                    Lei Gabriel Malibiran · Oriental Mindoro, PH
                </figcaption>
            </figure>

            <div className="flex min-w-0 flex-col gap-8">
                <div>
                    <h2 className="about-section-title font-title">Lei Gabriel Malibiran</h2>
                    <p className="mt-2 text-xs uppercase tracking-widest text-black/70 sm:text-sm">
                        Web Developer &amp; Graphic Designer
                    </p>
                </div>

                <div className="about-body flex max-w-prose flex-col gap-[1.2em] text-black/80">
                    {bio.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                </div>

                <div className="flex flex-col">
                    <ProfileRow label="email">
                        <a href="mailto:malibiranleigabriel@gmail.com" className="lowercase hover:opacity-60">
                            malibiranleigabriel@gmail.com
                        </a>
                    </ProfileRow>
                    <ProfileRow label="instagram">
                        <a href="https://instagram.com/leimxnsquare" target="_blank" rel="noopener noreferrer" className="lowercase hover:opacity-60">
                            @leimxnsquare
                        </a>
                    </ProfileRow>
                    <ProfileRow label="github">
                        <a href="https://github.com/leigabriel" target="_blank" rel="noopener noreferrer" className="lowercase hover:opacity-60">
                            github.com/leigabriel
                        </a>
                    </ProfileRow>
                    <ProfileRow label="works" as="button" type="button" onClick={() => navigate('projects')}>
                        view portfolio →
                    </ProfileRow>
                </div>
            </div>
        </div>
    )
}

function DetailsPanel({ openSections, toggle }) {
    return (
        <div>
            <Section id="skillsets" title="Skillsets" count={skills.length} open={openSections.skillsets} onToggle={() => toggle('skillsets')}>
                {skills.map((label, i) => (
                    <div key={label} className="flex gap-6 border-b-2 border-dotted border-black/40 py-4 hover:bg-black/5">
                        <span className="font-title text-2xl sm:text-4xl">{`0${i + 1}`}</span>
                        <span className="font-title text-2xl sm:text-4xl uppercase">{label}</span>
                    </div>
                ))}
            </Section>

            <Section id="tools" title="Tools, Technologies & AI" open={openSections.tools} onToggle={() => toggle('tools')}>
                <div className="flex flex-col">
                    {skillGroups.map((group) => (
                        <div key={group.title} className="grid border-b-2 border-dotted border-black/40 py-5 md:grid-cols-[minmax(12rem,0.35fr)_1fr] md:gap-8">
                            <span className="mb-3 font-title text-2xl uppercase tracking-widest md:mb-0">{group.title}</span>
                            <div className="flex flex-col">
                                {group.items.map((item) => (
                                    <div key={item.label} className="group flex min-h-14 items-center gap-4 border-b border-dotted border-black/30 py-3 text-xs uppercase tracking-widest transition-colors last:border-b-0 hover:bg-black/5">
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center p-2 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                                            <img
                                                src={item.icon}
                                                alt=""
                                                width="48"
                                                height="48"
                                                className="h-full w-full object-contain"
                                                loading="lazy"
                                                decoding="async"
                                                referrerPolicy="no-referrer"
                                                onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
                                            />
                                        </span>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    )
}

function ExperiencesPanel({ openSections, toggle }) {
    return (
        <div>
            <Section id="experience" title="Experiences" count={experiences.length} open={openSections.experience} onToggle={() => toggle('experience')}>
                <TableHead columns={['Location', 'Company', 'Position']} />
                {experiences.map((exp) => (
                    <div key={exp.position} className="grid grid-cols-1 gap-2 border-b-2 border-dotted border-black/40 py-6 transition-colors hover:bg-black/5 md:grid-cols-3 md:gap-8">
                        <span className="text-xs sm:text-sm tracking-widest uppercase text-black/70">{exp.location}</span>
                        <span className="text-xs sm:text-sm tracking-widest uppercase">{exp.company}</span>
                        <span className="text-xs sm:text-sm tracking-widest uppercase">{exp.position}</span>
                    </div>
                ))}
            </Section>

            <Section id="achievements" title="Achievements" count={achievements.length} open={openSections.achievements} onToggle={() => toggle('achievements')}>
                {achievements.length === 0 ? (
                    <div className="flex flex-col items-start gap-3 border-b-2 border-dotted border-black/40 py-10">
                        <span className="font-title text-5xl text-black/20" aria-hidden="true">—</span>
                        <p className="text-xs uppercase tracking-widest text-black/70">Nothing to see here for now</p>
                    </div>
                ) : (
                    <>
                        <TableHead columns={['Year', 'Achievement', 'Event']} />
                        {achievements.map((item) => (
                            <div key={`${item.year}-${item.title}`} className="grid grid-cols-1 gap-2 border-b-2 border-dotted border-black/40 py-6 transition-colors hover:bg-black/5 md:grid-cols-3 md:gap-8">
                                <span className="text-xs sm:text-sm tracking-widest uppercase text-black/70">{item.year}</span>
                                <span className="text-xs sm:text-sm tracking-widest uppercase">{item.title}</span>
                                <span className="text-xs sm:text-sm tracking-widest uppercase">{item.event}</span>
                            </div>
                        ))}
                    </>
                )}
            </Section>
        </div>
    )
}

export default function About({ setIsMenuOpen, navigate }) {
    const [tab, setTab] = useState('about')
    const [openSections, setOpenSections] = useState({
        skillsets: true,
        tools: false,
        experience: true,
        achievements: false,
    })
    const tabRefs = useRef({})

    const selectTab = (id, focus = false) => {
        if (id !== tab) playFolderSound()
        setTab(id)
        if (focus) tabRefs.current[id]?.focus()
    }

    const onTabKeyDown = (event, index) => {
        const last = TABS.length - 1
        let next = null
        if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
        else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        selectTab(TABS[next].id, true)
    }

    const toggle = (id) => {
        playFolderSound()
        setOpenSections((current) => ({ ...current, [id]: !current[id] }))
    }

    return (
        <main className="bg-white min-h-screen text-black flex flex-col overflow-x-hidden">
            <style>{`
                .about-body {
                    font-size: clamp(1rem, 0.9rem + 0.6vw, 1.375rem);
                    line-height: 1.6;
                }

                .about-content {
                    padding-left: clamp(1.25rem, 3vw, 3rem);
                    padding-right: clamp(1.25rem, 3vw, 3rem);
                }

                /* A sheet of paper with two more sheets peeking out beneath it. */
                .paper {
                    position: relative;
                    isolation: isolate;
                    animation: paperIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                /* The sheet on top. The two sheets beneath it are the pseudo-elements. */
                .paper-front {
                    background: #fbfaf5;
                    border: 1px solid rgba(0, 0, 0, 0.14);
                    box-shadow: 0 22px 40px -24px rgba(0, 0, 0, 0.45);
                }

                .paper::before,
                .paper::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    border: 1px solid rgba(0, 0, 0, 0.12);
                    pointer-events: none;
                }

                .paper::before {
                    background: #efede4;
                    transform: translate(10px, 9px) rotate(0.7deg);
                }

                .paper::after {
                    background: #e4e1d6;
                    transform: translate(-8px, 15px) rotate(-0.9deg);
                }

                @keyframes paperIn {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* The portrait is taped to the page. */
                .about-photo {
                    position: relative;
                    transform: rotate(-1.2deg);
                }

                .about-photo::before {
                    content: '';
                    position: absolute;
                    top: -0.85rem;
                    left: 50%;
                    z-index: 1;
                    width: 6rem;
                    height: 1.7rem;
                    background: rgba(255, 234, 0, 0.85);
                    transform: translateX(-50%) rotate(2deg);
                }

                @media (max-width: 639px) {
                    .paper::before { transform: translate(6px, 7px) rotate(0.5deg); }
                    .paper::after { transform: translate(-5px, 11px) rotate(-0.6deg); }
                }
            `}</style>

            <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />

            <header className="px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-6 sm:pb-8">
                <h1 className="about-title font-title leading-none">
                    <span>About</span> <span>me</span>
                </h1>
            </header>

            <div className="px-5 sm:px-8 md:px-12">
                <div role="tablist" aria-label="About sections" className="flex flex-wrap gap-x-2 gap-y-2 border-b-2 border-dotted border-black/40 pb-4">
                    {TABS.map(({ id, label }, index) => {
                        const selected = tab === id
                        return (
                            <button
                                key={id}
                                ref={(el) => { tabRefs.current[id] = el }}
                                type="button"
                                role="tab"
                                id={`about-tab-${id}`}
                                aria-selected={selected}
                                aria-controls={`about-panel-${id}`}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => selectTab(id)}
                                onKeyDown={(event) => onTabKeyDown(event, index)}
                                className={`min-h-11 cursor-pointer border border-black px-4 text-xs uppercase tracking-widest transition-colors duration-300 sm:px-6 sm:text-sm ${
                                    selected ? 'bg-[#ffff00] text-black' : 'bg-transparent text-black/70 hover:bg-black hover:text-white'
                                }`}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="px-6 pt-10 pb-24 sm:px-10 md:px-14">
                {TABS.map(({ id }) => (
                    <div
                        key={id}
                        role="tabpanel"
                        id={`about-panel-${id}`}
                        aria-labelledby={`about-tab-${id}`}
                        hidden={tab !== id}
                    >
                        {tab === id && (
                            <div className="paper mx-auto max-w-6xl">
                                <div className="paper-front about-content py-8 sm:py-12">
                                    {id === 'about' && <AboutPanel navigate={navigate} />}
                                    {id === 'details' && <DetailsPanel openSections={openSections} toggle={toggle} />}
                                    {id === 'experiences' && <ExperiencesPanel openSections={openSections} toggle={toggle} />}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <nav aria-label="Portfolio sections" className="mx-auto mt-16 max-w-6xl">
                    <p className="border-b-2 border-dotted border-black/40 pb-3 text-xs uppercase tracking-widest text-black/70">See the work</p>
                    {workLinks.map((label, i) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => navigate('projects')}
                            className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 border-b-2 border-dotted border-black/40 py-4 text-left transition-colors hover:bg-black/5"
                        >
                            <span className="flex items-baseline gap-5 font-title text-2xl sm:text-4xl">
                                <span>{`0${i + 1}`}</span>
                                <span className="uppercase transition-transform duration-500 group-hover:translate-x-2">{label}</span>
                            </span>
                            <span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>
                    ))}
                </nav>
            </div>
        </main>
    )
}
