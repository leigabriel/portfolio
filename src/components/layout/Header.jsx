import { useState, useCallback } from 'react'
import { playSfx, preloadSfx } from '../../lib/sfx'
import useHoverHide from '../../hooks/useHoverHide'

const navLinks = [
    { label: 'Home', dest: 'home' },
    { label: 'About', dest: 'about' },
    { label: 'Works', dest: 'projects' },
    { label: 'Archive', dest: 'archive' },
    { label: 'Contact', dest: 'contact' },
]

// The header owns its fixed positioning and stays transparent (no backing bar
// or blur). `variant` sets the text colour for both the desktop nav and the
// mobile bar.
preloadSfx()

export default function Header({ setIsMenuOpen, navigate, variant = 'light', className = '', style = {} }) {
    const [hovered, setHovered] = useState(null)
    const headerVisible = useHoverHide()

    const isLight = variant === 'light'
    const textColor = isLight ? '#fff' : '#000'
    const hoverBg = isLight ? '#fff' : '#000'
    const hoverText = isLight ? '#000' : '#fff'

    const handleOpen = useCallback(() => {
        playSfx({ volume: 0.7, rate: 1.15 })
        setIsMenuOpen(true)
    }, [setIsMenuOpen])

    return (
        <header
            className="fixed top-0 left-0 z-50 w-full"
            style={{
                transform: headerVisible ? 'translateY(0)' : 'translateY(-110%)',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: headerVisible ? 'auto' : 'none',
                willChange: 'transform',
                paddingTop: 'env(safe-area-inset-top)',
            }}
        >
            <div
                className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-9"
                style={{ color: textColor }}
            >
                <nav
                    className={`hidden md:flex items-center gap-6 lg:gap-[clamp(2rem,8vw,8rem)] ${className}`}
                    style={style}
                    aria-label="Primary"
                >
                    {navLinks.map(({ label, dest }, idx) => (
                        <button
                            key={dest}
                            type="button"
                            onClick={() => navigate(dest)}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => setHovered(idx)}
                            onBlur={() => setHovered(null)}
                            className="nav-hover-btn text-xl tracking-widest uppercase cursor-pointer border-none bg-transparent px-1 py-1"
                            style={{ color: hovered === idx ? hoverText : 'inherit', transition: 'color 0.3s ease' }}
                        >
                            <span className="relative isolate inline-block py-1.5 leading-[1.15]">
                                <span
                                    className="absolute inset-0 -z-10 transition-transform duration-300 ease-out"
                                    style={{
                                        background: hoverBg,
                                        transform: hovered === idx ? 'scaleY(1)' : 'scaleY(0)',
                                        transformOrigin: 'bottom',
                                    }}
                                />
                                <span className="-mr-[0.1em] inline-block">{label}</span>
                            </span>
                        </button>
                    ))}
                </nav>

                <div className="md:hidden flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm tracking-widest uppercase">
                        LEI GABRIEL
                    </span>
                    <button
                        type="button"
                        onClick={handleOpen}
                        aria-haspopup="dialog"
                        className="-mr-3 min-h-11 min-w-11 px-3 text-xs sm:text-sm tracking-widest uppercase cursor-pointer transition-opacity duration-300 ease-out hover:opacity-60"
                    >
                        MENU
                    </button>
                </div>
            </div>
        </header>
    )
}
