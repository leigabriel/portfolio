import { useEffect, useState } from 'react'

// True once the page has scrolled away from the very top.
export default function useScrolled(threshold = 8) {
    const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > threshold)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > threshold)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [threshold])

    return scrolled
}
