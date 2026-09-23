import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

export default function Footer() {
    const designRef = useRef(null)

    useEffect(() => {
        if (!designRef.current) return undefined

        const [draggable] = Draggable.create(designRef.current, {
            type: 'x,y',
            cursor: 'grab',
            activeCursor: 'grabbing',
            onRelease() {
                gsap.to(this.target, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.45)',
                })
            },
        })

        return () => draggable.kill()
    }, [])

    const socialLinks = [
        { label: 'email', href: 'mailto:malibiranleigabriel@gmail.com' },
        { label: 'instagram', href: 'https://instagram.com/leimxnsquare' },
        { label: 'facebook', href: 'https://facebook.com/leigabrielmalibiran' },
        { label: 'github', href: 'https://github.com/leigabriel' },
    ]

    return (
        <section className="relative z-0 bg-[#ffea00] w-full h-dvh min-h-125 flex flex-col overflow-hidden text-black">
            <style>{`
    @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .reveal {
        opacity: 0;
    }

    .is-mounted .reveal {
        animation: fadeSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .nav-link {
        position: relative;
        display: inline-block;
        transition: color 0.3s ease;
        cursor: pointer;
    }

    .nav-link::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0%;
        height: 3px;
         background: black;
        transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .nav-link:hover::after {
        width: 100%;
    }

    .nav-link:hover {
         color: rgba(0,0,0,0.7);
    }

    .social-link {
        position: relative;
        display: inline-block;
        transition: background-color 0.3s ease, color 0.3s ease;
        cursor: pointer;
    }

    .social-link:hover {
        background-color: black;
        color: white !important;
    }

    .wordmark {
        line-height: 0.82;
        letter-spacing: -0.02em;
    }

    .wordmark-char {
        display: inline-block;
        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                    color 0.3s ease;
    }

    .wordmark:hover .wordmark-char {
         color: rgba(0,0,0,0.15);
    }

    .wordmark .wordmark-char:hover {
        transform: translateY(-8px) scale(1.04);
         color: black !important;
    }

    @media (max-width: 640px) {
        .wordmark .wordmark-char:hover {
            transform: translateY(-4px) scale(1.02);
        }
    }

`}</style>

            <div className="relative z-10 flex flex-col h-full min-h-125 is-mounted">

                <div className="reveal flex items-start justify-between px-5 sm:px-8 md:px-12 lg:px-16 pt-5 sm:pt-8 md:pt-12" style={{ animationDelay: '0s' }}>
                    {/* <span className="font-mono-custom text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.15em] uppercase text-white/80">
                        PORTFOLIO
                    </span>
                    <span className="font-mono-custom text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.15em] text-white/80">
                        2026
                    </span> */}
                </div>

                <div className="reveal flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 pt-2 sm:pt-3 md:pt-4" style={{ animationDelay: '0.1s' }}>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    {/* <img
                        ref={designRef}
                        src="/svg/design.png"
                        alt="Designer"
                        className="w-[clamp(28rem,32vw,32rem)] touch-none select-none object-contain"
                    /> */}
                </div>

                <div className="px-5 sm:px-8 md:px-12 lg:px-16 pb-0">
                    <div className="reveal flex items-end justify-between w-full pb-1 sm:pb-2" style={{ animationDelay: '0.3s' }}>
                        {socialLinks.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target={label !== 'email' ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="social-link font-mono-custom text-black/90"
                                style={{
                                    fontSize: 'clamp(0.7rem, 2vw, 2.4rem)',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                [{label}]
                            </a>
                        ))}
                    </div>

                    <div
                        className="reveal w-full overflow-hidden"
                        style={{ animationDelay: '0.45s' }}
                    >
                        <h1
                            className="wordmark text-left text-black font-normal w-full block"
                            style={{
                                fontFamily: 'Tritopani, serif',
                                fontSize: 'clamp(2rem, 14.1vw, 24rem)',
                                lineHeight: '1',
                                whiteSpace: 'nowrap',
                            }}
                            aria-label="LEI GABRIEL"
                        >
                            {'leigabrielmalibiran'.split('').map((char, i) => (
                                <span key={i} className="wordmark-char">{char}</span>
                            ))}
                        </h1>
                    </div>
                </div>
            </div>
        </section>
    )
}
