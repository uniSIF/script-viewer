import type { ScriptFile } from '../types'
import { FileSection } from './FileSection'
import styles from './ScriptList.module.css'

interface ScriptListProps {
  files: ScriptFile[]
  selectedCharacters: Set<string>
}

export function ScriptList({ files, selectedCharacters }: ScriptListProps) {
  // 全体でセリフがあるかチェック
  const hasDialogues = files.some((file) => {
    if (selectedCharacters.size === 0) {
      return file.dialogues.length > 0
    }
    return file.dialogues.some((d) => selectedCharacters.has(d.character))
  })

  if (!hasDialogues) {
    return (
      <div className={styles.scriptList}>
        <p className={styles.emptyMessage}>セリフがありません</p>
      </div>
    )
  }

  return (
    <div className={styles.scriptList}>
      {files.map((file, index) => (
        <FileSection key={index} file={file} selectedCharacters={selectedCharacters} />
      ))}
    </div>
  )
}
