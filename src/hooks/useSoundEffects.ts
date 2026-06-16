import { useCallback, useRef, useState } from 'react'

type SoundName = 'tap' | 'start' | 'reveal' | 'correct' | 'wrong' | 'finale'

type WebAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext
}

const STORAGE_KEY = 'family-trivia:sound-enabled'

function readInitialEnabled() {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(STORAGE_KEY) !== 'false'
}

export function useSoundEffects() {
  const [enabled, setEnabled] = useState(readInitialEnabled)
  const ctxRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    const AudioCtor = window.AudioContext ?? (window as WebAudioWindow).webkitAudioContext
    if (!AudioCtor) return null

    if (!ctxRef.current) {
      ctxRef.current = new AudioCtor()
    }

    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume()
    }

    return ctxRef.current
  }, [])

  const tone = useCallback(
    (
      ctx: AudioContext,
      frequency: number,
      start: number,
      duration: number,
      type: OscillatorType = 'sine',
      volume = 0.08,
    ) => {
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      const now = ctx.currentTime
      const startAt = now + start
      const endAt = startAt + duration

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, startAt)
      gain.gain.setValueAtTime(0.001, startAt)
      gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.018)
      gain.gain.exponentialRampToValueAtTime(0.001, endAt)

      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start(startAt)
      oscillator.stop(endAt + 0.03)
    },
    [],
  )

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return

      const ctx = getContext()
      if (!ctx) return

      if (name === 'tap') {
        tone(ctx, 420, 0, 0.055, 'triangle', 0.035)
        return
      }

      if (name === 'reveal') {
        tone(ctx, 523.25, 0, 0.08, 'sine', 0.055)
        tone(ctx, 659.25, 0.07, 0.09, 'sine', 0.06)
        tone(ctx, 783.99, 0.15, 0.12, 'triangle', 0.05)
        return
      }

      if (name === 'correct') {
        tone(ctx, 587.33, 0, 0.08, 'triangle', 0.07)
        tone(ctx, 739.99, 0.08, 0.09, 'triangle', 0.075)
        tone(ctx, 987.77, 0.18, 0.16, 'sine', 0.08)
        return
      }

      if (name === 'wrong') {
        tone(ctx, 220, 0, 0.1, 'sawtooth', 0.045)
        tone(ctx, 164.81, 0.1, 0.16, 'sawtooth', 0.035)
        return
      }

      if (name === 'finale') {
        tone(ctx, 392, 0, 0.09, 'triangle', 0.06)
        tone(ctx, 523.25, 0.09, 0.1, 'triangle', 0.065)
        tone(ctx, 659.25, 0.19, 0.1, 'triangle', 0.07)
        tone(ctx, 1046.5, 0.32, 0.24, 'sine', 0.08)
        return
      }

      tone(ctx, 392, 0, 0.07, 'triangle', 0.05)
      tone(ctx, 493.88, 0.08, 0.08, 'triangle', 0.055)
      tone(ctx, 659.25, 0.18, 0.13, 'sine', 0.065)
    },
    [enabled, getContext, tone],
  )

  const toggle = useCallback(() => {
    setEnabled((value) => {
      const next = !value
      window.localStorage.setItem(STORAGE_KEY, String(next))

      if (next) {
        const ctx = getContext()
        if (ctx) {
          tone(ctx, 523.25, 0, 0.07, 'triangle', 0.045)
          tone(ctx, 783.99, 0.08, 0.1, 'sine', 0.05)
        }
      }

      return next
    })
  }, [getContext, tone])

  return { enabled, play, toggle }
}
