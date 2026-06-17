import type { Player, Question } from '../types'
import { CAT, POINTS_CORRECT } from '../lib/constants'
import { BigButton } from '../components/BigButton'
import shared from './shared.module.css'
import styles from './PlayScreen.module.css'

interface PlayScreenProps {
  players: Player[]
  current: Player
  question: Question | null
  qNumber: number
  revealed: boolean
  exhausted: boolean
  onReveal: () => void
  onScore: (pts: number) => void
  onEnd: () => void
}

export function PlayScreen({
  players,
  current,
  question,
  qNumber,
  revealed,
  exhausted,
  onReveal,
  onScore,
  onEnd,
}: PlayScreenProps) {
  const k = CAT[current.cat]
  const isExhausted = exhausted || question === null

  return (
    <div className={shared.screen}>
      {/* mini scoreboard (sticky top) */}
      <div className={`noscroll ${styles.scoreboard}`}>
        {players.map((p) => {
          const on = p.id === current.id
          const pk = CAT[p.cat]
          return (
            <div
              key={p.id}
              className={`${styles.scorePill} ${on ? styles.scorePillOn : ''}`}
              style={{
                background: on ? pk.c : 'var(--surface)',
                boxShadow: on
                  ? `0 4px 12px ${pk.c}55`
                  : '0 2px 6px rgba(0,0,0,0.05)',
                border: on ? 'none' : '2px solid var(--line)',
              }}
            >
              <span
                className={styles.scoreAvatar}
                style={{
                  background: on ? 'rgba(255,255,255,0.25)' : pk.soft,
                  color: on ? '#fff' : pk.ink,
                  fontSize: p.avatar ? 14 : 12,
                }}
              >
                {p.avatar || p.name.charAt(0).toUpperCase()}
              </span>
              <span
                className={styles.scoreName}
                style={{ color: on ? '#fff' : 'var(--muted)' }}
              >
                {p.name}
              </span>
              <span
                className={styles.scoreNum}
                style={{ color: on ? '#fff' : 'var(--ink)' }}
              >
                {p.score}
              </span>
            </div>
          )
        })}
      </div>

      {/* turn indicator */}
      <div className={styles.turnWrap}>
        <div className={styles.turnPill} style={{ background: k.soft, color: k.ink }}>
          <span className={styles.turnEmoji}>{isExhausted ? '🏁' : '👉'}</span>{' '}
          {isExhausted ? 'Ronde selesai' : `Giliran: ${current.name}`}
        </div>
      </div>

      {/* question flashcard */}
      <div className={styles.cardWrap}>
        <div
          className={`${styles.card} ${revealed ? `card-reveal ${styles.cardSolved}` : 'card-enter'}`}
          key={isExhausted ? 'exhausted' : qNumber + (revealed ? 'r' : 'a')}
          style={{
            background: revealed || isExhausted ? 'var(--correct-soft)' : 'var(--surface)',
            border:
              revealed || isExhausted
                ? '3px solid var(--correct)'
                : '3px solid transparent',
          }}
        >
          {(revealed || isExhausted) && (
            <div className={styles.sparkles} aria-hidden="true">
              <span>✨</span>
              <span>⭐</span>
              <span>🎉</span>
              <span>✨</span>
              <span>⭐</span>
            </div>
          )}

          <div className={styles.cardHead}>
            <span
              className={styles.topicChip}
              style={{ background: revealed || isExhausted ? 'var(--correct)' : k.c }}
            >
              {isExhausted ? 'SELESAI' : question.topic.toUpperCase()}
            </span>
            <span className={styles.soalNum}>
              {isExhausted ? 'Semua soal terpakai' : `Soal #${qNumber}`}
            </span>
          </div>

          <div className={`noscroll ${styles.cardBody}`}>
            {isExhausted ? (
              <div className={styles.finishedInner}>
                <div className={`${styles.illustration} ${styles.illustrationSolved}`}>
                  🎊
                </div>
                <div className={styles.revealLabel}>PERTANYAAN HABIS</div>
                <p className={styles.finishedTitle}>Hebat, semua soal baru sudah dimainkan!</p>
                <p className={styles.finishedText}>
                  Tidak ada pertanyaan yang diulang di sesi ini. Ronde bisa
                  ditutup dulu, lalu mulai lagi nanti dengan semangat baru.
                </p>
              </div>
            ) : !revealed ? (
              <>
                <div className={styles.illustration}>{question.emoji}</div>
                <p className={styles.question}>{question.q}</p>
              </>
            ) : (
              <div className={styles.revealInner}>
                <div className={`${styles.illustration} ${styles.illustrationSolved}`}>
                  {question.emoji}
                </div>
                <div className={styles.revealLabel}>✓ JAWABAN BENAR</div>
                <p className={styles.answer}>{question.a}</p>
                <p className={styles.explain}>{question.explain}</p>
              </div>
            )}
          </div>

          {!revealed && !isExhausted && (
            <div className={styles.hint}>Baca keras-keras, lalu tebak! 🤔</div>
          )}
        </div>
      </div>

      {/* action area */}
      <div className={styles.actions}>
        {isExhausted ? (
          <BigButton onClick={onEnd} bg="var(--correct)" deep="var(--correct-ink)">
            🏆&nbsp;&nbsp;Lihat Hasil
          </BigButton>
        ) : !revealed ? (
          <BigButton onClick={onReveal} bg="var(--ink)" deep="rgba(0,0,0,0.35)">
            👀&nbsp;&nbsp;Lihat Jawaban
          </BigButton>
        ) : (
          <div className={styles.actionsSplit}>
            <BigButton onClick={() => onScore(0)} outline bg="var(--wrong)" style={{ flex: 1 }}>
              Salah (0)
            </BigButton>
            <BigButton
              onClick={() => onScore(POINTS_CORRECT)}
              bg="var(--correct)"
              deep="var(--correct-ink)"
              style={{ flex: 1.3 }}
            >
              Benar (+{POINTS_CORRECT})
            </BigButton>
          </div>
        )}
      </div>

      {/* emergency end */}
      {!isExhausted && (
        <div className={styles.endWrap}>
          <button className={`press ${styles.endBtn}`} onClick={onEnd}>
            🛑 Makanan Datang! (Selesai)
          </button>
        </div>
      )}
    </div>
  )
}
