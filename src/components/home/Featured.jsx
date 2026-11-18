import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { featuredGallery } from '../../data'

gsap.registerPlugin(ScrollTrigger)

export default function Featured({ navigate }) {
    const sectionRef = useRef(null)

    useLenis(() => ScrollTrigger.update(), [])

    useLayoutEffect(() => {
        const section = sectionRef.current
        if (!section) return undefined

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduceMotion) return undefined

        const ctx = gsap.context(() => {
            gsap.fromTo(
                section.querySelectorAll('[data-featured-meta]'),
                { y: 28, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: 'none',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 96%',
                        end: 'top 72%',
                        scrub: 0.5,
                    },
                }
            )

            const grid = section.querySelector('[data-featured-grid]')
            if (grid) {
                gsap.fromTo(
                    grid.querySelectorAll('[data-featured-tile]'),
                    { opacity: 0 },
                    {
                        opacity: 1,
                        ease: 'none',
                        stagger: 0.04,
                        scrollTrigger: {
                            trigger: grid,
                            start: 'top 95%',
                            end: 'top 55%',
                            scrub: 0.55,
                        },
                    }
                )

                gsap.fromTo(
                    grid.querySelectorAll('img'),
                    { scale: 1.045 },
                    {
                        scale: 1,
                        ease: 'none',
                        stagger: 0.04,
                        scrollTrigger: {
                            trigger: grid,
                            start: 'top 95%',
                            end: 'top 55%',
                            scrub: 0.55,
                        },
                    }
                )
            }

            const task = section.querySelector('[data-featured-task]')
            if (task) {
                gsap.fromTo(
                    task,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: task,
                            start: 'top 96%',
                            end: 'top 72%',
                            scrub: 0.5,
                        },
                    }
                )
            }
        }, section)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            className="featured relative isolate bg-white text-black"
            style={{ '--featured-pad': 'clamp(1.25rem, 3vw, 2.5rem)' }}
        >
            <h2 className="sr-only">Selected poster work</h2>

            <div className="pt-[clamp(4rem,9vw,7rem)]">
                <div className="px-(--featured-pad)">
                    <div className="flex items-baseline justify-between gap-6" data-featured-meta>
                        <p className="m-0 font-mono-custom text-[11px] uppercase tracking-[0.22em] sm:text-xs">
                            01. Posters
                        </p>
                        <p className="m-0 font-mono-custom text-xs font-medium tracking-[0.01em] sm:text-[13px]">
                            Selected Posters
                        </p>
                    </div>

                    <div className="mt-8 sm:mt-10" data-featured-meta>
                        <p className="m-0 font-mono-custom text-[11px] text-black/45 sm:text-xs">
                            Discipline
                        </p>
                        <p className="m-0 mt-1 font-mono-custom text-[11px] sm:text-xs">
                            Graphic Design
                        </p>
                    </div>
                </div>

                <ol
                    className="m-0 mt-[clamp(3rem,7vw,6rem)] grid list-none grid-cols-3 gap-0 p-0"
                    data-featured-grid
                >
                    {featuredGallery.map((item, index) => (
                        <li
                            key={item.title}
                            className="m-0 overflow-hidden bg-[#efefef] p-0"
                            data-featured-tile
                        >
                            <img
                                src={item.src}
                                alt={item.alt}
                                loading={index < 3 ? 'eager' : 'lazy'}
                                decoding="async"
                                draggable={false}
                                className="block aspect-[4/5] w-full select-none object-cover object-center"
                            />
                        </li>
                    ))}
                </ol>

                <div
                    className="mt-[clamp(3.5rem,7vw,6rem)] px-(--featured-pad) pb-[clamp(4rem,10vw,7.5rem)]"
                    data-featured-task
                >
                    <p className="m-0 font-mono-custom text-[11px] uppercase tracking-[0.22em] text-black/40 sm:text-xs">
                        .Task
                    </p>

                    <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
                        <p className="m-0 max-w-[52ch] font-mono-custom text-[13px] leading-[1.7] text-black/75 sm:text-sm">
                            A selection of poster work exploring typographic hierarchy, image
                            treatment, and editorial composition across manga, music, and personal
                            projects.
                        </p>

                        <div className="flex items-end justify-between gap-6 md:justify-end">
                            <dl className="m-0 grid grid-cols-3 gap-x-5 sm:gap-x-10">
                                <div>
                                    <dt className="font-mono-custom text-[11px] text-black/45 sm:text-xs">
                                        Project
                                    </dt>
                                    <dd className="m-0 mt-1.5 font-mono-custom text-[11px] leading-[1.4] tracking-[0.02em] sm:text-xs">
                                        Poster Series
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-mono-custom text-[11px] text-black/45 sm:text-xs">
                                        Focus
                                    </dt>
                                    <dd className="m-0 mt-1.5 font-mono-custom text-[11px] leading-[1.4] tracking-[0.02em] sm:text-xs">
                                        Typography
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-mono-custom text-[11px] text-black/45 sm:text-xs">
                                        Year
                                    </dt>
                                    <dd className="m-0 mt-1.5 font-mono-custom text-[11px] leading-[1.4] tracking-[0.02em] sm:text-xs">
                                        2026
                                    </dd>
                                </div>
                            </dl>

                            <a
                                href="#/works"
                                onClick={(event) => {
                                    event.preventDefault()
                                    navigate?.('projects', { tab: 1 })
                                }}
                                aria-label="View all poster designs"
                                className="group -mr-1 inline-flex h-12 w-12 shrink-0 items-center justify-center text-black transition-transform duration-300 hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.25"
                                    aria-hidden="true"
                                    className="h-9 w-9"
                                >
                                    <path d="m7 7 10 10M17 8v9H8" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
