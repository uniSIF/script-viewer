import type { FileLoadError } from '../types'
import styles from './ErrorList.module.css'

interface ErrorListProps {
  errors: FileLoadError[]
  onDismiss: () => void
}

export function ErrorList({ errors, onDismiss }: ErrorListProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <div className={styles.errorList} role="alert">
      <div className={styles.header}>
        <span className={styles.title}>{errors.length}件のエラー</span>
        <button type="button" onClick={onDismiss} className={styles.dismissButton}>
          閉じる
        </button>
      </div>
      <ul className={styles.list}>
        {errors.map((error, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.fileName}>{error.fileName}</span>
            <span className={styles.message}>{error.error}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
