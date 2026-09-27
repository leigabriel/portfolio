import { useCallback, useEffect, useState, useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import Home from './pages/Home'
import About from './pages/About'
import Works from './pages/Works'
import Shop from './pages/Shop'
import Archive from './pages/Archive'
import NotFound from './pages/NotFound'
import PosterDetail from './components/details/PosterDetail'
import WebDetail from './components/details/WebDetail'
import MotionDetail from './components/details/MotionDetail'
import Menu from './components/layout/Menu'
import { posterProjects, webProjects, motionProjects } from './data'

const PAGE_DESTINATIONS = ['home', 'about', 'projects', 'shop', 'archive']
const DETAIL_DESTINATIONS = ['poster-detail', 'web-detail', 'motion-detail']
const COLLECTIONS = { web: webProjects, poster: posterProjects, motion: motionProjects }
const DETAIL_TAB = { web: 0, poster: 1, motion: 2 }
const KNOWN_PATH_RE = /^\/(?:index\.html)?$/i
const MEDIA_SELECTOR = 'img, video, audio, canvas, picture, source'

function safeDecode(value) {
    try {
        return decodeURIComponent(value)
    } catch {
        return value
    }
}

function hasUnknownPath() {
    return !KNOWN_PATH_RE.test(window.location.pathname)
}

function parseRoute() {
    if (hasUnknownPath()) return { page: 'notfound', project: null }

    const [section, type, id] = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
    if (!section) return { page: 'home', project: null }
    if (section === 'about') return { page: 'about', project: null }
    if (section === 'shop') return { page: 'shop', project: null }
    if (section === 'archive') return { page: 'archive', project: null }
    if (section === 'contact') return { page: 'home', project: null, contact: true }
    if (section === '404') return { page: 'notfound', project: null }
    if (section === 'works') {
        if (!type) return { page: 'projects', project: null }
        const collection = Object.prototype.hasOwnProperty.call(COLLECTIONS, type) ? COLLECTIONS[type] : null
        const found = collection && id ? collection.find((item) => String(item.id) === safeDecode(id)) : null
        if (found) return { page: `${type}-detail`, project: { ...found, type } }
        return { page: 'notfound', project: null }
    }
    return { page: 'notfound', project: null }
}

function hashForRoute(route) {
    if (route.page === 'notfound') return '#/404'
    if (route.contact) return '#/contact'
    if (DETAIL_DESTINATIONS.includes(route.page) && route.project) {
        return `#/works/${route.project.type}/${encodeURIComponent(route.project.id)}`
    }
    if (route.page === 'about') return '#/about'
    if (route.page === 'projects') return '#/works'
    if (route.page === 'shop') return '#/shop'
    if (route.page === 'archive') return '#/archive'
    return '#/'
}

export default function App() {
    const [route, setRoute] = useState(parseRoute)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [worksTab, setWorksTab] = useState(() => DETAIL_TAB[route.project?.type] ?? null)
    const contactRef = useRef(null)
    const routeRef = useRef(route)
    const worksTabRef = useRef(worksTab)

    const settleRoute = useCallback((next) => {
        const fromDetail = routeRef.current.page.endsWith('-detail')
        const stayingOnWorks = routeRef.current.page === 'projects'
        const requestedTab = next.page === 'projects' && Number.isInteger(next.tab) ? next.tab : null

        if (requestedTab !== null) setWorksTab(requestedTab)
        else if (next.page === 'projects' && !fromDetail && !stayingOnWorks) setWorksTab(null)
        else if (DETAIL_DESTINATIONS.includes(next.page) && next.project) setWorksTab(DETAIL_TAB[next.project.type] ?? null)

        routeRef.current = next
        setRoute(next)

        if (next.contact) {
            setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 120)
            return
        }
        const revealTab = next.page === 'projects' && fromDetail && worksTabRef.current !== null
        if (!revealTab) setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    }, [])

    const navigate = useCallback((dest, data) => {
        setIsMenuOpen(false)
        let next = null
        if (PAGE_DESTINATIONS.includes(dest)) {
            next = { page: dest, project: null }
            if (dest === 'projects' && Number.isInteger(data?.tab)) next.tab = data.tab
        } else if (DETAIL_DESTINATIONS.includes(dest) && data) next = { page: dest, project: data }
        else if (dest === 'contact') next = { page: 'home', project: null, contact: true }
        if (!next) return

        const hash = hashForRoute(next)
        const target = routeRef.current.page === 'notfound' ? `/${hash}` : hash
        if (window.location.pathname + window.location.hash !== target) window.history.pushState(next, '', target)
        settleRoute(next)
    }, [settleRoute])

    useEffect(() => {
        worksTabRef.current = worksTab
    }, [worksTab])

    useEffect(() => {
        const protectMedia = (event) => {
            if (event.target instanceof Element && event.target.closest(MEDIA_SELECTOR)) event.preventDefault()
        }

        const blockSave = (event) => {
            if (!(event.ctrlKey || event.metaKey)) return
            if (event.key.toLowerCase() === 's') event.preventDefault()
        }

        document.addEventListener('contextmenu', protectMedia)
        document.addEventListener('dragstart', protectMedia)
        document.addEventListener('keydown', blockSave)
        return () => {
            document.removeEventListener('contextmenu', protectMedia)
            document.removeEventListener('dragstart', protectMedia)
            document.removeEventListener('keydown', blockSave)
        }
    }, [])

    useEffect(() => {
        const initial = routeRef.current
        window.history.replaceState(initial, '', hashForRoute(initial))
        if (initial.contact) setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 250)
    }, [])

    useEffect(() => {
        const handleHistory = () => {
            setIsMenuOpen(false)
            settleRoute(parseRoute())
        }
        window.addEventListener('popstate', handleHistory)
        return () => window.removeEventListener('popstate', handleHistory)
    }, [settleRoute])

    const { page, project: selectedProject } = route

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
            {page === 'projects' && (
                <Works setIsMenuOpen={setIsMenuOpen} navigate={navigate} activeTab={worksTab} setActiveTab={setWorksTab} />
            )}
            {page === 'shop' && <Shop setIsMenuOpen={setIsMenuOpen} navigate={navigate} />}
            {page === 'archive' && <Archive setIsMenuOpen={setIsMenuOpen} navigate={navigate} />}
            {page === 'poster-detail' && selectedProject && <PosterDetail setIsMenuOpen={setIsMenuOpen} navigate={navigate} poster={selectedProject} />}
            {page === 'web-detail' && selectedProject && <WebDetail setIsMenuOpen={setIsMenuOpen} navigate={navigate} project={selectedProject} />}
            {page === 'motion-detail' && selectedProject && <MotionDetail setIsMenuOpen={setIsMenuOpen} navigate={navigate} project={selectedProject} />}
            {page === 'notfound' && <NotFound navigate={navigate} />}
            {isMenuOpen && <Menu setIsMenuOpen={setIsMenuOpen} navigate={navigate} />}
        </ReactLenis>
    )
}
