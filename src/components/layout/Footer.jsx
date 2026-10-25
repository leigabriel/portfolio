import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { createGltfLoader } from '../../lib/gltf'

const navLinks = [
    { index: '01', label: 'Web Projects', tab: 0 },
    { index: '02', label: 'Poster Designs', tab: 1 },
    { index: '03', label: 'Motion Posters', tab: 2 },
]

// The keychain model ships three authored clips: Mocha_Swing,
// Mocha_Spin_360 and Mocha_Spin_Swing. The footer uses the gentle pendulum.
const FOOTER_CLIP = 'Mocha_Swing'

// Half speed stretches the 3.2s authored sway into a slow ~6.4s loop so the
// chain drifts calmly behind the wordmark.
const FOOTER_PLAYBACK_RATE = 0.5
// Decorative canvas: capped below retina density to keep the frame rate up.
const MAX_PIXEL_RATIO = 1.5

// Wide screens keep the original framing. On portrait screens the horizontal
// field of view is much narrower, so the camera pulls back until the chain fits
// instead of cropping it into an oversized-looking backdrop.
const BASE_CAMERA_DISTANCE = 5
const FIT_MARGIN = 1.06

// Lift the centred chain so it reads above the wordmark instead of sitting
// on top of it. World units match the targetSize scale below.
const FOOTER_Y_OFFSET = 0.1

// On tall, narrow screens the chain would sit directly behind the navigation
// labels. Below this aspect ratio it is scaled down and moved into the empty
// space above them instead.
const PORTRAIT_ASPECT = 0.8
const PORTRAIT_SCALE = 0.6
const PORTRAIT_LIFT = 0.3

const socialLinks = [
    { label: 'email', href: 'mailto:malibiranleigabriel@gmail.com' },
    { label: 'instagram', href: 'https://instagram.com/leimxnsquare' },
    { label: 'facebook', href: 'https://facebook.com/leigabrielmalibiran' },
    { label: 'github', href: 'https://github.com/leigabriel' },
]

// `watchRef` is the element whose visibility decides whether the 3D scene needs
// to render. On the home page the footer is fixed behind the content, so the
// footer itself is always "on screen"; the spacer that reveals it is what scrolls.
export default function Footer({ navigate, modelOpacity = 1, watchRef }) {
    const canvasRef = useRef(null)
    const sectionRef = useRef(null)

    const openWorksTab = (tab) => {
        navigate?.('projects', { tab })
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const section = sectionRef.current
        if (!canvas || !section) return undefined

        // Renderer. WebGL can be unavailable (blocked, disabled, exhausted
        // contexts); the footer is decorative, so fail quietly and keep the page.
        let renderer
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'low-power',
            })
        } catch (error) {
            console.warn('Footer 3D backdrop disabled:', error)
            return undefined
        }
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO))
        // Glass parts are drawn into an extra transmission buffer; half size is
        // visually identical on blurred refraction and a quarter of the pixels.
        renderer.transmissionResolutionScale = 0.5
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2

        // Scene
        const scene = new THREE.Scene()

        // Camera
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
        camera.position.set(0, 0, BASE_CAMERA_DISTANCE)
        const modelSize = new THREE.Vector3()

        // Lighting — strong enough to show the model's true colors
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
        scene.add(ambientLight)

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8)
        hemiLight.position.set(0, 10, 0)
        scene.add(hemiLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.8)
        dirLight.position.set(3, 5, 5)
        scene.add(dirLight)

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.6)
        fillLight.position.set(-3, -2, 3)
        scene.add(fillLight)

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.5)
        rimLight.position.set(0, 0, -5)
        scene.add(rimLight)

        let model = null
        let mixer = null
        let cancelled = false
        let loadStarted = false
        let frameId = null
        let modelBaseScale = 1
        let modelBaseY = 0

        // Places the chain for the current aspect ratio.
        const placeModel = () => {
            if (!model) return
            const portrait = camera.aspect < PORTRAIT_ASPECT
            const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.position.z
            model.scale.setScalar(modelBaseScale * (portrait ? PORTRAIT_SCALE : 1))
            model.position.y = modelBaseY + (portrait ? visibleHeight * PORTRAIT_LIFT : 0)
        }

        // Sizing
        const resize = () => {
            const rect = section.getBoundingClientRect()
            const w = Math.max(1, rect.width)
            const h = Math.max(1, rect.height)
            renderer.setSize(w, h)
            camera.aspect = w / h

            // Fit the chain's widest spin orientation inside the horizontal
            // field of view. On wide screens the base distance is already
            // enough, so they keep the original composition.
            const verticalFov = THREE.MathUtils.degToRad(camera.fov)
            const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
            const horizontalSpan = Math.hypot(modelSize.x, modelSize.z)
            const fitDistance =
                (horizontalSpan / 2 / Math.tan(horizontalFov / 2)) * FIT_MARGIN
            camera.position.z = Math.max(BASE_CAMERA_DISTANCE, fitDistance)

            camera.updateProjectionMatrix()
            placeModel()
            if (!frameId) renderer.render(scene, camera)
        }
        resize()

        // The 4 MB model is only fetched once the footer is about to be seen.
        const loadModel = () => {
            if (loadStarted) return
            loadStarted = true

            const loader = createGltfLoader()
            loader.load(
                '/models/workchain.glb',
                (gltf) => {
                    if (cancelled) {
                        gltf.scene.traverse((object) => {
                            if (!object.isMesh) return
                            object.geometry?.dispose()
                            if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
                            else object.material?.dispose()
                        })
                        return
                    }

                    model = gltf.scene

                    // Scale first, aim for ~2.8 units tall
                    const box = new THREE.Box3().setFromObject(model)
                    const size = box.getSize(new THREE.Vector3())
                    const maxDim = Math.max(size.x, size.y, size.z)
                    const targetSize = 2.8
                    model.scale.setScalar(targetSize / maxDim)

                    // Then centre the transformed geometry. model.position is not
                    // affected by the object's own scale, so subtracting the
                    // pre-scale centre would leave the chain off-axis. The box also
                    // records the footprint the camera has to fit while it spins.
                    const scaledBox = new THREE.Box3().setFromObject(model)
                    const scaledCenter = scaledBox.getCenter(new THREE.Vector3())
                    scaledBox.getSize(modelSize)
                    model.position.sub(scaledCenter)
                    model.position.y += FOOTER_Y_OFFSET
                    modelBaseScale = model.scale.x
                    modelBaseY = model.position.y

                    // Keep original materials — apply opacity control
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material.side = THREE.DoubleSide
                            child.material.transparent = modelOpacity < 1
                            child.material.opacity = modelOpacity
                            child.material.needsUpdate = true
                            child.castShadow = true
                            child.receiveShadow = true
                        }
                    })

                    scene.add(model)
                    resize()

                    // The clip owns the motion — no hand-rolled rotation. Scaling the
                    // mixer action keeps the authored loop boundaries intact.
                    const clip = gltf.animations?.find((item) => item.name === FOOTER_CLIP)
                    if (clip) {
                        mixer = new THREE.AnimationMixer(model)
                        const action = mixer.clipAction(clip)
                        action.setLoop(THREE.LoopRepeat, Infinity)
                        action.setEffectiveTimeScale(FOOTER_PLAYBACK_RATE)
                        action.play()
                        // Reduced motion: hold the first frame instead of spinning.
                        if (reduceMotion) action.paused = true
                    } else {
                        console.warn(`Clip "${FOOTER_CLIP}" not found in workchain.glb.`)
                    }
                    if (!frameId) renderer.render(scene, camera)
                },
                undefined,
                (err) => console.warn('Failed to load workchain.glb:', err)
            )
        }

        // Animation loop. It only runs while the footer can actually be seen.
        const clock = new THREE.Clock()
        const animate = () => {
            frameId = requestAnimationFrame(animate)
            if (mixer) mixer.update(clock.getDelta())

            renderer.render(scene, camera)
        }

        const startLoop = () => {
            if (frameId !== null) return
            clock.getDelta()
            frameId = requestAnimationFrame(animate)
        }

        const stopLoop = () => {
            if (frameId === null) return
            cancelAnimationFrame(frameId)
            frameId = null
        }

        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadModel()
                    startLoop()
                } else {
                    stopLoop()
                }
            },
            { rootMargin: '300px 0px' }
        )
        visibilityObserver.observe(watchRef?.current ?? section)

        // Resize observer
        const ro = new ResizeObserver(resize)
        ro.observe(section)

        return () => {
            cancelled = true
            stopLoop()
            visibilityObserver.disconnect()
            ro.disconnect()
            if (mixer && model) {
                mixer.stopAllAction()
                mixer.uncacheRoot(model)
            }
            renderer.dispose()
            scene.traverse((obj) => {
                if (obj.isMesh) {
                    obj.geometry?.dispose()
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
                    else obj.material?.dispose()
                }
            })
        }
    }, [modelOpacity, watchRef])

    return (
        <section ref={sectionRef} className="relative z-0 bg-[#ffea00] w-full h-dvh min-h-125 flex flex-col overflow-hidden text-black">
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

    @media (prefers-reduced-motion: reduce) {
        .reveal,
        .is-mounted .reveal {
            opacity: 1;
            animation: none;
        }
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
        padding-block: 0.4rem;
        transition: background-color 0.3s ease, color 0.3s ease;
        cursor: url('/cursors/link.svg') 12 0, pointer !important;
    }

    .social-link:hover,
    .social-link:focus-visible {
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

            {/* 3D Asterisk Backdrop */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-1 pointer-events-none"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col h-full min-h-125 is-mounted">

                <div className="flex flex-1 items-center px-5 sm:px-8 md:px-12 lg:px-16 pt-6 sm:pt-10">
                    <nav className="w-full" aria-label="Works categories">
                        {navLinks.map(({ index, label, tab }, i) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => openWorksTab(tab)}
                                className="footer-nav-link reveal group flex w-full items-baseline gap-3 sm:gap-5 py-[clamp(0.6rem,1.6vh,0.9rem)] text-left text-black"
                                style={{ animationDelay: `${0.12 + i * 0.08}s` }}
                                aria-label={`${index} ${label}`}
                            >
                                <span className="footer-nav-index font-mono-custom text-[11px] sm:text-xs tracking-[0.25em] text-black/60 pt-[0.7em] shrink-0">
                                    {index}
                                </span>
                                <span className="footer-nav-label font-title text-[clamp(1.35rem,5.2vw,3.5rem)] leading-[1.1]">
                                    {label}
                                </span>
                                <span className="footer-nav-hint ml-auto font-mono-custom text-[11px] sm:text-xs tracking-[0.25em] uppercase text-black/60 pt-[0.7em] shrink-0">
                                    View
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="px-5 sm:px-8 md:px-12 lg:px-16 pb-0">
                    <div
                        className="reveal flex flex-col items-start gap-0.5 sm:gap-1 md:flex-row md:items-end md:justify-between w-full pb-2 sm:pb-3"
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
                        <div
                            className="wordmark text-left text-black font-normal w-full block"
                            style={{
                                fontFamily: 'Tritopani, serif',
                                fontSize: 'clamp(2rem, 14.1vw, 24rem)',
                                lineHeight: '1',
                                whiteSpace: 'nowrap',
                            }}
                            role="img"
                            aria-label="Lei Gabriel Malibiran"
                        >
                            {'leigabrielmalibiran'.split('').map((char, i) => (
                                <span key={i} className="wordmark-char" aria-hidden="true">{char}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
