import { useState, useCallback } from 'react'
import useHoverHide from '../../hooks/useHoverHide'

const navLinks = [
    { label: 'Home', dest: 'home' },
    { label: 'About', dest: 'about' },
    { label: 'Works', dest: 'projects' },
    { label: 'Contact', dest: 'contact' },
]

export default function Header({ setIsMenuOpen, navigate, variant = 'light', className = '', style = {} }) {
    const [hovered, setHovered] = useState(null)
    const headerVisible = useHoverHide()

    const isLight = variant === 'light'
    const textColor = isLight ? '#fff' : '#000'
    const hoverBg = '#000'
    const hoverText = '#fff'

    const handleOpen = useCallback(() => {
        const menuSound = new Audio('/sounds/folder_sfx.mp3')
        menuSound.pause()
        menuSound.currentTime = 0
        menuSound.volume = 0.7
        menuSound.playbackRate = 1.15
        menuSound.play().catch(() => {})
        setIsMenuOpen(true)
    }, [setIsMenuOpen])

    return (
        <div
            style={{
                transform: headerVisible ? 'translateY(0)' : 'translateY(calc(-100% - 5rem))',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: headerVisible ? 'auto' : 'none',
                willChange: 'transform',
            }}
        >
            <nav
                className={`hidden md:flex items-center gap-6 lg:gap-70 pointer-events-auto ${className}`}
                style={{ color: textColor, ...style }}
            >
                {navLinks.map(({ label, dest }, idx) => (
                    <button
                        key={dest}
                        onClick={() => navigate(dest)}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                        className="nav-hover-btn text-xs sm:text-sm tracking-widest uppercase cursor-pointer border-none px-1 py-1 relative isolate"
                        style={{ color: hovered === idx ? hoverText : 'inherit', transition: 'color 0.3s ease' }}
                    >
                        <span
                            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out -z-10"
                            style={{
                                background: hoverBg,
                                transform: hovered === idx ? 'scaleY(1)' : 'scaleY(0)',
                                transformOrigin: 'bottom',
                            }}
                        />
                        {label}
                    </button>
                ))}
            </nav>

            <div className="md:hidden flex items-center justify-between w-full pointer-events-auto">
                <span className="text-xs sm:text-sm tracking-widest uppercase">
                    LEI GABRIEL
                </span>
                <button
                    onClick={handleOpen}
                    className="text-xs sm:text-sm tracking-widest uppercase cursor-pointer transition-all duration-300 ease-out hover:bg-white hover:text-black hover:-translate-y-1"
                >
                    MENU
                </button>
            </div>
        </div>
    )
}
