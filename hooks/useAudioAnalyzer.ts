import { useEffect, useRef, useState } from 'react'

export function useAudioAnalyzer(isListening: boolean) {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
    const rafIdRef = useRef<number | null>(null)
    const dataArrayRef = useRef<Uint8Array | null>(null)

    // Initialize Audio Context on demand
    useEffect(() => {
        if (isListening && !audioContext) {
            const initAudio = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
                    const anal = ctx.createAnalyser()

                    anal.fftSize = 256
                    const source = ctx.createMediaStreamSource(stream)
                    source.connect(anal)

                    sourceRef.current = source
                    setAudioContext(ctx)
                    setAnalyser(anal)
                    dataArrayRef.current = new Uint8Array(anal.frequencyBinCount)

                } catch (err) {
                    console.error("Error accessing microphone:", err)
                }
            }
            initAudio()
        }

        return () => {
            // Cleanup if listening stops? 
            // For now, keep context alive but we could suspend it.
        }
    }, [isListening, audioContext])

    // Expose a function to get current frequency data
    const getFrequencyData = () => {
        if (analyser && dataArrayRef.current) {
            analyser.getByteFrequencyData(dataArrayRef.current)
            return dataArrayRef.current
        }
        return null
    }

    return { getFrequencyData, isReady: !!analyser }
}
