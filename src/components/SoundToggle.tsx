import styles from './SoundToggle.module.css'

interface SoundToggleProps {
  enabled: boolean
  onToggle: () => void
  offsetTop?: number
}

export function SoundToggle({ enabled, onToggle, offsetTop = 12 }: SoundToggleProps) {
  return (
    <button
      className={`press ${styles.btn}`}
      type="button"
      onClick={onToggle}
      aria-label={enabled ? 'Matikan suara' : 'Nyalakan suara'}
      title={enabled ? 'Matikan suara' : 'Nyalakan suara'}
      style={{ top: offsetTop }}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      >
        <path d="M4 9v6h4l5 4V5L8 9H4Z" />
        {enabled ? (
          <>
            <path d="M16 9.5a4 4 0 0 1 0 5" />
            <path d="M18.5 7a7.5 7.5 0 0 1 0 10" />
          </>
        ) : (
          <>
            <path d="M17 9l4 4" />
            <path d="M21 9l-4 4" />
          </>
        )}
      </svg>
    </button>
  )
}
