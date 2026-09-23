import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
const menuSound = new Audio('/sounds/folder_sfx.mp3')

function playMenuSound(type) {
    menuSound.pause()
    menuSound.currentTime = 0
    menuSound.volume = 0.7
    menuSound.playbackRate = type === 'open' ? 1.15 : 0.8
    menuSound.play().catch(() => {
    })
}

function PreviewLink({ label, image, onClick }) {
    const [hovered, setHovered] = useState(false)
    const [pointer, setPointer] = useState({ x: 0, y: 0 })

    const movePreview = (event) => {
        setPointer({ x: event.clientX, y: event.clientY })
    }

    const preview = hovered && createPortal(
        <img
            src={image}
            alt=""
            aria-hidden="true"
            style={{
                position: 'fixed',
                left: pointer.x,
                top: Math.min(Math.max(pointer.y, 170), window.innerHeight - 170),
                width: 'clamp(8rem, 18vw, 15rem)',
                height: 'clamp(10rem, 23vw, 19rem)',
                objectFit: 'cover',
                transform: pointer.x > window.innerWidth - 280
                    ? 'translate(calc(-100% - 20px), -50%) rotate(-2deg)'
                    : 'translate(20px, -50%) rotate(2deg)',
                boxShadow: '0 14px 35px rgba(0,0,0,0.22)',
                zIndex: 80,
                pointerEvents: 'none',
            }}
        />,
        document.body,
    )

    return (
        <>
            <button
                onClick={() => {
                    setHovered(false)
                    onClick()
                }}
                onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') {
                        setHovered(true)
                        movePreview(event)
                    }
                }}
                onPointerMove={movePreview}
                onPointerLeave={() => setHovered(false)}
                className="w-full text-left group cursor-pointer"
                style={{ background: 'none', border: 'none', padding: 0 }}
            >
                <span
                    className="menu-link-label cursor-pointer font-title"
                    style={{
                        display: 'block',
                        lineHeight: 1,
                        letterSpacing: hovered ? '0.02em' : '-0.03em',
                        fontWeight: 400,
                        color: '#000',
                        borderBottom: '1.5px dotted rgba(0,0,0,0.25)',
                        position: 'relative',
                        transition: 'letter-spacing 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                        userSelect: 'none',
                    }}
                >
                    <span
                        style={{
                            display: 'inline-block',
                            transform: hovered ? 'translateX(8px)' : 'translateX(0)',
                            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    >
                        {label}
                    </span>

                <span style={{
                    position: 'absolute',
                    left: 0,
                    bottom: -1,
                    height: 0,
                    borderBottom: '2px dotted rgba(0,0,0,0.6)',
                    width: hovered ? '100%' : '0%',
                    transition: hovered
                        ? 'width 0.45s cubic-bezier(0.34,1.56,0.64,1)'
                        : 'width 0.25s ease',
                    display: 'block',
                }} />

                <span style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: hovered
                        ? 'translateY(-50%) scale(1) rotate(20deg)'
                        : 'translateY(-50%) scale(0) rotate(-20deg)',
                    transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                    fontSize: 'clamp(0.8rem, 2vw, 1.4rem)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                }}>
                    ✦
                </span>
                </span>
            </button>
            {preview}
        </>
    )
}

export function MenuButton({ setIsMenuOpen, className = '', style = {} }) {
    const handleOpen = useCallback(() => {
        playMenuSound('open')
        setIsMenuOpen(true)
    }, [setIsMenuOpen])

    return (
        <button
            onClick={handleOpen}
            className={`text-xs sm:text-sm tracking-widest uppercase cursor-pointer transition-all duration-300 ease-out hover:bg-white hover:text-black hover:-translate-y-1 ${className}`}
            style={style}
        >
            MENU
        </button>
    )
}

export default function Menu({ setIsMenuOpen, navigate }) {
    const [closing, setClosing] = useState(false)

    const close = useCallback(() => {
        playMenuSound('close')
        setClosing(true)
        setTimeout(() => setIsMenuOpen(false), 400)
    }, [setIsMenuOpen])

    const handleNav = useCallback((dest) => {
        playMenuSound('close')
        setClosing(true)
        setTimeout(() => navigate(dest), 400)
    }, [navigate])

    const links = [
        { label: 'Home', dest: 'home', image: '/images/poster_designs/queen_yunjin.png' },
        { label: 'About', dest: 'about', image: '/images/poster_designs/giselle.jpg' },
        { label: 'Projects', dest: 'projects', image: '/images/poster_designs/call_me.png' },
        { label: 'Contact', dest: 'contact', image: '/images/poster_designs/ningning.png' },
    ]

    return (
        <>
            <style>{`
                .menu-link-label {
                    font-size: clamp(5rem, 5dvh, 3.5rem);
                    padding-block: 0.18em;
                }

                @keyframes menuOverlayIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes menuOverlayOut { from { opacity: 1; } to { opacity: 0; } }
                @keyframes menuPanelIn    { from { transform: translateY(-100%); } to { transform: translateY(0); } }
                @keyframes menuPanelOut   { from { transform: translateY(0); } to { transform: translateY(-100%); } }
                @keyframes menuItemIn     { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

                .menu-overlay {
                    animation: menuOverlayIn 0.35s ease forwards;
                }
                .menu-overlay.out {
                    animation: menuOverlayOut 0.35s ease forwards;
                }
                .menu-panel {
                    animation: menuPanelIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .menu-panel.out {
                    animation: menuPanelOut 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards;
                }
                .menu-item {
                    opacity: 0;
                    animation: menuItemIn 0.5s ease forwards;
                }
                .menu-item:nth-child(1) { animation-delay: 0.15s; }
                .menu-item:nth-child(2) { animation-delay: 0.22s; }
                .menu-item:nth-child(3) { animation-delay: 0.29s; }
                .menu-item:nth-child(4) { animation-delay: 0.36s; }

                @media (max-height: 600px) {
                    .menu-link-label {
                        font-size: 1.75rem;
                        padding-block: 0.1em;
                    }

                    .menu-panel-footer {
                        display: none;
                    }
                }

                @media (max-width: 768px) {
                    .menu-panel {
                        width: 100% !important;
                    }
                }
            `}</style>

            <div
                className={`menu-overlay fixed inset-0 z-60 bg-black/20 cursor-pointer${closing ? ' out' : ''}`}
                onClick={close}
            />

            <div className={`menu-panel fixed top-0 right-0 bottom-0 w-1/2 z-70 bg-[#FFEA00] flex flex-col justify-between overflow-y-auto p-5 sm:p-8 md:p-10${closing ? ' out' : ''}`}>

                <div className="menu-item flex justify-between items-center w-full border-b border-black/10 pb-4">
                    <span className="text-black text-xs tracking-widest uppercase"></span>
                    <button
                        onClick={close}
                        className="text-black text-xs tracking-widest uppercase cursor-pointer transition-all duration-300 ease-out hover:bg-white hover:text-black hover:-translate-y-1"
                    >
                        CLOSE
                    </button>
                </div>

                <nav className="flex flex-col flex-1 shrink-0 justify-center gap-0 py-4 sm:py-5">
                    {links.map(({ label, dest, image }) => (
                        <div key={label} className="menu-item">
                            <PreviewLink label={label} image={image} onClick={() => handleNav(dest)} />
                        </div>
                    ))}
                </nav>

                <div className="menu-panel-footer menu-item flex justify-between items-end w-full border-t border-black/10 pt-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-black/40 text-[9px] tracking-widest uppercase">MENU</span>
                    </div>
                    {/* <span className="text-black/40 text-[9px] tracking-widest uppercase">©2026</span> */}
                </div>

            </div>
        </>
    )
}
