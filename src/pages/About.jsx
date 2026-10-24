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

const contactRows = [
    { label: 'email', text: 'malibiranleigabriel@gmail.com', href: 'mailto:malibiranleigabriel@gmail.com' },
    { label: 'instagram', text: '@leimxnsquare', href: 'https://instagram.com/leimxnsquare', external: true },
    { label: 'github', text: 'github.com/leigabriel', href: 'https://github.com/leigabriel', external: true },
]

// The label strip that sits at the top (and bottom) of every sheet.
function SheetBar({ label, front, onFront, children, hidden = false }) {
    return (
        <div className="sheet-bar" aria-hidden={hidden || undefined}>
            {children}
            <button
                type="button"
                className="bar-label"
                aria-pressed={front}
                tabIndex={hidden ? -1 : undefined}
                onClick={onFront}
            >
                {label}
            </button>
        </div>
    )
}

// One sheet of paper. On wide screens the three sheets overlap, each a column
// wider than the last, and the chosen one is brought to the front. On narrow
// screens they stack and only the chosen sheet is open.
function Sheet({ id, label, className, front, rank, onFront, tabs, title, children }) {
    return (
        <article
            className={`sheet ${className}${front ? ' is-front' : ''}`}
            style={{ zIndex: front ? 10 : rank }}
            aria-labelledby={`sheet-${id}-label`}
        >
            <div className="sheet-inner">
                <SheetBar label={label} front={front} onFront={onFront}>
                    {tabs}
                </SheetBar>
                {title}
                <div className="sheet-body" inert={!front && id === 'profile' ? true : undefined}>
                    {children}
                </div>
                <SheetBar label={label} front={front} onFront={onFront} hidden>
                    {tabs && <span className="bar-tabs" />}
                </SheetBar>
            </div>
            <span id={`sheet-${id}-label`} className="sr-only">{label}</span>
        </article>
    )
}

function ExperienceTable({ columns, rows, emptyText }) {
    return (
        <>
            <div className="xrow xhead">
                <span className="xgutter" />
                <div className="xcell">
                    <div className="xcols">
                        {columns.map((column) => <span key={column}>{column}</span>)}
                    </div>
                </div>
            </div>
            {rows.length === 0 ? (
                <div className="xrow">
                    <span className="xgutter" />
                    <div className="xcell xempty">{emptyText}</div>
                </div>
            ) : rows.map((row) => (
                <div className="xrow xdata" key={row.key}>
                    <span className="xgutter" />
                    <div className="xcell">
                        <div className="xcols">
                            {row.cells.map((cell, i) => (
                                <span key={i} className="xtext">
                                    {cell.map((line) => <span key={line} className="block">{line}</span>)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default function About({ setIsMenuOpen, navigate }) {
    const [front, setFront] = useState('profile')

    const bringToFront = (id) => {
        if (id !== front) playFolderSound()
        setFront(id)
    }

    return (
        <main className="bg-white min-h-screen text-[#212121] flex flex-col overflow-x-hidden">
            <style>{`
                .sr-only {
                    position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
                    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
                }

                .about-head {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    padding: clamp(6rem, 9vw, 8rem) 32px 0;
                }
                .about-head h1 { grid-column: 1 / -1; display: grid; grid-template-columns: subgrid; }
                .about-head .about-title { display: inline-block; line-height: 1; padding-bottom: 2.5rem; font-weight: 400; }

                /* Four equal columns with a 32px margin, like the page grid. */
                .about-stack {
                    --col: calc((100cqw - 64px) / 4);
                    container-type: inline-size;
                    display: grid;
                    padding-bottom: 8rem;
                }

                .sheet {
                    grid-area: 1 / 1;
                    align-self: start;
                    position: relative;
                    padding: 0 32px;
                    border-radius: 12px 12px 0 0;
                    box-shadow: 0 0 22px rgba(0, 0, 0, 0.14);
                    animation: sheetIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .sheet--experiences { width: calc(100cqw - 32px); background: #f5f5f5; }
                .sheet--skillsets  { width: calc(32px + 2 * var(--col)); margin-top: 112px; background: #ffe430; animation-delay: 0.08s; }
                .sheet--profile    { width: calc(32px + 3 * var(--col)); margin-top: 224px; background: #fff; animation-delay: 0.16s; }

                @keyframes sheetIn {
                    from { opacity: 0; transform: translateX(-24px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                /* Binder holes down the left margin. */
                .sheet::before {
                    content: '';
                    position: absolute;
                    top: 0; bottom: 0; left: 0;
                    width: 32px;
                    background: radial-gradient(circle at 16px 16px, #fff 4.5px, rgba(0, 0, 0, 0.22) 5px, rgba(0, 0, 0, 0.22) 5.5px, transparent 6px) 0 0 / 32px 204px repeat-y;
                    pointer-events: none;
                }

                .sheet-inner {
                    border-left: 1px dotted #212121;
                    border-right: 1px dotted #212121;
                }

                .sheet-bar {
                    position: relative;
                    display: grid;
                    height: 32px;
                    grid-template-columns: 1fr;
                    align-items: center;
                    border-bottom: 1px dotted #212121;
                    font-size: 12px;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }
                .sheet-body + .sheet-bar { border-top: 1px dotted #212121; border-bottom: 0; }
                .sheet--experiences .sheet-bar { grid-template-columns: calc(var(--col) - 11px) 1fr; }
                .sheet--experiences .sheet-bar > .bar-label { border-left: 1px dotted #212121; }
                .sheet--experiences .sheet-bar > .bar-tabs { border: 0; }

                .bar-tabs {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 12px;
                    height: 100%;
                }
                .bar-tabs button, .bar-label {
                    font: inherit;
                    letter-spacing: inherit;
                    text-transform: inherit;
                    color: #212121;
                    background: none;
                    border: 0;
                    cursor: pointer;
                }
                .bar-tabs button { min-height: 32px; padding: 0 2px; }
                .bar-tabs button:hover, .bar-label:hover { text-decoration: underline; text-underline-offset: 3px; }

                .bar-label {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }
                .bar-label[aria-pressed='true'] { font-weight: 500; }
                .bar-label::before, .bar-label::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 6px; height: 6px;
                    background: #212121;
                    transform: translateY(-50%);
                }
                .bar-label::before { left: 14px; }
                .bar-label::after { right: 14px; }

                .sheet-title {
                    font-family: var(--font-title);
                    font-size: clamp(2.5rem, 4.4vw, 4rem);
                    line-height: 1;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px dotted #212121;
                    padding-left: 12px;
                    white-space: nowrap;
                }

                /* ---- experiences table ---- */
                .xrow {
                    display: grid;
                    grid-template-columns: calc(var(--col) - 11px) 1fr;
                    border-bottom: 1px dotted #212121;
                    min-height: 48px;
                }
                .xrow > .xcell { border-left: 1px dotted #212121; padding-left: 11px; display: flex; align-items: center; }
                .xrow > .xcell > .xcols { width: 100%; }
                .xcols { display: grid; grid-template-columns: var(--col) var(--col) 1fr; }
                .xdata { min-height: 72px; }
                .xdata .xcell { align-items: flex-start; padding-top: 18px; padding-bottom: 18px; }
                .xhead { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
                .xtext { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.5; padding-right: 16px; }
                .xempty { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; min-height: 72px; color: rgba(33, 33, 33, 0.7); }
                .xsub { padding-left: 11px; }
                .xbar {
                    display: grid;
                    grid-template-columns: calc(var(--col) - 11px) 1fr;
                    border-bottom: 1px dotted #212121;
                    height: 32px;
                    font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
                }
                .xbar > span:last-child { display: flex; align-items: center; justify-content: center; border-left: 1px dotted #212121; }

                /* ---- skillsets ---- */
                .skill-row {
                    display: grid;
                    grid-template-columns: 109px 1fr;
                    align-items: center;
                    height: 80px;
                    padding-left: 12px;
                    border-bottom: 1px dotted #212121;
                    font-family: var(--font-title);
                    font-size: clamp(1.9rem, 3.4vw, 3rem);
                    line-height: 1;
                }
                .skill-label { grid-column: 1 / -1; text-align: center; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; height: 32px; display: flex; align-items: center; justify-content: center; border-bottom: 1px dotted #212121; }
                .skill-grid { display: grid; grid-template-columns: 1fr 1fr; }
                .skill-cell {
                    display: flex; align-items: center; gap: 10px;
                    min-height: 48px; padding: 0 12px;
                    font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
                    border-bottom: 1px dotted #212121;
                }
                .skill-cell:nth-child(odd) { border-right: 1px dotted #212121; }
                .skill-cell img { width: 20px; height: 20px; object-fit: contain; flex: none; }

                /* ---- profile ---- */
                .profile-top { display: grid; grid-template-columns: var(--col) 1fr; border-bottom: 1px dotted #212121; }
                .profile-left { padding: 18px 0 24px 12px; }
                .profile-name { font-family: var(--font-title); font-size: clamp(2.5rem, 4.4vw, 4rem); line-height: 1; }
                .profile-photo { width: calc(var(--col) - 44px); aspect-ratio: 1 / 1; margin-top: 24px; object-fit: cover; object-position: center; filter: grayscale(1); display: block; }
                .profile-bio {
                    padding: 18px 24px 24px 0;
                    font-family: var(--font-body);
                    font-size: clamp(0.95rem, 1.2vw, 1.15rem);
                    line-height: 1.7;
                }
                .profile-bio p + p { margin-top: 1.2em; }
                .profile-role { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 0.75rem; font-family: var(--font-body); }
                .prow {
                    display: grid;
                    grid-template-columns: var(--col) 1fr;
                    align-items: center;
                    min-height: 80px;
                    border-bottom: 1px dotted #212121;
                }
                .prow:last-child { border-bottom: 0; }
                .prow-label { padding-left: 12px; font-family: var(--font-body); font-size: clamp(1.1rem, 1.6vw, 1.5rem); line-height: 1; letter-spacing: 0.02em; }
                .prow-value { font-family: var(--font-body); font-size: clamp(0.9rem, 1.2vw, 1.1rem); overflow-wrap: anywhere; }
                .prow a:hover, button.prow:hover .prow-value { text-decoration: underline; text-underline-offset: 4px; }
                button.prow { width: 100%; background: none; border: 0; text-align: left; cursor: pointer; color: inherit; font: inherit; border-bottom: 0; }

                /* ---- narrow screens: a stack of sheets, one open at a time ---- */
                @media (max-width: 1023px) {
                    .about-head { padding: 6rem 16px 0; }
                    .about-head h1 { display: block; }
                    .about-stack { display: flex; flex-direction: column; gap: 12px; padding: 0 10px 5rem; --col: 100cqw; }
                    .sheet { width: auto !important; margin-top: 0 !important; align-self: stretch; animation-name: sheetInUp; padding: 0 10px 0 22px; }
                    .sheet::before {
                        width: 22px;
                        background: radial-gradient(circle at 11px 16px, #fff 4.5px, rgba(0, 0, 0, 0.22) 5px, rgba(0, 0, 0, 0.22) 5.5px, transparent 6px) 0 0 / 22px 204px repeat-y;
                    }
                    .sheet--profile { order: 1; }
                    .sheet--skillsets { order: 2; }
                    .sheet--experiences { order: 3; }
                    .sheet:not(.is-front) .sheet-body,
                    .sheet:not(.is-front) .sheet-body + .sheet-bar { display: none; }
                    .sheet:not(.is-front) .sheet-title { border-bottom: 0; }
                    .sheet-bar, .sheet--experiences .sheet-bar { grid-template-columns: 1fr; }
                    .bar-tabs { display: none; }
                    .sheet--experiences .sheet-bar > .bar-label { border-left: 0; }
                    .sheet-title { height: 56px; font-size: 2rem; }
                    .xhead { display: none; }
                    .xrow { grid-template-columns: 1fr; }
                    .xgutter { display: none; }
                    .xrow > .xcell { border-left: 0; padding-left: 12px; }
                    .xcols { grid-template-columns: 1fr; gap: 4px; }
                    .xdata .xcell { padding: 14px 12px; }
                    .skill-row { grid-template-columns: 56px 1fr; font-size: 1.6rem; height: 60px; }
                    .skill-grid { grid-template-columns: 1fr; }
                    .skill-cell:nth-child(odd) { border-right: 0; }
                    .profile-top { grid-template-columns: 1fr; }
                    .profile-left { padding: 14px 12px 12px; }
                    .profile-photo { width: 100%; max-width: 20rem; margin-top: 16px; }
                    .profile-bio { padding: 4px 12px 18px; font-size: 0.9rem; line-height: 1.65; }
                    .profile-bio p + p { margin-top: 1em; }
                    .prow { grid-template-columns: 1fr; padding: 10px 0; min-height: 0; gap: 2px; }
                    .prow-label { font-size: 1.25rem; }
                    .prow-value { padding-left: 12px; }
                    .xbar { grid-template-columns: 1fr; }
                    .xbar > span:first-child { display: none; }
                    .xbar > span:last-child { border-left: 0; }
                }

                @keyframes sheetInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />

            <header className="about-head">
                <h1>
                    <span className="about-title font-title lg:col-start-1">About</span>{' '}
                    <span className="about-title font-title lg:col-start-2">me</span>
                </h1>
            </header>

            <div className="about-stack">
                <Sheet
                    id="experiences"
                    label="Experiences"
                    className="sheet--experiences"
                    front={front === 'experiences'}
                    rank={1}
                    onFront={() => bringToFront('experiences')}
                    tabs={
                        <span className="bar-tabs">
                            <button type="button" aria-pressed={front === 'profile'} onClick={() => bringToFront('profile')}>About</button>
                            <button type="button" aria-pressed={front === 'skillsets'} onClick={() => bringToFront('skillsets')}>Details</button>
                        </span>
                    }
                    title={
                        <div className="xrow" style={{ minHeight: 80 }}>
                            <span className="xgutter" />
                            <div className="xcell sheet-title" style={{ borderBottom: 0, paddingLeft: 11 }}>Experiences</div>
                        </div>
                    }
                >
                    <ExperienceTable
                        columns={['Location', 'Company', 'Position']}
                        rows={experiences.map((exp) => ({
                            key: exp.position,
                            cells: [[exp.location], [exp.company], [exp.position]],
                        }))}
                        emptyText="Nothing to see here for now"
                    />
                    <div className="xbar">
                        <span />
                        <span>Achievements</span>
                    </div>
                    <ExperienceTable
                        columns={['Year', 'Name', 'Organizer']}
                        rows={achievements.map((item) => ({
                            key: `${item.year}-${item.title}`,
                            cells: [[item.year], [item.title], [item.event]],
                        }))}
                        emptyText="Nothing to see here for now"
                    />
                </Sheet>

                <Sheet
                    id="skillsets"
                    label="Skillsets"
                    className="sheet--skillsets"
                    front={front === 'skillsets'}
                    rank={2}
                    onFront={() => bringToFront('skillsets')}
                    title={<div className="sheet-title">Skillsets</div>}
                >
                    {skills.map((label, i) => (
                        <div key={label} className="skill-row">
                            <span>{`0${i + 1}`}</span>
                            <span>{label.charAt(0) + label.slice(1).toLowerCase()}</span>
                        </div>
                    ))}
                    {skillGroups.map((group) => (
                        <div key={group.title}>
                            <div className="skill-label">{group.title}</div>
                            <div className="skill-grid">
                                {group.items.map((item) => (
                                    <div key={item.label} className="skill-cell">
                                        <img
                                            src={item.icon}
                                            alt=""
                                            width="20"
                                            height="20"
                                            loading="lazy"
                                            decoding="async"
                                            referrerPolicy="no-referrer"
                                            onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
                                        />
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Sheet>

                <Sheet
                    id="profile"
                    label="Profile"
                    className="sheet--profile"
                    front={front === 'profile'}
                    rank={3}
                    onFront={() => bringToFront('profile')}
                    title={<div className="sheet-title" style={{ borderBottom: 0, height: 0, padding: 0, overflow: 'hidden' }} aria-hidden="true" />}
                >
                    <div className="profile-top">
                        <div className="profile-left">
                            <h2 className="profile-name">Lei Gabriel Malibiran</h2>
                            <p className="profile-role">Web Developer &amp; Graphic Designer</p>
                            <img
                                src="/images/me.jpg"
                                alt="Portrait of Lei Gabriel"
                                width="1000"
                                height="1000"
                                decoding="async"
                                className="profile-photo"
                            />
                        </div>
                        <div className="profile-bio">
                            {bio.map((paragraph) => (
                                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                    {contactRows.map(({ label, text, href, external }) => (
                        <div key={label} className="prow">
                            <span className="prow-label">{label}</span>
                            <span className="prow-value">
                                <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{text}</a>
                            </span>
                        </div>
                    ))}
                    <button type="button" className="prow" onClick={() => navigate('projects')}>
                        <span className="prow-label">works</span>
                        <span className="prow-value">view portfolio →</span>
                    </button>
                </Sheet>
            </div>
        </main>
    )
}
