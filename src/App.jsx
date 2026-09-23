import { useEffect, useState, useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import Home from './pages/Home'
import About from './pages/About'
import Works from './pages/Works'
import Shop from './pages/Shop'
import Archive from './pages/Archive'
import PosterDetail from './components/details/PosterDetail'
import WebDetail from './components/details/WebDetail'
import MotionDetail from './components/details/MotionDetail'
import Menu from './components/layout/Menu'

export default function App() {
    const [page, setPage] = useState('home')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const contactRef = useRef(null)

    useEffect(() => {
        const protectImage = (event) => {
            if (event.target instanceof HTMLImageElement) event.preventDefault()
        }

        document.addEventListener('contextmenu', protectImage)
        document.addEventListener('dragstart', protectImage)
        return () => {
            document.removeEventListener('contextmenu', protectImage)
            document.removeEventListener('dragstart', protectImage)
        }
    }, [])

    const navigate = (dest, data) => {
        setIsMenuOpen(false)
        if (['home', 'about', 'projects', 'shop', 'archive'].includes(dest)) {
            setPage(dest)
            setSelectedProject(null)
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
        } else if (dest === 'poster-detail' && data) {
            setSelectedProject(data)
            setPage('poster-detail')
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
        } else if (dest === 'web-detail' && data) {
            setSelectedProject(data)
            setPage('web-detail')
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
        } else if (dest === 'motion-detail' && data) {
            setSelectedProject(data)
            setPage('motion-detail')
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
        } else if (dest === 'contact') {
            setPage('home')
            setTimeout(() => {
                contactRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }
    }

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.08,
                smoothWheel: true,
                smoothTouch: false,
            }}
        >
            {page === 'home' && <Home setIsMenuOpen={setIsMenuOpen} contactRef={contactRef} navigate={navigate} />}
            {page === 'about' && <About setIsMenuOpen={setIsMenuOpen} navigate={navigate} />}
            {page === 'projects' && <Works setIsMenuOpen={setIsMenuOpen} navigate={navigate} />}
            {page === 'shop' && <Shop setIsMenuOpen={setIsMenuOpen} navigate={navigate} />}
            {page === 'archive' && <Archive setIsMenuOpen={setIsMenuOpen} navigate={navigate} />}
            {page === 'poster-detail' && selectedProject && <PosterDetail setIsMenuOpen={setIsMenuOpen} navigate={navigate} poster={selectedProject} />}
            {page === 'web-detail' && selectedProject && <WebDetail setIsMenuOpen={setIsMenuOpen} navigate={navigate} project={selectedProject} />}
            {page === 'motion-detail' && selectedProject && <MotionDetail setIsMenuOpen={setIsMenuOpen} navigate={navigate} project={selectedProject} />}
            {isMenuOpen && <Menu setIsMenuOpen={setIsMenuOpen} navigate={navigate} />}
        </ReactLenis>
    )
}
