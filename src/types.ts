// Shared domain types for Family Trivia.

export type Category = 'anak' | 'dewasa'

/** Difficulty/audience of a question. 'umum' fits anyone. */
export type QuestionLevel = 'anak' | 'dewasa' | 'umum'

export interface Player {
  id: string
  name: string
  cat: Category
  score: number
  avatar: string
}

export interface Question {
  topic: string
  level: QuestionLevel
  q: string
  a: string
  /** Emoji illustration relevant to the question/answer. */
  emoji: string
  explain: string
}

/** Shape of the JSON question bank (src/data/bank.json). */
export interface Bank {
  questions: Question[]
  /** Funny last-place punishments. "{name}" is replaced with the loser's name. */
  punishments: string[]
}

export type Screen = 'lobby' | 'play' | 'over'

/** Persisted game state (localStorage). */
export interface GameState {
  screen: Screen
  players: Player[]
  turn: number
  question: Question | null
  revealed: boolean
  questionExhausted: boolean
  recentIds: string[]
  punishIdx: number
}
