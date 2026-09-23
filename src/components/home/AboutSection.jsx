export default function AboutSection({ navigate }) {
    return (
        <section className="relative z-10 min-h-svh bg-white text-black">
            <div className="flex min-h-svh flex-col px-5 py-7 sm:px-10 sm:py-10 md:px-16 md:py-14">

                <div className="flex flex-1 items-center py-16 sm:py-20 md:py-28">
                    <h2 className="max-w-[14ch] font-body text-[clamp(3.1rem,8.4vw,9rem)] font-normal leading-[0.82] tracking-[-0.045em]">
                        I'm Lei Gabriel Malibiran,
                        <span className="block pl-[8vw] text-black/45">a web developer</span>
                        <span className="block">and graphic designer.</span>
                    </h2>
                </div>

                <div className="grid gap-8 border-t-2 border-dotted border-black/30 pt-6 md:grid-cols-[0.7fr_1.3fr] md:gap-16 md:pt-8">
                    <div className="flex items-start justify-between gap-6 md:flex-col">
                        <button
                            type="button"
                            onClick={() => navigate('about')}
                            className="border-b border-black/60 pb-1 text-[9px] uppercase tracking-[0.18em] transition-opacity hover:opacity-50 sm:text-xs"
                        >
                            More about me -&gt;
                        </button>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
                        <p className="text-[10px] uppercase leading-[1.65] tracking-[0.08em] text-black/70 sm:text-xs">
                            I'm a web developer and graphic designer from Oriental Mindoro, Philippines.
                        </p>
                        <p className="text-[10px] uppercase leading-[1.65] tracking-[0.08em] text-black/70 sm:text-xs">
                            I create visually clear, user-focused digital experiences with close attention to detail, structure, and usability.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
