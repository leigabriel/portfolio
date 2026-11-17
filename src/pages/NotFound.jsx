import { useCallback, useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import WorksKeychain from '../components/works/WorksKeychain'
import { assetUrl } from '../lib/assets'

export default function NotFound({ navigate, setIsMenuOpen }) {
    const [workchainReady, setWorkchainReady] = useState(false)
    const handleWorkchainLoad = useCallback(() => setWorkchainReady(true), [])

    useEffect(() => {
        const previous = document.title
        document.title = '404 Not Found | Lei Gabriel'
        return () => {
            document.title = previous
        }
    }, [])

    return (
        <main className="relative flex min-h-dvh flex-col bg-white text-black overflow-hidden">
            <style>{`
                .notfound-code {
                    font-size: clamp(6.5rem, 30vw, 24rem);
                    line-height: 0.8;
                    letter-spacing: -0.04em;
                }

                .notfound-zero {
                    width: 0.78em;
                    height: 1.05em;
                }
            `}</style>

            <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" />

            <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(2rem,5vh,3.5rem)] px-5 sm:px-8">
                <h1 className="sr-only">404 &mdash; Page not found</h1>

                <div
                    aria-hidden="true"
                    className="notfound-code font-mono-custom flex items-center justify-center"
                >
                    <span>4</span>
                    <span className="notfound-zero relative inline-block shrink-0">
                        <span
                            className={`absolute inset-0 flex items-center justify-center leading-none transition-opacity duration-300 ${
                                workchainReady ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            0
                        </span>
                        <WorksKeychain
                            src={assetUrl('models/workchain.glb')}
                            onLoad={handleWorkchainLoad}
                            zoom={1.38}
                            className="inset-0 h-full w-full"
                        />
                    </span>
                    <span>4</span>
                </div>

                <p className="max-w-[36ch] text-balance text-center font-mono-custom text-[11px] leading-relaxed tracking-[0.12em] text-black/55 sm:text-xs">
                    This page doesn&rsquo;t exist. Let&rsquo;s take you somewhere that does.
                </p>
            </div>
        </main>
    )
}
