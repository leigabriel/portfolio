import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// Every keychain model ships the same three authored clips: Mocha_Swing,
// Mocha_Spin_360 and Mocha_Spin_Swing. Each is a LINEAR loop driving
// MasterSplitRing plus the CharmBranch/CharmPivot rig.
const SPIN_CLIP = 'Mocha_Spin_360'

// Half speed keeps the turn calm behind the folder copy. Scaling the mixer
// action rather than the delta time keeps the clip's own loop boundaries.
const PLAYBACK_RATE = 0.5

export default function WorksKeychain({ src, targetSize = 3.4, className = '' }) {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return undefined

        // The keychain is decorative: if WebGL is unavailable, skip it quietly
        // instead of letting the error unmount the whole page.
        let renderer
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'low-power',
            })
        } catch (error) {
            console.warn('Keychain 3D disabled:', error)
            return undefined
        }
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100)
        let modelRadius = 1

        scene.add(new THREE.HemisphereLight(0xffffff, 0x5c5c5c, 1.8))
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
        keyLight.position.set(3, 5, 5)
        scene.add(keyLight)

        const resize = () => {
            const { width, height } = container.getBoundingClientRect()
            const safeWidth = Math.max(1, width)
            const safeHeight = Math.max(1, height)
            renderer.setSize(safeWidth, safeHeight, false)
            camera.aspect = safeWidth / safeHeight
            const verticalFov = THREE.MathUtils.degToRad(camera.fov)
            const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
            const limitingFov = Math.min(verticalFov, horizontalFov)
            // The bounding sphere covers every orientation during the spin, so
            // the camera only has to clear that sphere plus a small margin.
            const cameraDistance = (modelRadius / Math.tan(limitingFov / 2)) * 1.06
            camera.position.set(0, 0, cameraDistance)
            camera.lookAt(0, 0, 0)
            camera.far = Math.max(100, cameraDistance + modelRadius * 4)
            camera.updateProjectionMatrix()
        }
        resize()

        let model = null
        let mixer = null
        let cancelled = false
        const loader = new GLTFLoader()
        loader.load(
            src,
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
                const sourceBox = new THREE.Box3().setFromObject(model)
                const sourceSize = sourceBox.getSize(new THREE.Vector3())
                const maxDimension = Math.max(sourceSize.x, sourceSize.y, sourceSize.z)
                model.scale.setScalar(targetSize / maxDimension)

                // Scale first, then centre the transformed geometry. The source
                // scene has an offset origin, so centring before scaling shifts it.
                const scaledBox = new THREE.Box3().setFromObject(model)
                const scaledCenter = scaledBox.getCenter(new THREE.Vector3())
                model.position.sub(scaledCenter)
                const centeredBox = new THREE.Box3().setFromObject(model)
                modelRadius = centeredBox.getBoundingSphere(new THREE.Sphere()).radius
                resize()
                model.traverse((child) => {
                    if (!child.isMesh) return
                    child.material.side = THREE.DoubleSide
                    child.castShadow = true
                    child.receiveShadow = true
                })

                scene.add(model)

                // Play the authored spin rather than rotating the whole model by
                // hand. The clip only animates descendant nodes, so the centring
                // applied above is preserved.
                const clip = gltf.animations?.find((item) => item.name === SPIN_CLIP)
                if (clip) {
                    mixer = new THREE.AnimationMixer(model)
                    const action = mixer.clipAction(clip)
                    action.setLoop(THREE.LoopRepeat, Infinity)
                    action.setEffectiveTimeScale(PLAYBACK_RATE)
                    action.play()
                    if (reduceMotion) action.paused = true
                } else {
                    console.warn(`Clip "${SPIN_CLIP}" not found in ${src}.`)
                }
            },
            undefined,
            (error) => {
                console.warn(`Failed to load ${src}:`, error)
            },
        )

        let previousTime = performance.now()
        let frameId = null
        const animate = () => {
            frameId = requestAnimationFrame(animate)
            const currentTime = performance.now()
            const delta = Math.min((currentTime - previousTime) / 1000, 0.1)
            previousTime = currentTime
            if (mixer) mixer.update(delta)
            renderer.render(scene, camera)
        }

        const start = () => {
            if (frameId !== null) return
            previousTime = performance.now()
            frameId = requestAnimationFrame(animate)
        }

        const stop = () => {
            if (frameId === null) return
            cancelAnimationFrame(frameId)
            frameId = null
        }

        start()

        // Stop drawing the charm once it scrolls out of view instead of
        // keeping the WebGL loop and mixer alive behind the rest of the page.
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) start()
            else stop()
        })
        visibilityObserver.observe(container)

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)

        return () => {
            cancelled = true
            stop()
            visibilityObserver.disconnect()
            resizeObserver.disconnect()
            if (mixer && model) {
                mixer.stopAllAction()
                mixer.uncacheRoot(model)
            }
            renderer.dispose()
            scene.traverse((object) => {
                if (!object.isMesh) return
                object.geometry?.dispose()
                if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
                else object.material?.dispose()
            })
        }
    }, [src, targetSize])

    return (
        <div
            ref={containerRef}
            className={`works-keychain pointer-events-none absolute ${className}`}
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="block h-full w-full bg-transparent" />
        </div>
    )
}