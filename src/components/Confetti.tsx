import { useMemo } from 'react'
import styles from './Confetti.module.css'

const COLORS = [
  'var(--primary)',
  'var(--kid)',
  'var(--adult)',
  'var(--gold)',
  'var(--correct)',
]

/** Falling confetti for the leaderboard. Positions are randomized once on mount. */
export function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 2.2 + Math.random() * 1.4,
        sz: 7 + Math.random() * 7,
        rot: Math.random() * 360,
        color: COLORS[i % COLORS.length],
      })),
    [],
  )

  return (
    <div className={styles.layer} aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className={styles.bit}
          style={{
            left: `${b.left}%`,
            width: b.sz,
            height: b.sz * 1.4,
            background: b.color,
            transform: `rotate(${b.rot}deg)`,
            animation: `fall ${b.dur}s ${b.delay}s cubic-bezier(.3,.5,.7,1) forwards`,
          }}
        />
      ))}
    </div>
  )
}
