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
                <AboutSection navigate={navigate} />
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
