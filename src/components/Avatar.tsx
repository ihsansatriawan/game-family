import type { Category } from '../types'
import { CAT } from '../lib/constants'
import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  cat: Category
  avatar?: string
  size?: number
}

export function Avatar({ name, cat, avatar, size = 46 }: AvatarProps) {
  const k = CAT[cat]
  const glyph = avatar || (name || '?').trim().charAt(0).toUpperCase()
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        background: k.c,
        // emoji reads bigger than a single initial — size accordingly
        fontSize: size * (avatar ? 0.56 : 0.44),
      }}
    >
      {glyph}
    </div>
  )
}
