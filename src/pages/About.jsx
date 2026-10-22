import { useState } from 'react'
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

// One folder tab. Closed content is `inert`, so its links cannot be focused
// while it is visually collapsed.
function Folder({ id, title, background, layer, first = false, dark = false, open, onToggle, children }) {
    return (
        <div className={`folder-tab ${background} ${dark ? 'text-white' : ''} w-full relative ${layer} ${first ? '' : '-mt-18 md:-mt-20'}`}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={`folder-${id}`}
                className="w-full group h-18 md:h-20 flex flex-col justify-end text-left cursor-pointer"
            >
                <div className="pb-3 md:pb-4">
                    <div className="folder-title about-section-title font-title pl-5 sm:pl-8 md:pl-12 transition-all duration-500 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3">
                        {title}
                    </div>
                </div>
                <div className={`${dark ? 'dotted-line-white' : 'dotted-line'} transition-all duration-500 opacity-60 group-hover:opacity-100`}></div>
            </button>

            <div id={`folder-${id}`} className="grid transition-all duration-500" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                <div className="overflow-hidden" inert={!open}>
                    {children}
                </div>
            </div>

            <div className="h-18 md:h-20"></div>
        </div>
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

export default function About({ setIsMenuOpen, navigate }) {
    const [activeTab, setActiveTab] = useState(null)

    const handleTabClick = (index) => {
        if (activeTab !== index) playFolderSound()
        setActiveTab(activeTab === index ? null : index)
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
            `}</style>

            <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />

            <header className="px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-10 sm:pb-12">
                <h1 className="about-title font-title leading-none">
                    About me
                </h1>
            </header>

            <div className="w-full text-black mt-auto flex flex-col pt-6 sm:pt-12">

                <Folder id="experiences" title="Experiences" background="bg-[#b3b3b3]" layer="z-10" first open={activeTab === 0} onToggle={() => handleTabClick(0)}>
                    <div className="about-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                        <div className="hidden md:grid grid-cols-3 gap-8 pb-4 border-b-2 border-dotted border-black/40 text-xs tracking-widest uppercase">
                            <span>Location</span>
                            <span>Company</span>
                            <span>Position</span>
                        </div>

                        {experiences.map((exp) => (
                            <div key={exp.position} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 py-6 border-b-2 border-dotted border-black/40 hover:bg-black/5 transition-colors">
                                <span className="text-xs sm:text-sm tracking-widest uppercase text-black/70">{exp.location}</span>
                                <span className="text-xs sm:text-sm tracking-widest uppercase">{exp.company}</span>
                                <span className="text-xs sm:text-sm tracking-widest uppercase">{exp.position}</span>
                            </div>
                        ))}
                    </div>
                </Folder>

                <Folder id="skillsets" title="Skillsets" background="bg-[#ffff00]" layer="z-20" open={activeTab === 1} onToggle={() => handleTabClick(1)}>
                    <div className="about-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                        {skills.map((label, i) => (
                            <div key={label} className="flex gap-6 py-4 border-b-2 border-dotted border-black/40 hover:bg-black/5">
                                <span className="font-title text-2xl sm:text-4xl">{`0${i + 1}`}</span>
                                <span className="font-title text-2xl sm:text-4xl uppercase">{label}</span>
                            </div>
                        ))}

                        <div className="text-left text-xs tracking-[0.2em] uppercase py-4 border-b-2 border-dotted border-black/40 mt-10">
                            Tools, Technologies & AI
                        </div>

                        <div className="flex flex-col mt-4">
                            {skillGroups.map((group) => (
                                <div key={group.title} className="grid border-b-2 border-dotted border-black/40 py-5 md:grid-cols-[minmax(12rem,0.35fr)_1fr] md:gap-8">
                                    <span className="font-title text-2xl uppercase tracking-widest mb-3 md:mb-0">{group.title}</span>
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
                    </div>
                </Folder>

                <Folder id="profile" title="Profile" background="bg-[#f5f5f5]" layer="z-30" open={activeTab === 2} onToggle={() => handleTabClick(2)}>
                    <div className="about-content pt-8 sm:pt-10 pb-8 sm:pb-10">
                        <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">

                            <div className="w-full max-w-xs sm:max-w-sm lg:max-w-none">
                                <div className="w-full aspect-square overflow-hidden">
                                    <img
                                        src="/images/me.jpg"
                                        alt="Portrait of Lei Gabriel"
                                        width="1000"
                                        height="1000"
                                        decoding="async"
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                            </div>

                            <div className="flex min-w-0 flex-col justify-between">
                                <div className="flex flex-col">
                                    <ProfileRow label="name">Lei Gabriel Malibiran</ProfileRow>
                                    <ProfileRow label="location">Oriental Mindoro, PH</ProfileRow>
                                    <ProfileRow label="role">Web Developer &amp; Graphic Designer</ProfileRow>
                                </div>

                                <div className="about-body mt-6 flex max-w-prose flex-col gap-[1.2em] text-black/80">
                                    {bio.map((paragraph) => (
                                        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                                    ))}
                                </div>

                                <div className="flex flex-col mt-6">
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
                                    <ProfileRow label="portfolio" as="button" type="button" onClick={() => navigate('projects')}>
                                        view works
                                    </ProfileRow>
                                </div>
                            </div>

                        </div>
                    </div>
                </Folder>

                <Folder id="achievements" title="Achievements" background="bg-[#212121]" layer="z-40" dark open={activeTab === 3} onToggle={() => handleTabClick(3)}>
                    <div className="about-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                        {achievements.length === 0 ? (
                            <div className="flex flex-col items-start gap-3 py-10 border-b-2 border-dotted border-white/40">
                                <span className="font-title text-5xl text-white/20" aria-hidden="true">—</span>
                                <p className="text-xs tracking-widest uppercase text-white/65">Nothing to see here for now</p>
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:grid grid-cols-3 gap-8 pb-4 border-b-2 border-dotted border-white/40 text-xs tracking-widest uppercase text-white/70">
                                    <span>Year</span>
                                    <span>Achievement</span>
                                    <span>Event</span>
                                </div>

                                {achievements.map((item) => (
                                    <div key={`${item.year}-${item.title}`} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 py-6 border-b-2 border-dotted border-white/40 hover:bg-white/5 transition-colors">
                                        <span className="text-xs sm:text-sm tracking-widest uppercase text-white/70">{item.year}</span>
                                        <span className="text-xs sm:text-sm tracking-widest uppercase text-white">{item.title}</span>
                                        <span className="text-xs sm:text-sm tracking-widest uppercase text-white">{item.event}</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </Folder>

            </div>
        </main>
    )
}
