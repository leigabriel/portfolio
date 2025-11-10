export default function AboutHero() {
  return (
    <section className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            About me
          </h1>
          
            <div className="text-sm sm:text-base text-gray-400 leading-relaxed space-y-4">
              <p>
                I’m a graphic designer, UI designer, and frontend developer who combines creativity and technology to create clean, modern, and functional digital experiences.
              </p>

              <p>
                I focus on crafting user-centered designs that are both visually appealing and easy to navigate. My goal is to build digital products that not only look good but also deliver a smooth and meaningful experience for users.
              </p>

              <p>
                I continue to learn and improve my skills in web development and design tools, aiming to bridge the gap between visual creativity and technical implementation.
              </p>
            </div>
        </div>
        
        <div className="flex justify-center lg:justify-end order-first lg:order-last">
          <div className="w-full max-w-md">
            <img 
              src="https://avatars.githubusercontent.com/u/223958636?v=4" 
              alt="Profile"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
