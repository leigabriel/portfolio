import { useEffect, useState } from 'react'

const featuredApps = [
    {
        number: '01',
        title: 'Bulusan Zootopia Adventure Game',
        label: 'Interactive web game',
        href: 'https://adventuregame.bulusanzoo.com',
        domain: 'adventuregame.bulusanzoo.com',
        icon: '/images/web_projects/bulusanzoo.png',
    },
    {
        number: '02',
        title: 'Bulusan Zootopia',
        label: 'Digital zoo experience',
        href: 'https://bulusanzootopia.vercel.app',
        domain: 'bulusanzootopia.vercel.app',
        icon: '/images/web_projects/bulusanzoo.png',
    },
    {
        number: '03',
        title: 'MateGrid64',
        label: 'Responsive web application',
        href: 'https://mategrid64.vercel.app',
        domain: 'mategrid64.vercel.app',
        icon: '/images/web_projects/mategrid64.png',
    },
]

const fallbackContributionLevels = Array.from({ length: 53 * 7 }, (_, index) => {
    const column = Math.floor(index / 7)
    const row = index % 7
    const isActiveCluster = column < 6
        || (column > 8 && column < 14)
        || (column > 16 && column < 34)
        || column > 38
    const signal = (column * 17 + row * 11) % 9

    return isActiveCluster && signal > 1 ? 1 + (signal % 4) : 0
})

function toCalendarGrid(contributions) {
    if (!contributions.length) return fallbackContributionLevels

    const firstDay = new Date(`${contributions[0].date}T00:00:00`).getDay()
    const levels = [
        ...Array(firstDay).fill(0),
        ...contributions.map(({ level }) => level),
    ]

    return [...levels, ...Array(53 * 7).fill(0)].slice(0, 53 * 7)
}

export default function Features() {
    const [contributionLevels, setContributionLevels] = useState(fallbackContributionLevels)
    const [contributionTotal, setContributionTotal] = useState(52)

    useEffect(() => {
        const controller = new AbortController()

        fetch('https://github-contributions-api.jogruber.de/v4/leigabriel?y=last', {
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) throw new Error('GitHub contributions request failed')
                return response.json()
            })
            .then((data) => {
                setContributionLevels(toCalendarGrid(data.contributions ?? []))
                setContributionTotal(data.total?.lastYear ?? 0)
            })
            .catch(() => { })

        return () => controller.abort()
    }, [])

    return (
        <section className="relative z-10 bg-[#ebebeb] text-black" aria-labelledby="features-title">
            <div className="px-5 py-16 sm:px-10 sm:py-20 md:px-16 md:py-28">
                <div className="mx-auto max-w-8xl">
                    <div className="flex items-end justify-between gap-6 border-b-2 border-dotted border-black/30 pb-5 sm:pb-7">
                        <h2
                            id="features-title"
                            className="font-title text-[clamp(3.25rem,9vw,8.5rem)] font-normal leading-[0.78] tracking-[-0.045em]"
                        >
                            Featured Projects
                        </h2>
                        <span className="pb-1 text-[9px] uppercase tracking-[0.2em] text-black/45 sm:text-xs">
                            01 / 03
                        </span>
                    </div>

                    <div className="grid md:grid-cols-3">
                        {featuredApps.map((app) => (
                            <a
                                key={app.number}
                                href={app.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative flex min-h-72 flex-col justify-between overflow-hidden border-b-2 border-dotted border-black/30 py-7 text-black md:min-h-96 md:border-r md:border-r-black/25 md:px-7 md:py-9 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                            >
                                <span className="absolute inset-x-0 bottom-0 h-0 bg-[#ffea00] transition-[height] duration-500 ease-out group-hover:h-full group-focus-visible:h-full" aria-hidden="true" />

                                <div className="relative flex items-start justify-between gap-4">
                                    <span className="text-[10px] tracking-[0.18em] text-black/45 sm:text-xs">
                                        {app.number}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/75 p-1.5 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 group-focus-visible:-rotate-6 group-focus-visible:scale-110">
                                            <img src={app.icon} alt="" className="h-full w-full object-contain" />
                                        </span>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/30 text-lg transition-transform duration-500 group-hover:rotate-45 group-focus-visible:rotate-45" aria-hidden="true">
                                            ↗
                                        </span>
                                    </div>
                                </div>

                                <div className="relative mt-20 transition-transform duration-500 group-hover:-translate-y-2 group-focus-visible:-translate-y-2">
                                    <span className="text-[9px] uppercase tracking-[0.18em] text-black/50 sm:text-[10px]">
                                        {app.label}
                                    </span>
                                    <h3 className="mt-3 max-w-[12ch] font-title text-[clamp(2rem,3.2vw,3.75rem)] font-normal leading-[0.86] tracking-tight">
                                        {app.title}
                                    </h3>
                                    <p className="mt-6 truncate text-[9px] uppercase tracking-[0.08em] text-black/50 sm:text-[10px]">
                                        {app.domain}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>

                    <a
                        href="https://github.com/leigabriel"
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-16 block border-y-2 border-dotted border-black/30 py-7 sm:mt-24 sm:py-10"
                        aria-label="View Lei Gabriel on GitHub"
                    >
                        <div className="mb-7 flex items-baseline justify-between gap-6">
                            <h3 className="font-title text-[clamp(2rem,4vw,4rem)] font-normal leading-none tracking-tight">
                                GitHub contribution
                            </h3>
                            <span className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-black/45 transition-colors group-hover:text-black sm:text-[11px]">
                                @leigabriel ↗
                            </span>
                        </div>

                        <svg
                            viewBox="0 0 689 91"
                            className="h-auto w-full text-black"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                            aria-label={`GitHub contribution graph showing ${contributionTotal} contributions in the last year`}
                        >
                            {contributionLevels.map((level, index) => {
                                const column = Math.floor(index / 7)
                                const row = index % 7
                                const radii = [1.1, 2.7, 3.8, 4.8, 5.7]

                                return (
                                    <circle
                                        key={index}
                                        cx={6.5 + column * 13}
                                        cy={6.5 + row * 13}
                                        r={radii[level] ?? radii[0]}
                                        fill="currentColor"
                                        opacity={level === 0 ? 0.12 : 0.92}
                                        className="transition-opacity duration-300 group-hover:opacity-100"
                                    />
                                )
                            })}
                        </svg>

                        <p className="mt-5 text-[9px] uppercase tracking-[0.16em] text-black/45 sm:text-[11px]">
                            {contributionTotal.toLocaleString()} contributions in the last year
                        </p>
                    </a>
                </div>
            </div>
        </section>
    )
}