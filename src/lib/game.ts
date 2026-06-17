import bank from '../data/bank.json'
import type { Bank, Player, Question } from '../types'

const BANK = bank as Bank

export const QUESTIONS: Question[] = BANK.questions
export const PUNISHMENTS: string[] = BANK.punishments

let _pid = 0
export const newId = (): string => `p${Date.now()}_${_pid++}`

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

/**
 * Pick a question suited to the player: kids get 'anak' + 'umum', adults get
 * 'dewasa' + 'umum'. Avoid anything already used in the current session.
 */
export function pickQuestion(player: Player, usedIds: string[]): Question | null {
  const pool = QUESTIONS.filter((q) => q.level === player.cat || q.level === 'umum')
  const avail = pool.filter((q) => !usedIds.includes(q.q))
  return avail.length > 0 ? rand(avail) : null
}

export const markQuestionUsed = (usedIds: string[], q: Question): string[] => [
  ...usedIds,
  q.q,
]

export function pickPunishment(): number {
  return Math.floor(Math.random() * PUNISHMENTS.length)
}

export function punishmentText(idx: number, loserName: string): string {
  const tmpl = PUNISHMENTS[idx] ?? PUNISHMENTS[0]
  return tmpl.replace('{name}', loserName)
}
