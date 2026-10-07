import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { homeImages } from '../../data/home-img'

gsap.registerPlugin(Observer)

// Card geometry mirrors the reference. The 3:4 canvas is not arbitrary: the ring
// maps a slice's full card height onto a destination rect whose aspect only
// matches at width/height = 1/1.33, so any other ratio stretches the artwork.
// The photo is cover-cropped to fill the whole card, leaving no caption band.
const CARD_WIDTH = 1200
const CARD_HEIGHT = 1600
const GAP = 0.18
const NORMAL_SPEED = 0.01
const SPIN_FACTOR = 0.002
const SPIN_DECAY_DURATION = 2
const MAX_DPR = 2
const BACK_FILL = '#d8d4ce'

const SLICES_MAX = 120
const SLICES_MIN = 48
const SLICE_BUDGET = 960
const SLICE_BUDGET_NARROW = 520
const NARROW_BREAKPOINT = 640
const LOAD_CONCURRENCY = 3

// The ring divides its height between however many cards it carries, so the
// card count sets how large each card reads. The reference uses eight.
const CARD_LIMIT = 8
const heroCards = homeImages.slice(0, CARD_LIMIT)
const CARD_COUNT = heroCards.length

function computeSlices(count, width) {
    const budget = width < NARROW_BREAKPOINT ? SLICE_BUDGET_NARROW : SLICE_BUDGET
    return Math.max(SLICES_MIN, Math.min(SLICES_MAX, Math.round(budget / count)))
}

export default function Hero() {
    const sectionRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current
        const canvas = canvasRef.current
        if (!section || !canvas) return undefined

        const ctx = canvas.getContext('2d')
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const ring = { angle: 0, speed: NORMAL_SPEED, tilt: -0.28 }
        const viewport = { width: 0, height: 0, dpr: 0, slices: SLICES_MAX }

        let wheelObserver
        let dragObserver
        let isVisible = true

        function pointOnRing(angle, radius) {
            const depth = Math.cos(angle)
            const scale = 1 + depth * 0.25

            return {
                x: Math.sin(angle) * radius * scale,
                y: depth * radius * 0.2,
                scale,
            }
        }

        // Each poster becomes its own offscreen canvas, cover-cropped to fill a
        // 3:4 portrait card edge to edge. No text, no border, no caption band.
        function createCard({ src }) {
            const canvas = document.createElement('canvas')
            canvas.width = CARD_WIDTH
            canvas.height = CARD_HEIGHT

            return { src, canvas, ctx: canvas.getContext('2d'), ready: false }
        }

        const cards = heroCards.map(createCard)
        let nextCard = 0

        function paintCard(card, image) {
            const scale = Math.max(
                CARD_WIDTH / image.naturalWidth,
                CARD_HEIGHT / image.naturalHeight
            )
            const width = image.naturalWidth * scale
            const height = image.naturalHeight * scale

            card.ctx.drawImage(
                image,
                (CARD_WIDTH - width) / 2,
                (CARD_HEIGHT - height) / 2,
                width,
                height
            )
        }

        // The posters total ~25MB, so they are decoded in small batches rather
        // than all at once. Cards appear in the ring as they arrive.
        function loadNextCard() {
            if (nextCard >= cards.length) return

            const card = cards[nextCard++]
            const image = new Image()

            image.addEventListener('load', () => {
                paintCard(card, image)
                card.ready = true
                render()
                loadNextCard()
            })
            image.addEventListener('error', loadNextCard)

            image.src = card.src
        }

        // Two passes, in this order, are required. The ring wraps around, so
        // front-facing and back-facing cards coexist while card index order only
        // tracks angle, not depth. Painting the back faces first guarantees every
        // front slice lands on top of them.
        function drawRing(side) {
            const radius = Math.min(viewport.width * 0.4, viewport.height * 0.5)
            const slices = viewport.slices
            const slotAngle = (Math.PI * 2) / CARD_COUNT
            const cardAngle = slotAngle * (1 - GAP)
            const sliceAngle = cardAngle / slices
            const cardHeight = radius * cardAngle * 1.33
            const sliceWidth = CARD_WIDTH / slices

            cards.forEach((card, cardIndex) => {
                for (let slice = 0; slice < slices; slice++) {
                    const angle = ring.angle + cardIndex * slotAngle + slice * sliceAngle
                    const start = pointOnRing(angle, radius)
                    const end = pointOnRing(angle + sliceAngle, radius)
                    const height = cardHeight * start.scale
                    const top = start.y - height / 2
                    const movingRight = end.x > start.x

                    if (side === 'front' && movingRight) {
                        if (!card.ready) continue
                        ctx.drawImage(
                            card.canvas,
                            slice * sliceWidth, 0, sliceWidth, CARD_HEIGHT,
                            start.x, top, end.x - start.x + 1, height
                        )
                    } else if (side === 'back' && !movingRight) {
                        ctx.fillStyle = BACK_FILL
                        ctx.fillRect(end.x, top, start.x - end.x + 1, height)
                    }
                }
            })
        }

        function render() {
            ctx.clearRect(0, 0, viewport.width, viewport.height)
            ctx.save()
            ctx.translate(viewport.width / 2, viewport.height * 0.47)
            ctx.rotate(ring.tilt)
            drawRing('back')
            drawRing('front')
            ctx.restore()
        }

        function tick() {
            if (!isVisible) return
            ring.angle += ring.speed * gsap.ticker.deltaRatio()
            render()
        }

        function spin(amount) {
            if (!amount) return
            gsap.fromTo(
                ring,
                { speed: amount * SPIN_FACTOR },
                { speed: NORMAL_SPEED, duration: SPIN_DECAY_DURATION, overwrite: 'auto' }
            )
        }

        function resize() {
            const width = section.clientWidth
            const height = section.clientHeight
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

            if (width === viewport.width && height === viewport.height && dpr === viewport.dpr) {
                return
            }

            viewport.width = width
            viewport.height = height
            viewport.dpr = dpr
            viewport.slices = computeSlices(CARD_COUNT, width)

            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            render()
        }

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(section)

        const intersectionObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting
        })
        intersectionObserver.observe(section)

        window.addEventListener('resize', resize)

        const gsapContext = gsap.context(() => {
            resize()

            for (let i = 0; i < LOAD_CONCURRENCY; i++) loadNextCard()

            if (reduceMotion) return

            gsap.ticker.add(tick)
            gsap.from(ring, { speed: 0.12, duration: 3, ease: 'power3.out' })
            gsap.to(ring, {
                tilt: -0.12,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            })

            // Wheel only feeds the spin impulse; the page keeps scrolling.
            wheelObserver = Observer.create({
                target: canvas,
                type: 'wheel',
                onChange: (self) => spin(self.deltaX + self.deltaY),
            })

            // Reads deltaX only, so a vertical touch swipe contributes nothing
            // and scrolls the page normally. Horizontal drag spins the ring.
            dragObserver = Observer.create({
                target: canvas,
                type: 'pointer',
                dragMinimum: 4,
                onDrag: (self) => spin(self.deltaX),
            })
        }, canvas)

        return () => {
            wheelObserver?.kill()
            dragObserver?.kill()
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            window.removeEventListener('resize', resize)
            gsap.ticker.remove(tick)
            gsapContext.revert()
        }
    }, [])

    return (
        <section ref={sectionRef} className="spotlight-hero">
            <style>{`
                .spotlight-hero {
                    position: sticky;
                    top: 0;
                    z-index: 0;
                    width: 100%;
                    height: 100dvh;
                    min-height: 500px;
                    overflow: hidden;
                    background:
                        radial-gradient(ellipse 32% 5% at 50% 90%, rgba(0, 0, 0, 0.12), transparent),
                        radial-gradient(circle at 50% 35%, #ffffff, #e9e5df);
                }

                .spotlight-canvas {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    touch-action: pan-y;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .spotlight-copy {
                    opacity: 0;
                    animation: fadeUp 0.55s ease-out forwards;
                    animation-delay: 0.45s;
                }

                .spotlight-title {
                    font-family: 'Tritopani', serif;
                    font-size: clamp(4rem, 4vw, 20rem);
                    line-height: 1;
                    color: #000;
                    white-space: nowrap;
                    pointer-events: none;
                    user-select: none;
                    text-transform: none;
                    letter-spacing: normal;
                }
            `}</style>

            <canvas
                ref={canvasRef}
                className="spotlight-canvas cursor-grab"
                role="img"
                aria-label={`Rotating gallery of ${CARD_COUNT} poster designs`}
            />

            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 p-4 sm:p-6 md:p-10 pointer-events-none">
                <div className="spotlight-copy max-w-[48%] spotlight-title text-black tracking-widest leading-none">
                    <span>malibiran</span>
                </div>

                <div className="spotlight-copy max-w-[48%] text-right text-black text-[10px] sm:text-xs tracking-widest uppercase leading-none">
                    <span>GRAPHIC DESIGNER</span>
                    <br />
                    <span>WEB DEVELOPER</span>
                </div>
            </div>
        </section>
    )
}
