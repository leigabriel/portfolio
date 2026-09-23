import { useCallback, useEffect, useRef, useState } from 'react'
import { homeImages } from '../../data/home-img'

const PANEL_WIDTH_COLLAPSED = 20
const PANEL_WIDTH_COLLAPSED_MOBILE = 12
const PANEL_WIDTH_EXPANDED = 320
const PANEL_WIDTH_EXPANDED_MOBILE = 208
const PANEL_GAP = 5
const PANEL_GAP_MOBILE = 3
const BREAKPOINT_MOBILE = 1000

const posters = homeImages
const defaultOpenIndex = Math.max(
    0,
    posters.findIndex((poster) => poster.isOpen)
)

export default function Hero() {
    const trackRef = useRef(null)
    const [trackWidth, setTrackWidth] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [focusedPanel, setFocusedPanel] = useState(defaultOpenIndex)

    const panelCount = isMobile ? Math.min(10, posters.length) : posters.length
    const collapsedWidth = isMobile
        ? PANEL_WIDTH_COLLAPSED_MOBILE
        : PANEL_WIDTH_COLLAPSED
    const panelGap = isMobile ? PANEL_GAP_MOBILE : PANEL_GAP
    const availableExpandedWidth = trackWidth - (panelCount - 1) * (collapsedWidth + panelGap)
    const expandedWidth = isMobile && trackWidth
        ? Math.max(110, Math.min(PANEL_WIDTH_EXPANDED_MOBILE, availableExpandedWidth))
        : PANEL_WIDTH_EXPANDED
    const activePanel = Math.min(focusedPanel, panelCount - 1)

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            setTrackWidth(entry.contentRect.width)
            setIsMobile(window.innerWidth < BREAKPOINT_MOBILE)
        })

        if (trackRef.current) observer.observe(trackRef.current)
        return () => observer.disconnect()
    }, [])

    const getPanelPosition = useCallback((panelIndex) => {
        if (activePanel < 0) {
            const totalTrackWidth =
                panelCount * collapsedWidth + (panelCount - 1) * panelGap
            const offsetToCenter = (trackWidth - totalTrackWidth) / 2
            return {
                left: offsetToCenter + panelIndex * (collapsedWidth + panelGap),
                width: collapsedWidth,
            }
        }

        const centerLeft = (trackWidth - expandedWidth) / 2

        if (panelIndex === activePanel) {
            return { left: centerLeft, width: expandedWidth }
        }

        if (panelIndex < activePanel) {
            return {
                left: centerLeft - (activePanel - panelIndex) * (collapsedWidth + panelGap),
                width: collapsedWidth,
            }
        }

        return {
            left:
                centerLeft +
                expandedWidth +
                (panelIndex - activePanel) * (collapsedWidth + panelGap) -
                collapsedWidth,
            width: collapsedWidth,
        }
    }, [activePanel, collapsedWidth, expandedWidth, panelCount, panelGap, trackWidth])

    return (
        <section className="spotlight-hero">
            <style>{`
                .spotlight-hero {
                    position: sticky;
                    top: 0;
                    z-index: 0;
                    width: 100%;
                    height: 100dvh;
                    min-height: 500px;
                    overflow: hidden;
                    background: #fff;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes cursorBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }

                .spotlight-copy {
                    opacity: 0;
                    animation: fadeUp 0.55s ease-out forwards;
                }

                .spotlight-copy { animation-delay: 0.45s; }

                .spotlight-cursor {
                    display: inline-block;
                    width: 6px;
                    height: 12px;
                    margin-left: 2px;
                    background: #000;
                    animation: cursorBlink 1s step-end infinite;
                    vertical-align: middle;
                }

                .spotlight-track {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 90%;
                    max-width: 1400px;
                    transform: translate(-50%, -50%);
                }

                .spotlight-title {
                    font-family: 'Tritopani', serif;
                    font-size: clamp(4rem, 4vw, 20rem);
                    line-height: 1;
                    color: #000;
                    white-space: nowrap;
                    pointer-events: none;
                    user-select: none;
                    text-transform: none;
                    letter-spacing: normal;
                }

                .spotlight-panels {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    height: 400px;
                }

                .spotlight-panel {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    overflow: hidden;
                    background: #fff;
                    border: 1px solid rgba(0, 0, 0, 0.45);
                    cursor: url('/cursors/link.svg') 12 0, pointer;
                    transition: left 1s cubic-bezier(0.075, 0.82, 0.165, 1),
                                width 1s cubic-bezier(0.075, 0.82, 0.165, 1),
                                filter 0.5s ease;
                    will-change: left, width;
                    filter: saturate(0.8);
                }

                .spotlight-panel:hover,
                .spotlight-panel.is-focused {
                    filter: saturate(1);
                }

                .spotlight-panel img {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    user-select: none;
                }

                @media (max-width: 1000px) {
                    .spotlight-track {
                        width: calc(100% - 2rem);
                    }

                    .spotlight-panels {
                        height: 260px;
                    }
                }

                @media (max-width: 480px) {
                    .spotlight-panels {
                        height: min(68vw, 240px);
                    }
                }
            `}</style>

            <div className="spotlight-track" ref={trackRef} onMouseLeave={() => setFocusedPanel(defaultOpenIndex)}>
                <div className="spotlight-panels">
                    {posters.slice(0, panelCount).map(({ src, alt }, index) => (
                        <div
                            key={src}
                            className={`spotlight-panel ${activePanel === index ? 'is-focused' : ''}`}
                            style={getPanelPosition(index)}
                            onMouseEnter={!isMobile ? () => setFocusedPanel(index) : undefined}
                            onClick={isMobile ? () => setFocusedPanel(index) : undefined}
                        >
                            <img
                                src={src}
                                alt={alt}
                                style={{ width: expandedWidth }}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 p-4 sm:p-6 md:p-10 pointer-events-none">
                <div className="spotlight-copy max-w-[48%] spotlight-title text-black tracking-widest leading-none">
                    <span>leigabriel</span>
                    <br />
                </div>

                <div className="spotlight-copy max-w-[48%] text-right text-black text-[10px] sm:text-xs tracking-widest uppercase leading-none">
                    <span>GRAPHIC DESIGNER</span>
                    <br />
                    <span>WEB DEVELOPER</span>
                </div>
            </div>
        </section>
    )
}
