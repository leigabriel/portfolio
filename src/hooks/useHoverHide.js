import { useEffect, useState } from 'react'

export default function useHoverHide(threshold = 8) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        let lastY = window.scrollY
        let acc = 0

        const onScroll = () => {
            const y = window.scrollY
            acc += y - lastY
            lastY = y

            if (y <= 0) {
                setVisible(true)
                acc = 0
                return
            }

            if (acc > threshold) {
                setVisible(false)
                acc = 0
            } else if (acc < -threshold) {
                setVisible(true)
                acc = 0
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [threshold])

    return visible
}
