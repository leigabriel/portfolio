// Short interface sounds played through the Web Audio API.
//
// An <audio> element tells the phone "media is playing", so the system takes
// audio focus and lowers (or pauses) whatever music the visitor already has
// running. Web Audio buffers don't claim that focus on Android, and on iOS the
// audio session is set to "ambient", which mixes with other apps instead of
// interrupting them.
const SFX_URL = '/sounds/folder_sfx.mp3'

let context = null
let rawBytes = null
let decoded = null

function setAmbientSession() {
    try {
        if (navigator.audioSession) navigator.audioSession.type = 'ambient'
    } catch {
        // Not supported; the platform default is fine.
    }
}

if (typeof window !== 'undefined') setAmbientSession()

function getContext() {
    if (context) return context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    context = new AudioContextClass({ latencyHint: 'interactive' })
    return context
}

function getBuffer(ctx) {
    if (decoded) return decoded
    // Fetched once and decoded once; decodeAudioData detaches its input, so it
    // always gets a copy.
    rawBytes ||= fetch(SFX_URL).then((response) => response.arrayBuffer())
    decoded = rawBytes.then((bytes) => ctx.decodeAudioData(bytes.slice(0)))
    decoded.catch(() => { decoded = null })
    return decoded
}

// Start fetching the sound early so the first click is not delayed.
export function preloadSfx() {
    if (typeof window === 'undefined') return
    rawBytes ||= fetch(SFX_URL).then((response) => response.arrayBuffer())
    rawBytes.catch(() => { rawBytes = null })
}

export function playSfx({ volume = 0.5, rate = 1 } = {}) {
    const ctx = getContext()
    if (!ctx) return

    setAmbientSession()
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})

    getBuffer(ctx)
        .then((buffer) => {
            const source = ctx.createBufferSource()
            const gain = ctx.createGain()
            source.buffer = buffer
            source.playbackRate.value = rate
            gain.gain.value = volume
            source.connect(gain).connect(ctx.destination)
            source.start(0)
        })
        .catch(() => {})
}
