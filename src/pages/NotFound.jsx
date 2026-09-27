import { useEffect } from 'react'

export default function NotFound({ navigate }) {
    useEffect(() => {
        const previous = document.title
        document.title = '404 Not Found | Lei Gabriel'
        return () => {
            document.title = previous
        }
    }, [])

    return (
        <main className="bg-[#ffea00] min-h-dvh text-black flex flex-col overflow-x-hidden">
            <style>{`
                .notfound-code {
                    font-size: clamp(3.5rem, 24vw, 22rem);
                    line-height: 0.85;
                    letter-spacing: -0.04em;
                }

                .notfound-word {
                    font-size: clamp(0.8rem, 3.6vw, 2.2rem);
                    letter-spacing: 0.35em;
                    line-height: 1;
                }
            `}</style>

            <div className="flex flex-1 flex-col justify-between px-5 sm:px-8 md:px-12 lg:px-16 py-5 sm:py-8 md:py-12">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('home')}
                        className="text-xs sm:text-sm tracking-widest uppercase text-black/45 hover:text-black transition-colors duration-300 cursor-pointer"
                    >
                        Lei Gabriel
                    </button>
                    <span className="font-mono-custom text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-black/25">
                        Error 404
                    </span>
                </div>

                <div className="py-10 sm:py-14">
                    <h1 className="notfound-code font-mono-custom font-normal">404</h1>
                    <p className="notfound-word font-mono-custom uppercase mt-4 sm:mt-6">Not Found</p>

                    <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('home')}
                            className="font-mono-custom text-[10px] sm:text-xs tracking-[0.2em] uppercase px-5 py-3 bg-black text-white hover:bg-black/80 transition-colors duration-300 cursor-pointer"
                        >
                            Back to home
                        </button>
                        <span className="font-mono-custom text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-black/35">
                            The page you are looking for does not exist.
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-dotted border-black/20 pt-4 font-mono-custom text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-black/30">
                    <span>leigabriel.vercel.app</span>
                    <span>404</span>
                </div>
            </div>
        </main>
    )
}