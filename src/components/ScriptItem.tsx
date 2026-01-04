import type { Dialogue } from '../types'
import styles from './ScriptItem.module.css'

interface ScriptItemProps {
  dialogue: Dialogue
}

export function ScriptItem({ dialogue }: ScriptItemProps) {
  return (
    <div className={styles.scriptItem}>
      <span className={styles.character}>{dialogue.character}</span>
      <span className={styles.text}>{dialogue.text}</span>
    </div>
  )
}
