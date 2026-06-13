import type { Player } from '../types'
import { CAT } from '../lib/constants'
import { Avatar } from '../components/Avatar'
import { BigButton } from '../components/BigButton'
import { Confetti } from '../components/Confetti'
import shared from './shared.module.css'
import styles from './OverScreen.module.css'

interface OverScreenProps {
  players: Player[]
  punishment: { text: string; loser: Player }
  onRestart: () => void
}

const MEDAL = ['🥇', '🥈', '🥉']
const RANK_BG = ['var(--gold)', 'var(--silver)', 'var(--bronze)']
// podium bar height by display column (2nd, 1st, 3rd)
const PODIUM_H = [64, 92, 50]

export function OverScreen({ players, punishment, onRestart }: OverScreenProps) {
  const ranked = [...players].sort((a, b) => b.score - a.score)
  const winner = ranked[0]
  const top3 = ranked.slice(0, 3)
  // display order: 2nd, 1st, 3rd
  const podium = [top3[1], top3[0], top3[2]].filter(Boolean) as Player[]
  const rest = ranked.slice(3)

  return (
    <div className={shared.screen}>
      <Confetti />
      <div className={styles.header}>
        <h1 className={styles.title}>Hasil Akhir 🏆</h1>
        <p className={styles.subtitle}>
          Juaranya adalah{' '}
          <span style={{ color: CAT[winner.cat].ink }}>{winner.name}</span>!
        </p>
      </div>

      <div className={`noscroll ${styles.scroll}`}>
        {/* podium */}
        <div className={styles.podium}>
          {podium.map((p, col) => {
            const place = ranked.indexOf(p)
            const pk = CAT[p.cat]
            const isFirst = place === 0
            return (
              <div key={p.id} className={`pop-in ${styles.podiumCol}`}>
                {isFirst && <div className={styles.crown}>👑</div>}
                <div
                  className={styles.podiumAvatar}
                  style={{
                    width: isFirst ? 60 : 50,
                    height: isFirst ? 60 : 50,
                    background: pk.c,
                    fontSize: isFirst ? 26 : 22,
                    border: isFirst ? '3px solid var(--gold)' : 'none',
                  }}
                >
                  {p.avatar || p.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.podiumName}>{p.name}</div>
                <div className={styles.podiumScore}>{p.score}</div>
                <div
                  className={styles.podiumBar}
                  style={{ height: PODIUM_H[col], background: RANK_BG[place] }}
                >
                  {MEDAL[place]}
                </div>
              </div>
            )
          })}
        </div>

        {/* the rest */}
        {rest.length > 0 && (
          <div className={styles.rest}>
            {rest.map((p, i) => (
              <div key={p.id} className={styles.restRow}>
                <span className={styles.restPlaceNum}>{i + 4}</span>
                <Avatar name={p.name} cat={p.cat} avatar={p.avatar} size={34} />
                <span className={styles.restName}>{p.name}</span>
                <span className={styles.restScore}>{p.score}</span>
              </div>
            ))}
          </div>
        )}

        {/* punishment card */}
        <div className={`wiggle ${styles.punish}`}>
          <div className={styles.punishHead}>
            <span className={styles.punishEmoji}>😈</span>
            <span className={styles.punishTitle}>Tugas Posisi Terakhir</span>
          </div>
          <p className={styles.punishText}>{punishment.text}</p>
          <p className={styles.punishLoser}>
            👉 {punishment.loser.name} yang harus melakukannya!
          </p>
        </div>
      </div>

      {/* restart */}
      <div className={styles.restart}>
        <BigButton onClick={onRestart}>🔄&nbsp;&nbsp;Main Lagi Nanti</BigButton>
      </div>
    </div>
  )
}
