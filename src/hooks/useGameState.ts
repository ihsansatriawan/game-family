import { useEffect, useState } from 'react'
import type { Category, GameState, Player, Question } from '../types'
import {
  newId,
  markQuestionUsed,
  pickQuestion,
  pickPunishment,
  punishmentText,
} from '../lib/game'

import { loadState, saveState } from '../lib/storage'

const DEFAULT_PLAYERS: Player[] = [
  { id: newId(), name: 'Ayah', cat: 'dewasa', score: 0, avatar: '🦁' },
  { id: newId(), name: 'Bunda', cat: 'dewasa', score: 0, avatar: '🦊' },
  { id: newId(), name: 'Hasna', cat: 'anak', score: 0, avatar: '🐰' },
]

export interface GameApi {
  screen: GameState['screen']
  players: Player[]
  current: Player
  question: Question | null
  revealed: boolean
  questionExhausted: boolean
  qNumber: number
  addPlayer: (name: string, cat: Category, avatar: string) => void
  removePlayer: (id: string) => void
  startGame: () => void
  reveal: () => void
  score: (pts: number) => void
  endGame: () => void
  restart: () => void
  punishment: { text: string; loser: Player } | null
}

export function useGameState(): GameApi {
  const saved = loadState()

  const [screen, setScreen] = useState<GameState['screen']>(saved?.screen ?? 'lobby')
  const [players, setPlayers] = useState<Player[]>(saved?.players ?? DEFAULT_PLAYERS)
  const [turn, setTurn] = useState<number>(saved?.turn ?? 0)
  const [question, setQuestion] = useState<Question | null>(saved?.question ?? null)
  const [revealed, setRevealed] = useState<boolean>(saved?.revealed ?? false)
  const [questionExhausted, setQuestionExhausted] = useState<boolean>(
    saved?.questionExhausted ?? false,
  )
  const [recentIds, setRecentIds] = useState<string[]>(saved?.recentIds ?? [])
  const [punishIdx, setPunishIdx] = useState<number>(saved?.punishIdx ?? 0)

  // persist on every change
  useEffect(() => {
    saveState({
      screen,
      players,
      turn,
      question,
      revealed,
      questionExhausted,
      recentIds,
      punishIdx,
    })
  }, [screen, players, turn, question, revealed, questionExhausted, recentIds, punishIdx])

  const current = players[turn % Math.max(players.length, 1)] ?? players[0]

  const addPlayer = (name: string, cat: Category, avatar: string) =>
    setPlayers((ps) => [...ps, { id: newId(), name, cat, score: 0, avatar }])

  const removePlayer = (id: string) =>
    setPlayers((ps) => ps.filter((p) => p.id !== id))

  const startGame = () => {
    const fresh = players.map((p) => ({ ...p, score: 0 }))
    setPlayers(fresh)
    setTurn(0)
    setRevealed(false)
    const q = pickQuestion(fresh[0], [])
    setQuestion(q)
    setQuestionExhausted(q === null)
    setRecentIds(q ? [q.q] : [])
    setScreen('play')
  }

  const reveal = () => setRevealed(true)

  const score = (pts: number) => {
    setPlayers((ps) =>
      ps.map((p) => (p.id === current.id ? { ...p, score: p.score + pts } : p)),
    )
    const nextTurn = turn + 1
    const nextPlayer = players[nextTurn % players.length]
    const q = pickQuestion(nextPlayer, recentIds)
    setRecentIds((r) => (q ? markQuestionUsed(r, q) : r))
    setQuestion(q)
    setQuestionExhausted(q === null)
    setRevealed(false)
    setTurn(nextTurn)
  }

  const endGame = () => {
    setPunishIdx(pickPunishment())
    setScreen('over')
  }

  const restart = () => {
    setPlayers((ps) => ps.map((p) => ({ ...p, score: 0 })))
    setTurn(0)
    setRevealed(false)
    setQuestion(null)
    setQuestionExhausted(false)
    setRecentIds([])
    setScreen('lobby')
  }

  let punishment: GameApi['punishment'] = null
  if (screen === 'over' && players.length > 0) {
    const ranked = [...players].sort((a, b) => b.score - a.score)
    const loser = ranked[ranked.length - 1]
    punishment = { loser, text: punishmentText(punishIdx, loser.name) }
  }

  return {
    screen,
    players,
    current,
    question,
    revealed,
    questionExhausted,
    qNumber: turn + 1,
    addPlayer,
    removePlayer,
    startGame,
    reveal,
    score,
    endGame,
    restart,
    punishment,
  }
}
