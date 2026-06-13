import type { CSSProperties, ReactNode } from 'react'
import styles from './BigButton.module.css'

type Size = 'lg' | 'md' | 'sm'

interface BigButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  bg?: string
  ink?: string
  deep?: string
  outline?: boolean
  size?: Size
  style?: CSSProperties
}

const PAD: Record<Size, string> = { lg: '20px', md: '15px', sm: '11px' }
const FONT: Record<Size, number> = { lg: 23, md: 18, sm: 15 }

export function BigButton({
  children,
  onClick,
  disabled,
  bg = 'var(--primary)',
  ink = 'var(--primary-ink)',
  deep = 'var(--primary-deep)',
  outline,
  size = 'lg',
  style = {},
}: BigButtonProps) {
  return (
    <button
      className={`press ${styles.btn}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        border: outline ? `2.5px solid ${bg}` : 'none',
        background: disabled ? 'var(--line)' : outline ? 'transparent' : bg,
        color: disabled ? 'var(--muted)' : outline ? bg : ink,
        boxShadow: disabled || outline ? 'none' : `0 5px 0 ${deep}`,
        padding: PAD[size],
        fontSize: FONT[size],
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
