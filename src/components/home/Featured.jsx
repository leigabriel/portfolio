import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { featuredProjects } from '../../data'

gsap.registerPlugin(ScrollTrigger)

const DETAIL_PAGE = { web: 'web-detail', poster: 'poster-detail', motion: 'motion-detail' }

export default function Featured({ navigate }) {
    const sectionRef = useRef(null)

    useLenis(() => ScrollTrigger.update(), [])

    useLayoutEffect(() => {
        const section = sectionRef.current
        if (!section) return undefined

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduceMotion) return undefined

        const ctx = gsap.context(() => {
            const quote = section.querySelector('[data-featured-quote]')
            if (quote) {
                gsap.fromTo(
                    quote,
                    { y: 70, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: quote,
                            start: 'top 97%',
                            end: 'top 62%',
                            scrub: 0.5,
                        },
                    }
                )
            }

            gsap.utils.toArray('.featured-card', section).forEach((card) => {
                const reveal = card.querySelectorAll('[data-reveal]')
                gsap.fromTo(
                    reveal,
                    { y: 46, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'none',
                        stagger: 0.07,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 93%',
                            end: 'top 66%',
                            scrub: 0.55,
                        },
                    }
                )

                const img = card.querySelector('[data-parallax]')
                if (img) {
                    gsap.fromTo(
                        img,
                        { yPercent: -4, scale: 1.1 },
                        {
                            yPercent: 4,
                            scale: 1.1,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: 0.6,
                            },
                        }
                    )
                }
            })
        }, section)

        return () => ctx.revert()
    }, [])

    const openProject = (item) => {
        navigate(DETAIL_PAGE[item.type], { ...item.source, type: item.type })
    }

    const total = featuredProjects.length
    const index = String(total).padStart(2, '0')

    return (
        <section
            ref={sectionRef}
            className="featured relative isolate bg-white text-black"
            style={{ '--featured-pad': 'clamp(1rem, 4vw, 3rem)' }}
        >
            <h2 className="sr-only">Selected Projects</h2>

            <div className="px-(--featured-pad) pt-[clamp(4.5rem,10vh,7.5rem)] pb-[clamp(4rem,11vh,8rem)]">
                <div className="grid gap-x-[clamp(1.5rem,3.5vw,3.5rem)] gap-y-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                    <blockquote
                        data-featured-quote
                        className="m-0 [text-indent:-0.42em] font-title font-bold uppercase text-[clamp(2.5rem,10.5vw,4.25rem)] leading-[0.84] tracking-[-0.025em] lg:text-[clamp(2.5rem,6.2vw,6.75rem)]"
                    >
                        <span aria-hidden="true">&ldquo;</span>
                        I enjoy working on designs that not only look good, but also make sense
                        to the people who use them.
                        <span aria-hidden="true">&rdquo;</span>
                    </blockquote>

                    <div className="lg:pt-[0.15rem]">
                        <div className="flex items-baseline justify-between gap-4 border-b border-black/15 pb-1.5 font-mono-custom text-[9px] tracking-[0.22em] uppercase text-black/60 sm:text-[10px]">
                            <span>Selected Projects</span>
                            <span>
                                ({index}) &mdash; Posters / 2026
                            </span>
                        </div>

                        <ol className="m-0 mt-[clamp(0.5rem,1.2vw,0.9rem)] grid list-none grid-cols-2 gap-[clamp(0.4rem,1vw,0.85rem)] p-0 sm:grid-cols-3">
                            {featuredProjects.map((item, position) => (
                                <li key={item.key} className="featured-card m-0 p-0">
                                    <a
                                        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                                        href={`#/works/${item.type}/${item.projectId}`}
                                        onClick={(event) => {
                                            event.preventDefault()
                                            openProject(item)
                                        }}
                                        aria-label={`Open ${item.title}, ${item.year}`}
                                    >
                                        <div className="relative aspect-3/4 overflow-hidden bg-[#f0f0f0]">
                                            <img
                                                data-parallax
                                                src={item.img}
                                                alt={item.alt}
                                                loading={position === 0 ? 'eager' : 'lazy'}
                                                decoding="async"
                                                draggable={false}
                                                className="absolute inset-0 h-full w-full object-cover object-center select-none will-change-transform"
                                            />
                                        </div>

                                        <div
                                            className="mt-[clamp(0.35rem,0.7vw,0.55rem)] flex items-baseline gap-2 font-mono-custom text-[9px] leading-none tracking-[0.14em] uppercase sm:text-[10px]"
                                            data-reveal
                                        >
                                            <span className="shrink-0 text-black/40">
                                                {String(position + 1).padStart(2, '0')}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate underline-offset-2 group-hover:underline">
                                                {item.title}
                                            </span>
                                            <span className="shrink-0 text-black/50 transition-colors duration-300 group-hover:text-black">
                                                {item.year}
                                            </span>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    )
}
