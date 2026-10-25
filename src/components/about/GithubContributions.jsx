import { useEffect, useMemo, useRef, useState } from 'react'

const USER = 'leigabriel'
const API = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`
const CACHE_KEY = 'gh-contributions-v1'
const CACHE_MS = 6 * 60 * 60 * 1000

// Chunky 6px cells with a 1px gap, drawn once at this tiny size and scaled up
// with nearest-neighbour filtering so every square keeps hard pixel edges.
const CELL = 6
const GAP = 1
const STEP = CELL + GAP
const ROWS = 7

const LEVEL_COLORS = ['#333333', '#6b6b12', '#a6a600', '#dcdc00', '#ffff00']

function readCache() {
    try {
        const raw = window.localStorage.getItem(CACHE_KEY)
        if (!raw) return null
        const { t, days } = JSON.parse(raw)
        return Date.now() - t < CACHE_MS && Array.isArray(days) ? days : null
    } catch {
        return null
    }
}

function writeCache(days) {
    try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), days }))
    } catch {
        // Storage can be unavailable; the graph simply refetches next time.
    }
}

// Lay the days out as Sunday-first weeks, like GitHub's own graph.
function buildWeeks(days) {
    if (!days.length) return []
    const weeks = []
    let week = new Array(new Date(`${days[0].date}T00:00:00Z`).getUTCDay()).fill(null)
    days.forEach((day) => {
        week.push(day)
        if (week.length === ROWS) {
            weeks.push(week)
            week = []
        }
    })
    if (week.length) weeks.push(week.concat(new Array(ROWS - week.length).fill(null)))
    return weeks
}

function computeStats(days) {
    let total = 0
    let best = 0
    let longest = 0
    let run = 0
    days.forEach(({ count }) => {
        total += count
        best = Math.max(best, count)
        run = count > 0 ? run + 1 : 0
        longest = Math.max(longest, run)
    })
    // Today may simply not have a commit yet, so a streak can start yesterday.
    let current = 0
    let i = days.length - 1
    if (i >= 0 && days[i].count === 0) i -= 1
    for (; i >= 0 && days[i].count > 0; i -= 1) current += 1
    return { total, best, longest, current }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDay(date) {
    const [y, m, d] = date.split('-').map(Number)
    return `${MONTHS[m - 1]} ${d}, ${y}`
}

export default function GithubContributions({ active }) {
    const [days, setDays] = useState(() => readCache() || [])
    const [status, setStatus] = useState(() => (readCache() ? 'ready' : 'loading'))
    const [hover, setHover] = useState(null)
    const [revealed, setRevealed] = useState(0)
    const canvasRef = useRef(null)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (status === 'ready') return undefined
        const controller = new AbortController()
        fetch(API, { signal: controller.signal })
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error('bad response'))))
            .then((json) => {
                const list = (json.contributions || [])
                    .filter((d) => d.date <= new Date().toISOString().slice(0, 10))
                    .map(({ date, count, level }) => ({ date, count, level: Math.min(4, Math.max(0, level)) }))
                if (!list.length) throw new Error('empty')
                writeCache(list)
                setDays(list)
                setStatus('ready')
            })
            .catch((error) => {
                if (error.name !== 'AbortError') setStatus('error')
            })
        return () => controller.abort()
    }, [status])

    const weeks = useMemo(() => buildWeeks(days), [days])
    const stats = useMemo(() => computeStats(days), [days])
    const columns = weeks.length || 53

    // On narrow screens the graph scrolls sideways; start at the newest weeks.
    useEffect(() => {
        const el = scrollRef.current
        if (!active || !el) return
        const frame = requestAnimationFrame(() => { el.scrollLeft = el.scrollWidth })
        return () => cancelAnimationFrame(frame)
    }, [active, weeks])

    // Cells appear a column at a time, in steps, each time the card is opened.
    useEffect(() => {
        if (!active || !weeks.length) return undefined
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let frame
        const start = performance.now()
        const run = (now) => {
            const next = still ? weeks.length : Math.min(weeks.length, Math.floor((now - start) / 16))
            setRevealed(next)
            if (next < weeks.length) frame = requestAnimationFrame(run)
        }
        frame = requestAnimationFrame(run)
        return () => cancelAnimationFrame(frame)
    }, [active, weeks])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let c = 0; c < columns; c += 1) {
            for (let r = 0; r < ROWS; r += 1) {
                const day = weeks[c]?.[r]
                if (weeks.length && !day) continue
                const shown = c < revealed || !weeks.length
                ctx.fillStyle = shown ? LEVEL_COLORS[day ? day.level : 0] : LEVEL_COLORS[0]
                ctx.fillRect(c * STEP, r * STEP, CELL, CELL)
            }
        }
        if (hover) {
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 1
            ctx.strokeRect(hover.col * STEP - 0.5, hover.row * STEP - 0.5, CELL + 1, CELL + 1)
        }
    }, [weeks, revealed, hover, columns])

    const locate = (event) => {
        const rect = canvasRef.current.getBoundingClientRect()
        const col = Math.floor(((event.clientX - rect.left) / rect.width) * columns)
        const row = Math.floor(((event.clientY - rect.top) / rect.height) * ROWS)
        const day = weeks[col]?.[row]
        setHover(day ? { col, row, day } : null)
    }

    const monthLabels = []
    weeks.forEach((week, index) => {
        const first = week.find(Boolean)
        if (first && Number(first.date.slice(8)) <= 7 && index > 0) {
            monthLabels.push({ index, label: MONTHS[Number(first.date.slice(5, 7)) - 1] })
        }
    })

    const readout =
        status === 'loading' ? 'Loading contributions…'
            : status === 'error' ? 'Live data unavailable right now'
                : hover ? `${formatDay(hover.day.date)} · ${hover.day.count} contribution${hover.day.count === 1 ? '' : 's'}`
                    : 'Hover a square for the day'

    const statItems = [
        ['Last 12 months', stats.total],
        ['Current streak', `${stats.current}d`],
        ['Longest streak', `${stats.longest}d`],
        ['Best day', stats.best],
    ]

    return (
        <div className="gh">
            <div className="gh-stats">
                {statItems.map(([label, value]) => (
                    <div key={label} className="gh-stat">
                        <span className="gh-num">{status === 'ready' ? value : '--'}</span>
                        <span className="gh-cap">{label}</span>
                    </div>
                ))}
            </div>

            <div ref={scrollRef} className="gh-scroll" tabIndex={0} role="group" aria-label="Contribution graph, scrolls sideways on small screens">
                <div className="gh-chart">
                    <div className="gh-months" aria-hidden="true">
                        {monthLabels.map(({ index, label }) => (
                            <span key={index} style={{ left: `${(index / columns) * 100}%` }}>{label}</span>
                        ))}
                    </div>
                    <canvas
                        ref={canvasRef}
                        className="gh-canvas"
                        width={columns * STEP - GAP}
                        height={ROWS * STEP - GAP}
                        role="img"
                        aria-label={`GitHub contributions for ${USER}: ${stats.total} in the last year`}
                        onPointerMove={locate}
                        onPointerLeave={() => setHover(null)}
                    />
                </div>
            </div>

            <div className="gh-meta">
                <span className="gh-readout" aria-live="polite">{readout}</span>
                <span className="gh-legend" aria-hidden="true">
                    Less
                    {LEVEL_COLORS.map((color) => <i key={color} style={{ background: color }} />)}
                    More
                </span>
            </div>

            <a className="prow gh-link" href={`https://github.com/${USER}`} target="_blank" rel="noopener noreferrer">
                <span className="prow-label">github</span>
                <span className="prow-value">github.com/{USER} →</span>
            </a>
        </div>
    )
}
