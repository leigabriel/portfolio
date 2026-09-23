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
            { label: 'Node.js', icon: 'https://svgl.app/library/nodejs.svg' },
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

export default function About({ setIsMenuOpen, navigate }) {
    const [activeTab, setActiveTab] = useState(null)

    const experiences = [
        {
            company: 'FREELANCE',
            location: 'ORIENTAL MINDORO, PH',
            position: 'POSTER DESIGN FOR FRIENDS & CLIENTS',
        },
    ]

                    const skills = [
                        { label: 'UI/UX DESIGN' },
                        { label: 'GRAPHIC DESIGN' },
                        { label: 'WEB DEVELOPMENT' },
                    ]

                    const achievements = []

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
                .about-title {
                    font-size: clamp(2.75rem, 8vw, 8rem);
                    letter-spacing: -0.035em;
                }

                .about-section-title {
                    font-size: clamp(1.6rem, 5.5vw, 3rem);
                    line-height: 0.95;
                }

                .folder-title {
                    max-width: min(540px, calc(100% - 5rem));
                    padding-right: 1rem;
                    white-space: nowrap;
                }

                .about-body {
                    font-size: clamp(1rem, 5.2vw, 2.5rem);
                    line-height: 1.2;
                }

                .about-contact-label {
                    font-size: clamp(1.5rem, 3vw, 3rem);
                    line-height: 1;
                }

                .about-content {
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
            `}</style>

            <div className="fixed top-0 left-0 z-50 w-full p-4 sm:p-6 md:p-10 pointer-events-none">
                <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />
            </div>

            <header className="px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-10 sm:pb-12">
                <h1 className="about-title font-title leading-none">
                    About Me
                </h1>
            </header>

            <div className="w-full text-black mt-auto flex flex-col pt-6 sm:pt-12">

                <div className={`folder-tab bg-[#b3b3b3] w-full relative z-10 ${activeTab === 0 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => handleTabClick(0)} className="w-full group h-18 md:h-20 flex flex-col justify-end text-left cursor-pointer">
                        <div className="pb-3 md:pb-4">
                            <div className="folder-title about-section-title font-title pl-5 sm:pl-8 md:pl-12 transition-all duration-500 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3">
                                Experiences
                            </div>
                        </div>
                        <div className="dotted-line transition-all duration-500 opacity-60 group-hover:opacity-100"></div>
                    </button>

                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 0 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="about-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                                <div className="hidden md:grid grid-cols-3 gap-8 pb-4 border-b-2 border-dotted border-black/40 text-xs tracking-widest uppercase">
                                    <span>Location</span>
                                    <span>Company</span>
                                    <span>Position</span>
                                </div>

                                {experiences.map((exp, i) => (
                                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 py-6 border-b-2 border-dotted border-black/40 hover:bg-black/5 transition-colors">
                                        <span className="text-xs sm:text-sm tracking-widest uppercase text-black/70">{exp.location}</span>
                                        <span className="text-xs sm:text-sm tracking-widest uppercase">{exp.company}</span>
                                        <span className="text-xs sm:text-sm tracking-widest uppercase">{exp.position}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-18 md:h-20"></div>
                </div>

                <div className={`folder-tab bg-[#ffff00] w-full relative z-20 -mt-18 md:-mt-20 ${activeTab === 1 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => handleTabClick(1)} className="w-full group h-18 md:h-20 flex flex-col justify-end text-left cursor-pointer">
                        <div className="pb-3 md:pb-4">
                            <div className="folder-title about-section-title font-title pl-5 sm:pl-8 md:pl-12 transition-all duration-500 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3">
                                Skillsets
                            </div>
                        </div>
                        <div className="dotted-line transition-all duration-500 opacity-60 group-hover:opacity-100"></div>
                    </button>

                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 1 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="about-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                                {skills.map((s, i) => (
                                    <div key={i} className="flex gap-6 py-4 border-b-2 border-dotted border-black/40 hover:bg-black/5">
                                        <span className="font-title text-2xl sm:text-4xl">{`0${i + 1}`}</span>
                                        <span className="font-title text-2xl sm:text-4xl capitalize">{s.label.toUpperCase()}</span>
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
                                                    <div key={item.label} className="group flex min-h-14 items-center gap-4 border-b border-dotted border-black/30 py-3 text-[10px] uppercase tracking-widest transition-colors last:border-b-0 hover:bg-black/5 sm:text-xs">
                                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center p-2 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                                                            <img src={item.icon} alt="" className="h-full w-full object-contain" loading="lazy" />
                                                        </span>
                                                        {item.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-18 md:h-20"></div>
                </div>

                <div className={`folder-tab bg-[#f5f5f5] w-full relative z-30 -mt-18 md:-mt-20 ${activeTab === 2 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => handleTabClick(2)} className="w-full group h-18 md:h-20 flex flex-col justify-end text-left cursor-pointer">
                        <div className="pb-3 md:pb-4">
                            <div className="folder-title about-section-title font-title pl-5 sm:pl-8 md:pl-12 transition-all duration-500 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3">
                                Profile
                            </div>
                        </div>
                        <div className="dotted-line transition-all duration-500 opacity-60 group-hover:opacity-100"></div>
                    </button>

                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 2 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="about-content pt-8 sm:pt-10 pb-8 sm:pb-10">

                                <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">

                                    <div className="w-full">
                                        <div className="w-full aspect-square overflow-hidden">
                                            <img
                                                src="/images/me.jpg"
                                                alt="Profile"
                                                className="w-full h-full object-cover grayscale"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between">
                                        <div className="flex flex-col">
                                            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 py-3 hover:bg-black/5" style={{ borderBottom: '1px dotted #212631' }}>
                                                <span className="font-title text-lg sm:text-xl uppercase tracking-widest">name</span>
                                                <span className="text-sm sm:text-base tracking-widest uppercase">Lei Gabriel Malibiran</span>
                                            </div>
                                            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 py-3 hover:bg-black/5" style={{ borderBottom: '1px dotted #212631' }}>
                                                <span className="font-title text-lg sm:text-xl uppercase tracking-widest">location</span>
                                                <span className="text-sm sm:text-base tracking-widest uppercase">Oriental Mindoro, PH</span>
                                            </div>
                                            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 py-3 hover:bg-black/5" style={{ borderBottom: '1px dotted #212631' }}>
                                                <span className="font-title text-lg sm:text-xl uppercase tracking-widest">role</span>
                                                <span className="text-sm sm:text-base tracking-widest uppercase">Web Developer &amp; Graphic Designer</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <p className="about-body text-black/80">
                                                I’m passionate about creating digital experiences that are simple, clear, and easy to use. I enjoy working on designs that not only look good but also make sense to the people who use them. <br /><br />

                                                My background in graphic design and web design has helped me develop an eye for visual details while also understanding how design works in a functional environment. I like turning ideas into clean and practical interfaces, whether I’m working on a website, application, or other digital project.<br /><br />

                                                I’m always interested in learning new tools and improving the way I approach design and development. For me, good work comes from paying attention to the small details, understanding the purpose behind a project, and creating something that feels both useful and well put together.

                                            </p>
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 py-3 hover:bg-black/5" style={{ borderBottom: '1px dotted #212631' }}>
                                                <span className="font-title text-lg sm:text-xl uppercase tracking-widest">email</span>
                                                <a href="mailto:malibiranleigabriel@gmail.com" className="text-sm tracking-widest lowercase break-all hover:opacity-60 text-right">
                                                    malibiranleigabriel@gmail.com
                                                </a>
                                            </div>
                                            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 py-3 hover:bg-black/5" style={{ borderBottom: '1px dotted #212631' }}>
                                                <span className="font-title text-lg sm:text-xl uppercase tracking-widest">instagram</span>
                                                <a href="https://instagram.com/leimxnsquare" target="_blank" rel="noreferrer" className="text-sm tracking-widest lowercase hover:opacity-60 text-right">
                                                    @leimxnsquare
                                                </a>
                                            </div>
                                            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 py-3 hover:bg-black/5" style={{ borderBottom: '1px dotted #212631' }}>
                                                <span className="font-title text-lg sm:text-xl uppercase tracking-widest">github</span>
                                                <a href="https://github.com/leigabriel" target="_blank" rel="noreferrer" className="text-sm tracking-widest lowercase hover:opacity-60 text-right">
                                                    github.com/leigabriel
                                                </a>
                                            </div>
                                            <div onClick={() => navigate('projects')} className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 py-3 hover:bg-black/5 cursor-pointer" style={{ borderBottom: '1px dotted #212631' }}>
                                                <span className="font-title text-lg sm:text-xl uppercase tracking-widest">portfolio</span>
                                                <span className="text-sm tracking-widest uppercase text-right">view works</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="h-18 md:h-20"></div>
                </div>

                <div className={`folder-tab bg-[#a39f9f] w-full relative z-40 -mt-18 md:-mt-20 ${activeTab === 3 ? 'drop-shadow-2xl' : ''}`}>
                    <button onClick={() => handleTabClick(3)} className="w-full group h-18 md:h-20 flex flex-col justify-end text-left cursor-pointer">
                        <div className="pb-3 md:pb-4">
                            <div className="folder-title about-section-title font-title pl-5 sm:pl-8 md:pl-12 transition-all duration-500 opacity-70 group-hover:opacity-100 md:group-hover:translate-x-3">
                                Achievements
                            </div>
                        </div>
                        <div className="dotted-line transition-all duration-500 opacity-60 group-hover:opacity-100"></div>
                    </button>

                    <div className="grid transition-all duration-500" style={{ gridTemplateRows: activeTab === 3 ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="about-content pt-6 sm:pt-8 pb-8 sm:pb-10">
                                {achievements.length === 0 ? (
                                    <div className="flex flex-col items-start gap-3 py-10 border-b-2 border-dotted border-black/40">
                                        <span className="font-title text-5xl text-black/20">—</span>
                                        <p className="text-xs tracking-widest uppercase text-black/40">Coming soon</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="hidden md:grid grid-cols-3 gap-8 pb-4 border-b-2 border-dotted border-black/40 text-xs tracking-widest uppercase">
                                            <span>Year</span>
                                            <span>Achievement</span>
                                            <span>Event</span>
                                        </div>

                                        {achievements.map((item, i) => (
                                            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 py-6 border-b-2 border-dotted border-black/40 hover:bg-black/5 transition-colors">
                                                <span className="text-xs sm:text-sm tracking-widest uppercase text-black/70">{item.year}</span>
                                                <span className="text-xs sm:text-sm tracking-widest uppercase">{item.title}</span>
                                                <span className="text-xs sm:text-sm tracking-widest uppercase">{item.event}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-18 md:h-20"></div>
                </div>

            </div>
        </main>
    )
}