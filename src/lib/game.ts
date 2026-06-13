import bank from '../data/bank.json'
import type { Bank, Player, Question } from '../types'
import { RECENT_WINDOW } from './constants'

const BANK = bank as Bank

export const QUESTIONS: Question[] = BANK.questions
export const PUNISHMENTS: string[] = BANK.punishments

let _pid = 0
export const newId = (): string => `p${Date.now()}_${_pid++}`

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

/**
 * Pick a question suited to the player: kids get 'anak' + 'umum', adults get
 * 'dewasa' + 'umum'. Avoid anything in `recentIds` (the question text), falling
 * back to the full pool if everything's been seen recently.
 */
export function pickQuestion(player: Player, recentIds: string[]): Question {
  const pool = QUESTIONS.filter((q) => q.level === player.cat || q.level === 'umum')
  let avail = pool.filter((q) => !recentIds.includes(q.q))
  if (avail.length === 0) avail = pool
  return rand(avail)
}

export const pushRecent = (recentIds: string[], q: Question): string[] =>
  [...recentIds, q.q].slice(-RECENT_WINDOW)

export function pickPunishment(): number {
  return Math.floor(Math.random() * PUNISHMENTS.length)
}

export function punishmentText(idx: number, loserName: string): string {
  const tmpl = PUNISHMENTS[idx] ?? PUNISHMENTS[0]
  return tmpl.replace('{name}', loserName)
}
