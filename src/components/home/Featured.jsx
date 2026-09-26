import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { featuredProjects } from '../../data'

gsap.registerPlugin(ScrollTrigger)

const ACTIVE_START = 'top 62%'
const ACTIVE_END = 'bottom 38%'
const DETAIL_PAGE = { web: 'web-detail', poster: 'poster-detail', motion: 'motion-detail' }

export default function Featured({ navigate }) {
    const sectionRef = useRef(null)
    const layerRefs = useRef([])
    const [active, setActive] = useState(0)

    useLenis(() => ScrollTrigger.update(), [])

    useLayoutEffect(() => {
        const section = sectionRef.current
        if (!section) return undefined

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const ctx = gsap.context(() => {
            gsap.utils.toArray('.featured-item', section).forEach((item, index) => {
                ScrollTrigger.create({
                    trigger: item,
                    start: ACTIVE_START,
                    end: ACTIVE_END,
                    onEnter: () => setActive(index),
                    onEnterBack: () => setActive(index),
                    onRefresh: (self) => {
                        if (self.isActive) setActive(index)
                    },
                })

                const reveal = item.querySelectorAll('[data-reveal]')
                if (reduceMotion) {
                    gsap.set(reveal, { opacity: 1, y: 0 })
                    return
                }
                gsap.fromTo(
                    reveal,
                    { y: 48, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'none',
                        stagger: 0.05,
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 92%',
                            end: 'top 55%',
                            scrub: 0.55,
                        },
                    }
                )
            })

            if (reduceMotion) {
                gsap.set('[data-featured-head]', { opacity: 1, y: 0 })
            } else {
                gsap.fromTo(
                    '[data-featured-head]',
                    { y: 90, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '[data-featured-head]',
                            start: 'top 96%',
                            end: 'top 58%',
                            scrub: 0.5,
                        },
                    }
                )
            }
        }, section)

        return () => ctx.revert()
    }, [])

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        layerRefs.current.forEach((layer, index) => {
            if (!layer) return
            const isActive = index === active
            const img = layer.querySelector('img')
            const video = layer.querySelector('video')

            if (isActive) {
                video?.play().catch(() => {})
                gsap.to(layer, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.5, ease: 'power2.out', overwrite: true })
                if (img) {
                    gsap.fromTo(
                        img,
                        { scale: reduceMotion ? 1 : 1.12 },
                        { scale: 1, duration: reduceMotion ? 0 : 1.2, ease: 'power3.out', overwrite: true }
                    )
                }
            } else {
                video?.pause()
                gsap.to(layer, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.4, ease: 'power2.inOut', overwrite: true })
            }
        })
    }, [active])

    const openProject = (item) => {
        navigate(DETAIL_PAGE[item.type], { ...item.source, type: item.type })
    }

    const total = featuredProjects.length

    return (
        <section ref={sectionRef} className="featured relative isolate bg-black text-white">
            <style>{`
                .featured {
                    --featured-pad: clamp(1rem, 4vw, 3rem);
                    position: relative;
                    isolation: isolate;
                    background: #000;
                    color: #fff;
                    padding-bottom: clamp(3rem, 10vh, 8rem);
                }

                .featured-head {
                    padding: clamp(4.5rem, 12vh, 8rem) var(--featured-pad) clamp(1.5rem, 4vh, 3rem);
                }

                .featured-head-inner {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 1rem 2rem;
                }

                .featured-kicker {
                    font-family: var(--font-body);
                    font-size: 10px;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.55);
                }

                .featured-title {
                    font-family: var(--font-title);
                    font-size: clamp(3rem, 15vw, 10rem);
                    line-height: 0.95;
                    font-weight: 400;
                    margin: 0.35rem 0 0;
                    color: #fff;
                }

                .featured-note {
                    font-family: var(--font-body);
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.55);
                    max-width: 26ch;
                    line-height: 1.9;
                    text-align: left;
                }

                .featured-body {
                    padding: 0 var(--featured-pad);
                }

                .featured-media {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background: #000;
                    margin: 0 calc(var(--featured-pad) * -1);
                    padding: 0.5rem var(--featured-pad) 1.25rem;
                }

                .featured-frame {
                    position: relative;
                    width: 100%;
                    height: clamp(230px, 46dvh, 520px);
                    overflow: hidden;
                    background: transparent;
                }

                .featured-layer {
                    position: absolute;
                    inset: 0;
                    margin: 0;
                }

                .featured-layer img,
                .featured-layer video {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center;
                    will-change: transform;
                    user-select: none;
                    pointer-events: none;
                }

                .featured-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .featured-item {
                    display: flex;
                    align-items: center;
                    min-height: 66vh;
                    opacity: 0.4;
                    transition: opacity 0.5s ease;
                }

                .featured-item.is-active,
                .featured-item:hover {
                    opacity: 1;
                }

                .featured-item-btn {
                    display: grid;
                    grid-template-columns: auto minmax(0, 1fr);
                    gap: clamp(0.75rem, 2vw, 1.75rem);
                    align-items: start;
                    width: 100%;
                    padding: clamp(1.75rem, 6vh, 4rem) 0;
                    background: none;
                    border: 0;
                    color: inherit;
                    font: inherit;
                    text-align: left;
                    text-decoration: none;
                    cursor: url('/cursors/link.svg') 12 0, pointer;
                }

                .featured-item-index {
                    font-family: var(--font-body);
                    font-size: 10px;
                    letter-spacing: 0.3em;
                    color: rgba(255, 255, 255, 0.55);
                    padding-top: 0.7em;
                }

                .featured-item-title {
                    font-family: var(--font-title);
                    font-weight: 400;
                    font-size: clamp(1.85rem, 7vw, 4.25rem);
                    line-height: 1.05;
                    margin: 0;
                    color: #fff;
                }

                .featured-item-meta {
                    font-family: var(--font-body);
                    font-size: 10px;
                    letter-spacing: 0.24em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.55);
                    margin: clamp(0.85rem, 2vh, 1.25rem) 0 0;
                    line-height: 1.9;
                }

                .featured-item-desc {
                    font-family: var(--font-body);
                    font-size: clamp(0.72rem, 1.6vw, 0.85rem);
                    line-height: 1.9;
                    color: rgba(255, 255, 255, 0.72);
                    margin: clamp(0.75rem, 2vh, 1.1rem) 0 0;
                    max-width: 46ch;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .featured-item-cta {
                    display: inline-block;
                    margin-top: clamp(1rem, 3vh, 1.75rem);
                    font-family: var(--font-body);
                    font-size: 10px;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: #fff;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.45);
                    padding-bottom: 4px;
                    transition: border-color 0.3s ease, letter-spacing 0.3s ease;
                }

                .featured-item-btn:hover .featured-item-cta {
                    border-color: #fff;
                    letter-spacing: 0.36em;
                }

                @media (min-width: 640px) {
                    .featured-title {
                        font-size: clamp(4rem, 13vw, 10rem);
                    }

                    .featured-frame {
                        height: clamp(300px, 52dvh, 620px);
                    }
                }

                @media (min-width: 1024px) {
                    .featured-body {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        gap: clamp(2rem, 5vw, 5rem);
                        align-items: start;
                    }

                    .featured-media {
                        align-self: start;
                        top: 0;
                        z-index: 1;
                        height: 100dvh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        background: transparent;
                        margin: 0;
                        padding: 0;
                    }

                    .featured-frame {
                        height: min(74dvh, 780px);
                    }

                    .featured-item {
                        min-height: 82vh;
                    }

                    .featured-note {
                        text-align: right;
                    }
                }

                @media (max-width: 640px) {
                    .featured-item-desc {
                        -webkit-line-clamp: 3;
                    }

                    .featured-note {
                        max-width: 22ch;
                    }
                }
            `}</style>

            <header className="featured-head">
                <div className="featured-head-inner" data-featured-head>
                    <div>
                        <span className="featured-kicker">Selected work — {total} projects</span>
                        <h2 className="featured-title">featured</h2>
                    </div>
                    <p className="featured-note">Scroll the list. The frame follows the active piece.</p>
                </div>
            </header>

            <div className="featured-body">
                <div className="featured-media">
                    <div className="featured-frame">
                        {featuredProjects.map((item, index) => (
                            <figure
                                key={item.key}
                                className="featured-layer"
                                ref={(el) => {
                                    layerRefs.current[index] = el
                                }}
                                style={{ opacity: index === 0 ? 1 : 0 }}
                                aria-hidden={index !== active}
                            >
                                {item.video ? (
                                    <video
                                        src={item.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        draggable={false}
                                    />
                                ) : (
                                    <img
                                        src={item.img}
                                        alt={item.alt}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        draggable={false}
                                    />
                                )}
                            </figure>
                        ))}
                    </div>
                </div>

                <ol className="featured-list">
                    {featuredProjects.map((item, index) => (
                        <li
                            key={item.key}
                            className={`featured-item ${index === active ? 'is-active' : ''}`}
                        >
                            <a
                                className="featured-item-btn"
                                href={`#/works/${item.type}/${item.projectId}`}
                                onClick={(event) => {
                                    event.preventDefault()
                                    openProject(item)
                                }}
                                aria-label={`Open ${item.title}`}
                            >
                                <span className="featured-item-index" data-reveal>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <h3 className="featured-item-title" data-reveal>
                                        {item.title}
                                    </h3>
                                    <p className="featured-item-meta" data-reveal>
                                        {item.tag} · {item.year}
                                        {item.stack ? ` · ${item.stack}` : ''}
                                    </p>
                                    <p className="featured-item-desc" data-reveal>
                                        {item.description}
                                    </p>
                                    <span className="featured-item-cta" data-reveal>
                                        view project
                                    </span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
