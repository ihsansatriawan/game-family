import { useEffect, useRef, useState } from 'react'
import type { Category, Player } from '../types'
import { AVATARS, CAT } from '../lib/constants'
import { Avatar } from '../components/Avatar'
import { CatChip } from '../components/CatChip'
import { BigButton } from '../components/BigButton'
import { IconX } from '../components/IconX'
import shared from './shared.module.css'
import styles from './LobbyScreen.module.css'

interface LobbyScreenProps {
  players: Player[]
  addPlayer: (name: string, cat: Category, avatar: string) => void
  removePlayer: (id: string) => void
  startGame: () => void
}

export function LobbyScreen({ players, addPlayer, removePlayer, startGame }: LobbyScreenProps) {
  const [name, setName] = useState('')
  const [cat, setCat] = useState<Category>('anak')
  const [avatar, setAvatar] = useState<string>(AVATARS[0])
  const inputRef = useRef<HTMLInputElement>(null)

  const usedAvatars = players.map((p) => p.avatar)
  const nextFreeAvatar = () => AVATARS.find((a) => !usedAvatars.includes(a)) ?? AVATARS[0]

  // auto-suggest next free avatar when players change
  useEffect(() => {
    if (usedAvatars.includes(avatar)) setAvatar(nextFreeAvatar())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players.length])

  const submit = () => {
    if (!name.trim()) return
    addPlayer(name.trim(), cat, avatar)
    setName('')
    inputRef.current?.focus()
  }

  const canStart = players.length >= 2

  return (
    <div className={shared.screen}>
      {/* header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeEmoji}>🍜</span>
          <span className={styles.badgeText}>PASS &amp; PLAY</span>
        </div>
        <h1 className={styles.title}>Family Trivia</h1>
        <p className={styles.subtitle}>Sambil Nunggu Makanan Datang</p>
      </div>

      {/* player list */}
      <div className={styles.listWrap}>
        <div className={styles.listHead}>
          <span className={shared.labelTiny}>PEMAIN</span>
          <span className={`${shared.labelTiny} ${styles.listHeadCount}`}>
            {players.length} orang
          </span>
        </div>
        <div className={`noscroll ${styles.list}`}>
          {players.length === 0 && (
            <div className={styles.empty}>
              <span className={styles.emptyEmoji}>👨‍👩‍👧‍👦</span>
              Tambahkan minimal 2 pemain
              <br />
              untuk mulai bermain.
            </div>
          )}
          {players.map((p) => (
            <div key={p.id} className={`pop-in ${styles.playerRow}`}>
              <Avatar name={p.name} cat={p.cat} avatar={p.avatar} />
              <div className={styles.playerInfo}>
                <div className={styles.playerName}>{p.name}</div>
                <div className={styles.playerChip}>
                  <CatChip cat={p.cat} small />
                </div>
              </div>
              <button
                className={`press ${styles.removeBtn}`}
                onClick={() => removePlayer(p.id)}
                aria-label="Hapus"
              >
                <IconX />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* add form */}
      <div className={styles.form}>
        <div className={styles.formCard}>
          <input
            ref={inputRef}
            value={name}
            placeholder="Nama pemain…"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className={styles.nameInput}
          />

          {/* avatar picker */}
          <div className={`noscroll ${styles.avatarPicker}`}>
            {AVATARS.map((a) => {
              const on = a === avatar
              const inUse = !on && usedAvatars.includes(a)
              return (
                <button
                  key={a}
                  className={`press ${styles.avatarBtn}`}
                  onClick={() => setAvatar(a)}
                  aria-label={`Avatar ${a}`}
                  style={{
                    cursor: 'pointer',
                    border: on ? `2.5px solid ${CAT[cat].c}` : '2.5px solid transparent',
                    background: on ? CAT[cat].soft : 'var(--surface2)',
                    opacity: inUse ? 0.4 : 1,
                  }}
                >
                  {a}
                </button>
              )
            })}
          </div>

          <div className={styles.controls}>
            {/* category segmented */}
            <div className={styles.segmented}>
              {(['anak', 'dewasa'] as Category[]).map((c) => {
                const on = cat === c
                const k = CAT[c]
                return (
                  <button
                    key={c}
                    className={`press ${styles.segBtn}`}
                    onClick={() => setCat(c)}
                    style={{
                      background: on ? k.c : 'transparent',
                      color: on ? '#fff' : 'var(--muted)',
                      boxShadow: on ? '0 3px 0 rgba(0,0,0,0.12)' : 'none',
                    }}
                  >
                    {k.label}
                  </button>
                )
              })}
            </div>
            <button
              className={`press ${styles.addBtn}`}
              onClick={submit}
              disabled={!name.trim()}
              style={{
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                background: name.trim() ? 'var(--ink)' : 'var(--line)',
                color: name.trim() ? '#fff' : 'var(--muted)',
              }}
            >
              <span className={styles.addBtnPlus}>+</span> Tambah
            </button>
          </div>
        </div>
      </div>

      {/* start */}
      <div className={styles.start}>
        <BigButton onClick={startGame} disabled={!canStart}>
          {canStart ? 'MULAI MAIN  🎉' : 'BUTUH 2 PEMAIN'}
        </BigButton>
      </div>
    </div>
  )
}
