import { lazy, Suspense } from 'react'
import Hero from '../components/home/Hero'
import Featured from '../components/home/Featured'
import Header from '../components/layout/Header'

// Both pull in three.js, so they load as a separate chunk after first paint.
const AboutSection = lazy(() => import('../components/home/AboutSection'))
const Footer = lazy(() => import('../components/layout/Footer'))

const PAPER_CLASS = 'aspect-4/3 bg-[#212121] sm:aspect-auto sm:min-h-screen'

export default function Home({ setIsMenuOpen, contactRef, navigate }) {
    return (
        <main className="home-cursor relative bg-black min-h-screen">
            <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" className="w-full" />
            <div className="relative z-1">
                <Hero />
                <Suspense fallback={<div className={`w-full ${PAPER_CLASS}`} />}>
                <AboutSection
                    src="/images/1001.webp"
                    alt="leimxnsquare print to crumple"
                    width={2880}
                    height={2160}
                    sceneHeight="auto"
                    maxDisplayWidth={920}
                    releaseBehavior="restore"
                    crumpleAmount={0.85}
                    crumpleDuration={0.55}
                    releaseDuration={0.4}
                    foldCount={6}
                    foldSharpness={0.6}
                    wrinkleDepth={0.65}
                    creaseStrength={0.18}
                    paperColor="#f4f0e8"
                    paperTexture={0.08}
                    draggable
                    returnToOrigin
                    className={PAPER_CLASS}
                />
                </Suspense>
                <Featured navigate={navigate} />
            </div>
            <div ref={contactRef} className="relative z-0 h-dvh min-h-125">
                <div className="fixed inset-x-0 bottom-0 z-0 h-dvh min-h-125">
                    <Suspense fallback={<div className="h-dvh min-h-125 w-full bg-[#ffea00]" />}>
                        <Footer navigate={navigate} watchRef={contactRef} />
                    </Suspense>
                </div>
            </div>
        </main>
    )
}
