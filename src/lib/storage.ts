import type { GameState } from '../types'
import { STORE_KEY } from './constants'

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw) as GameState
  } catch {
    // ignore corrupt/unavailable storage
  }
  return null
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota/availability errors
  }
}
