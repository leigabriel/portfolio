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
            const head = section.querySelector('[data-featured-head]')
            if (head) {
                gsap.fromTo(
                    head,
                    { y: 70, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: head,
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

    return (
        <section
            ref={sectionRef}
            className="featured relative isolate bg-white text-black"
            style={{ '--featured-pad': 'clamp(1rem, 4vw, 3rem)' }}
        >
            <header className="px-(--featured-pad) pt-[clamp(5rem,13vh,8.5rem)] pb-[clamp(1.25rem,3vh,2.25rem)]">
                <div
                    data-featured-head
                    className="grid grid-cols-1 items-end gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-3 md:grid-cols-3"
                >
                    <h2 className="font-title text-[clamp(2.25rem,7.5vw,5.75rem)] leading-[0.92] font-bold tracking-[-0.03em] uppercase">
                        Selected Projects
                        <sup className="ml-[0.12em] align-super text-[0.3em] font-semibold tracking-[-0.01em]">
                            ({total})
                        </sup>
                    </h2>
                    <p className="text-[10px] leading-[1.9] tracking-[0.14em] uppercase text-black/50 md:pb-[0.35em]">
                        IN: Poster Design, Editorial, Manga, Monochrome
                    </p>
                    <p className="text-[10px] leading-[1.9] font-medium tracking-[0.14em] uppercase text-black md:pb-[0.35em]">
                        Overview
                    </p>
                </div>
            </header>

            <div className="px-(--featured-pad) pb-[clamp(4rem,11vh,8rem)]">
                <ol className="m-0 grid list-none grid-cols-1 gap-[clamp(1rem,1.8vw,1.5rem)] p-0 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProjects.map((item, index) => (
                        <li key={item.key} className="featured-card m-0 p-0">
                            <a
                                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                                href={`#/works/${item.type}/${item.projectId}`}
                                onClick={(event) => {
                                    event.preventDefault()
                                    openProject(item)
                                }}
                                aria-label={`Open ${item.title}`}
                            >
                                <div className="relative aspect-3/4 overflow-hidden bg-[#f0f0f0]">
                                    <img
                                        data-parallax
                                        src={item.img}
                                        alt={item.alt}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        draggable={false}
                                        className="absolute inset-0 h-full w-full object-cover object-center select-none will-change-transform"
                                    />
                                </div>

                                <div
                                    className="mt-[clamp(0.4rem,0.8vw,0.6rem)] flex border border-black text-[10px] uppercase"
                                    data-reveal
                                >
                                    <span className="min-w-0 flex-1 truncate px-2.5 py-2 tracking-[0.16em] transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                                        {item.title}
                                    </span>
                                    <span className="shrink-0 border-l border-black px-2.5 py-2 tracking-widest text-black/75 transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                                        {item.year}
                                    </span>
                                </div>

                                <span
                                    className="mt-[clamp(0.5rem,1vw,0.75rem)] inline-block text-[9px] tracking-[0.22em] text-black/45 uppercase transition-all duration-300 group-hover:tracking-[0.32em] group-hover:text-black"
                                    data-reveal
                                >
                                    View Project
                                </span>
                            </a>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
