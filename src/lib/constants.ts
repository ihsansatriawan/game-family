import type { Category } from '../types'

// Playful animal/face avatars. Used ones are locked in the picker so no two
// players share one.
export const AVATARS = [
  '🦊', '🐼', '🐯', '🐰', '🐵', '🦁', '🐸', '🐶', '🐱',
  '🐨', '🐷', '🐥', '🦄', '🐙', '🐢', '🦉', '🐻', '🐲',
] as const

export const POINTS_CORRECT = 10

/** Keep the last N questions out of the pool to avoid quick repeats. */
export const RECENT_WINDOW = 6

export const STORE_KEY = 'familyTrivia.v1'

interface CatStyle {
  label: string
  /** CSS variable references for this category's color set. */
  c: string
  soft: string
  ink: string
}

// Kid (Anak) = bright/cheerful color · Adult (Dewasa) = deep/solid color.
export const CAT: Record<Category, CatStyle> = {
  anak: { label: 'Anak', c: 'var(--kid)', soft: 'var(--kid-soft)', ink: 'var(--kid-ink)' },
  dewasa: { label: 'Dewasa', c: 'var(--adult)', soft: 'var(--adult-soft)', ink: 'var(--adult-ink)' },
}
