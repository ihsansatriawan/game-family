import type { Category } from '../types'
import { CAT } from '../lib/constants'
import styles from './CatChip.module.css'

interface CatChipProps {
  cat: Category
  small?: boolean
}

export function CatChip({ cat, small }: CatChipProps) {
  const k = CAT[cat]
  return (
    <span
      className={small ? `${styles.chip} ${styles.small}` : styles.chip}
      style={{ background: k.soft, color: k.ink }}
    >
      {k.label}
    </span>
  )
}
