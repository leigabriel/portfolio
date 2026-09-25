import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import AboutSection from '../components/home/AboutSection'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

export default function Home({ setIsMenuOpen, contactRef, navigate }) {
    return (
        <main className="relative bg-black min-h-screen">
            <div className="fixed top-0 left-0 z-50 w-full p-4 sm:p-6 md:p-10 pointer-events-none">
                <Header setIsMenuOpen={setIsMenuOpen} navigate={navigate} variant="dark" className="w-full" />
            </div>
            <div className="relative z-1">
                <Hero />
                <AboutSection
                    src="/images/1001.png"
                    alt="leimxnsquare print to crumple"
                    width={2880}
                    height={2160}
                    sceneHeight={560}
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
                    className="min-h-screen bg-[#212121]"
                    style={{ height: 'auto', minHeight: '100vh' }}
                />
                <Features />
            </div>
            <div ref={contactRef} className="relative z-0 h-dvh min-h-125">
                <div className="fixed inset-x-0 bottom-0 z-0 h-dvh min-h-125">
                    <Footer />
                </div>
            </div>
        </main>
    )
}
