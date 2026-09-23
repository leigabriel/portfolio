export default function Video() {
    return (
        <section className="relative z-5 bg-black w-full flex items-center justify-center overflow-hidden">
            <div className="w-full aspect-video max-h-dvh">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/videos/flash.mp4" type="video/mp4" />
                </video>
            </div>
        </section>
    )
}
