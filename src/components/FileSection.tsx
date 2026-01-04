import type { ScriptFile } from '../types'
import { ScriptItem } from './ScriptItem'
import styles from './FileSection.module.css'

interface FileSectionProps {
  file: ScriptFile
  selectedCharacters: Set<string>
}

export function FileSection({ file, selectedCharacters }: FileSectionProps) {
  // フィルターが選択されている場合は、選択されたキャラクターのセリフのみ表示
  const filteredDialogues =
    selectedCharacters.size === 0
      ? file.dialogues
      : file.dialogues.filter((d) => selectedCharacters.has(d.character))

  // フィルター適用後にセリフがない場合はセクションを表示しない
  if (filteredDialogues.length === 0) {
    return null
  }

  return (
    <section className={styles.fileSection}>
      <h2 className={styles.fileName}>{file.fileName}</h2>
      <div className={styles.dialogueList}>
        {filteredDialogues.map((dialogue, index) => (
          <ScriptItem key={index} dialogue={dialogue} />
        ))}
      </div>
    </section>
  )
}
