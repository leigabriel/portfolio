const navLinks = [
    { index: '01', label: 'Web Projects', tab: 0 },
    { index: '02', label: 'Poster Designs', tab: 1 },
    { index: '03', label: 'Motion Posters', tab: 2 },
]

const socialLinks = [
    { label: 'email', href: 'mailto:malibiranleigabriel@gmail.com' },
    { label: 'instagram', href: 'https://instagram.com/leimxnsquare' },
    { label: 'facebook', href: 'https://facebook.com/leigabrielmalibiran' },
    { label: 'github', href: 'https://github.com/leigabriel' },
]

export default function Footer({ navigate }) {
    const openWorksTab = (tab) => {
        navigate?.('projects', { tab })
    }

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

    .footer-nav-link {
        cursor: url('/cursors/link.svg') 12 0, pointer !important;
        background: none;
        border-top: none;
        border-right: none;
        border-bottom: 1px dotted rgba(0, 0, 0, 0.25);
        border-left: none;
        transition: background-color 0.35s ease, color 0.35s ease, padding-left 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .footer-nav-link:last-child {
        border-bottom: none;
    }

    .footer-nav-link:hover,
    .footer-nav-link:focus-visible {
        background-color: black;
        color: white;
        padding-left: clamp(0.5rem, 1.5vw, 1.25rem);
    }

    .footer-nav-link:hover .footer-nav-index,
    .footer-nav-link:focus-visible .footer-nav-index,
    .footer-nav-link:hover .footer-nav-hint,
    .footer-nav-link:focus-visible .footer-nav-hint {
        color: rgba(255, 255, 255, 0.7);
    }

    .footer-nav-index,
    .footer-nav-hint {
        transition: color 0.35s ease;
    }

    .social-link {
        position: relative;
        display: inline-block;
        transition: background-color 0.3s ease, color 0.3s ease;
        cursor: url('/cursors/link.svg') 12 0, pointer !important;
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
                    <span className="font-mono-custom text-[10px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-black/45">
                        Portfolio
                    </span>
                    <span className="font-mono-custom text-[10px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-black/45">
                        2026
                    </span>
                </div>

                <div className="flex flex-1 items-center px-5 sm:px-8 md:px-12 lg:px-16 pt-6 sm:pt-10">
                    <nav className="w-full" aria-label="Works categories">
                        {navLinks.map(({ index, label, tab }, i) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => openWorksTab(tab)}
                                className="footer-nav-link reveal group flex w-full items-baseline gap-3 sm:gap-5 py-[clamp(0.45rem,1.4vh,0.9rem)] text-left text-black"
                                style={{ animationDelay: `${0.12 + i * 0.08}s` }}
                                aria-label={`${index} ${label}`}
                            >
                                <span className="footer-nav-index font-mono-custom text-[9px] sm:text-[10px] tracking-[0.25em] text-black/45 pt-[0.7em] shrink-0">
                                    {index}
                                </span>
                                <span className="footer-nav-label font-title text-[clamp(1.35rem,5.2vw,3.5rem)] leading-[1.1]">
                                    {label}
                                </span>
                                <span className="footer-nav-hint ml-auto font-mono-custom text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-black/35 pt-[0.7em] shrink-0">
                                    View
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="px-5 sm:px-8 md:px-12 lg:px-16 pb-0">
                    <div
                        className="reveal flex flex-col items-start gap-1.5 sm:gap-2 md:flex-row md:items-end md:justify-between w-full pb-2 sm:pb-3"
                        style={{ animationDelay: '0.4s' }}
                    >
                        {socialLinks.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target={label !== 'email' ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="social-link font-mono-custom text-black/90"
                                style={{
                                    fontSize: 'clamp(0.8rem, 2vw, 2.4rem)',
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
