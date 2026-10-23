import { Component } from 'react'

// Last line of defence: an uncaught render or effect error would otherwise
// unmount the whole tree and leave a blank page.
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { failed: false }
    }

    static getDerivedStateFromError() {
        return { failed: true }
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info?.componentStack)
    }

    render() {
        if (!this.state.failed) return this.props.children
        if (this.props.fallback !== undefined) return this.props.fallback

        return (
            <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#ffea00] px-6 text-center text-black">
                <h1 className="font-title text-4xl sm:text-6xl">Something went wrong</h1>
                <p className="text-xs uppercase tracking-widest text-black/70">
                    The page could not be displayed.
                </p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="bg-black px-5 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80"
                >
                    Reload
                </button>
            </main>
        )
    }
}
