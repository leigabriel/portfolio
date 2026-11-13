import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

const SETTINGS = {
    radius: 1.8,
    verticalGap: 0.9,
    angleGap: 0.85,
    cardWidth: 1.4,
    cardHeight: 1.75,
    idleSpin: 0.005,
    scrollSensitivity: 0.004,
    smoothing: 0.1,
    wobbleStrength: 0.3,
}

const BASE_CAMERA_Z = 8
const MAX_CAMERA_Z = 24
const MAX_PIXEL_RATIO = 2
const CLICK_SLOP = 8

const vertexShader = `
    uniform float uWobble;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        viewPosition.x += sin(uv.y * 3.14159) * uWobble;
        gl_Position = projectionMatrix * viewPosition;
    }
`

const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uLoaded;
    varying vec2 vUv;

    void main() {
        vec4 color = vec4(0.92, 0.92, 0.92, 1.0);
        if (uLoaded > 0.5) color = texture2D(uTexture, vUv);
        if (!gl_FrontFacing) color.rgb = mix(color.rgb, vec3(1.0), 0.75);
        gl_FragColor = color;
        #include <colorspace_fragment>
    }
`

export default function ImageSpiral({ items, onSelect, onUnsupported }) {
    const containerRef = useRef(null)
    const canvasRef = useRef(null)
    const onSelectRef = useRef(onSelect)
    const onUnsupportedRef = useRef(onUnsupported)

    useEffect(() => {
        onSelectRef.current = onSelect
    }, [onSelect])

    useEffect(() => {
        onUnsupportedRef.current = onUnsupported
    }, [onUnsupported])

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current
        if (!container || !canvas || items.length === 0) return undefined

        // The spiral is decorative, but it is also the archive itself. If WebGL
        // is unavailable the page falls back to the plain grid instead.
        let renderer
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        } catch (error) {
            console.warn('Archive spiral disabled:', error)
            onUnsupportedRef.current?.()
            return undefined
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO))
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const idleSpin = reduceMotion ? 0 : SETTINGS.idleSpin
        const wobbleStrength = reduceMotion ? 0 : SETTINGS.wobbleStrength
        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
        camera.position.z = BASE_CAMERA_Z

        const geometry = new THREE.PlaneGeometry(SETTINGS.cardWidth, SETTINGS.cardHeight, 1, 16)
        const textureLoader = new THREE.TextureLoader()
        textureLoader.setCrossOrigin('anonymous')

        const wobble = { value: 0 }
        const cards = []
        const materials = []
        const textures = []
        let disposed = false

        // One material (and texture) per image; the duplicated half of the
        // spiral reuses them, so only the unique posters are downloaded.
        const entries = items.map((item) => {
            const entry = { item, material: null, texture: null }
            entry.material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                side: THREE.DoubleSide,
                uniforms: {
                    uTexture: { value: null },
                    uWobble: wobble,
                    uLoaded: { value: 0 },
                },
            })

            entry.texture = textureLoader.load(
                item.image,
                (texture) => {
                    if (disposed) return
                    texture.colorSpace = THREE.SRGBColorSpace
                    texture.anisotropy = maxAnisotropy
                    entry.material.uniforms.uLoaded.value = 1
                    renderer.render(scene, camera)
                },
                undefined,
                () => {},
            )
            entry.texture.colorSpace = THREE.SRGBColorSpace
            entry.material.uniforms.uTexture.value = entry.texture

            materials.push(entry.material)
            textures.push(entry.texture)
            return entry
        })

        const cardCount = entries.length * 2
        for (let index = 0; index < cardCount; index++) {
            const entry = entries[index % entries.length]
            const card = new THREE.Mesh(geometry, entry.material)
            card.userData.item = entry.item
            scene.add(card)
            cards.push(card)
        }

        const state = { rotation: 0, rotationTarget: 0 }

        const resize = () => {
            const width = Math.max(1, container.clientWidth)
            const height = Math.max(1, container.clientHeight)
            renderer.setSize(width, height, false)
            camera.aspect = width / height

            // Portrait screens have very little horizontal room at the default
            // distance, so pull the camera back just enough to keep the ring
            // and its cards inside the frame.
            const halfVerticalFov = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
            const fitWidth = SETTINGS.radius + SETTINGS.cardWidth / 2 + 0.3
            camera.position.z = Math.min(
                MAX_CAMERA_Z,
                Math.max(BASE_CAMERA_Z, fitWidth / (halfVerticalFov * camera.aspect)),
            )
            camera.updateProjectionMatrix()
            renderer.render(scene, camera)
        }
        resize()

        const tick = () => {
            const delta = gsap.ticker.deltaRatio()
            const ease = 1 - Math.pow(1 - SETTINGS.smoothing, delta)

            state.rotationTarget += idleSpin * delta
            state.rotation += (state.rotationTarget - state.rotation) * ease

            const lag = gsap.utils.clamp(-1, 1, state.rotationTarget - state.rotation)
            wobble.value += (lag * wobbleStrength - wobble.value) * ease

            cards.forEach((card, index) => {
                const slot = THREE.MathUtils.euclideanModulo(index - state.rotation, cardCount) - cardCount / 2
                const angle = slot * SETTINGS.angleGap + Math.PI / 2
                card.position.set(
                    Math.cos(angle) * SETTINGS.radius,
                    slot * SETTINGS.verticalGap,
                    Math.sin(angle) * SETTINGS.radius,
                )
                card.rotation.y = Math.PI / 2 - angle
            })

            renderer.render(scene, camera)
        }

        gsap.ticker.add(tick)

        const scrollObserver = Observer.create({
            target: canvas,
            type: 'wheel,touch',
            preventDefault: true,
            onChange: (self) => {
                // Wheel and vertical swipes use deltaY; a horizontal swipe on a
                // touch screen should spin the spiral too.
                const delta = Math.abs(self.deltaX) > Math.abs(self.deltaY) ? self.deltaX : self.deltaY
                state.rotationTarget += delta * SETTINGS.scrollSensitivity
            },
        })

        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()
        let press = null

        const openAtPointer = (event) => {
            const rect = canvas.getBoundingClientRect()
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
            raycaster.setFromCamera(pointer, camera)

            const hit = raycaster.intersectObjects(cards, false)[0]
            if (hit?.object.userData.item) onSelectRef.current?.(hit.object.userData.item)
        }

        const handlePointerDown = (event) => {
            press = { x: event.clientX, y: event.clientY, id: event.pointerId }
        }

        const handlePointerUp = (event) => {
            if (!press || press.id !== event.pointerId) return
            const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y)
            press = null
            if (moved <= CLICK_SLOP) openAtPointer(event)
        }

        const handlePointerCancel = () => {
            press = null
        }

        const handleKeyDown = (event) => {
            const step = event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1
                : event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1
                    : 0

            if (step) {
                event.preventDefault()
                state.rotationTarget += step
                return
            }

            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            const centered = Math.round(state.rotation)
            const index = THREE.MathUtils.euclideanModulo(centered, cardCount)
            const item = cards[index]?.userData.item
            if (item) onSelectRef.current?.(item)
        }

        const handleContextLost = (event) => {
            event.preventDefault()
            onUnsupportedRef.current?.()
        }

        canvas.addEventListener('pointerdown', handlePointerDown)
        canvas.addEventListener('pointerup', handlePointerUp)
        canvas.addEventListener('pointercancel', handlePointerCancel)
        canvas.addEventListener('keydown', handleKeyDown)
        canvas.addEventListener('webglcontextlost', handleContextLost)

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)
        window.addEventListener('resize', resize)

        return () => {
            disposed = true
            scrollObserver.kill()
            gsap.ticker.remove(tick)
            resizeObserver.disconnect()
            window.removeEventListener('resize', resize)
            canvas.removeEventListener('pointerdown', handlePointerDown)
            canvas.removeEventListener('pointerup', handlePointerUp)
            canvas.removeEventListener('pointercancel', handlePointerCancel)
            canvas.removeEventListener('keydown', handleKeyDown)
            canvas.removeEventListener('webglcontextlost', handleContextLost)

            textures.forEach((texture) => texture.dispose())
            materials.forEach((material) => material.dispose())
            geometry.dispose()
            renderer.dispose()
        }
    }, [items])

    return (
        <div ref={containerRef} className="absolute inset-0">
            <style>{`
                .archive-spiral-canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                    touch-action: none;
                }
                .archive-spiral-canvas:focus-visible {
                    outline: 2px solid #000;
                    outline-offset: -4px;
                }
            `}</style>
            <canvas
                ref={canvasRef}
                className="archive-spiral-canvas"
                role="img"
                aria-label="Rotating spiral of archive posters. Use the arrow keys to spin it and press Enter to open the centered poster."
                tabIndex={0}
            />
        </div>
    )
}
