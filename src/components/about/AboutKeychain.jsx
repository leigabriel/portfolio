import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default function AboutKeychain() {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return undefined

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'low-power',
        })
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
            // The bounding sphere covers every orientation during the spin.
            // Keep only a small safety margin so the model remains large.
            const cameraDistance = (modelRadius / Math.tan(limitingFov / 2)) * 1.06
            camera.position.set(0, 0, cameraDistance)
            camera.lookAt(0, 0, 0)
            camera.far = Math.max(100, cameraDistance + modelRadius * 4)
            camera.updateProjectionMatrix()
        }
        resize()

        let model = null
        const loader = new GLTFLoader()
        loader.load(
            '/models/aboutkeychain.gltf',
            (gltf) => {
                model = gltf.scene
                const sourceBox = new THREE.Box3().setFromObject(model)
                const sourceSize = sourceBox.getSize(new THREE.Vector3())
                const maxDimension = Math.max(sourceSize.x, sourceSize.y, sourceSize.z)
                const modelScale = 4.6 / maxDimension
                model.scale.setScalar(modelScale)

                // Scale first, then center the transformed geometry. The source
                // scene has an offset origin, so centering before scaling shifts it.
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
            },
            undefined,
            (error) => {
                console.warn('Failed to load about keychain model:', error)
            },
        )

        let previousTime = performance.now()
        let frameId
        const animate = () => {
            frameId = requestAnimationFrame(animate)
            const currentTime = performance.now()
            const delta = Math.min((currentTime - previousTime) / 1000, 0.1)
            previousTime = currentTime
            if (model) model.rotation.y += delta * 1.2
            renderer.render(scene, camera)
        }
        animate()

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)

        return () => {
            cancelAnimationFrame(frameId)
            resizeObserver.disconnect()
            renderer.dispose()
            scene.traverse((object) => {
                if (!object.isMesh) return
                object.geometry?.dispose()
                if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
                else object.material?.dispose()
            })
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="about-keychain pointer-events-none absolute z-60"
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="block h-full w-full bg-transparent" />
        </div>
    )
}
