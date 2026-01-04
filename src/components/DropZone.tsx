import { useRef, useCallback, useState } from 'react'
import type { ScriptFile, FileLoadError } from '../types'
import { parseJson } from '../utils/jsonParser'
import styles from './DropZone.module.css'

interface DropZoneProps {
  onFilesLoaded: (files: ScriptFile[]) => void
  onError: (errors: FileLoadError[]) => void
}

/**
 * ファイルがJSONファイルかどうかを判定する
 */
function isJsonFile(file: File): boolean {
  return file.name.endsWith('.json') || file.type === 'application/json'
}

/**
 * ファイルをテキストとして読み込む
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'))
    reader.readAsText(file)
  })
}

export function DropZone({ onFilesLoaded, onError }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const processFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const loadedFiles: ScriptFile[] = []
      const errors: FileLoadError[] = []

      for (const file of Array.from(files)) {
        // JSONファイルでない場合はエラー
        if (!isJsonFile(file)) {
          errors.push({
            success: false,
            fileName: file.name,
            error: 'JSONファイルを選択してください',
          })
          continue
        }

        try {
          const text = await readFileAsText(file)
          const result = parseJson(text)

          if (result.success) {
            loadedFiles.push({
              fileName: file.name,
              dialogues: result.dialogues,
            })
          } else {
            errors.push({
              success: false,
              fileName: file.name,
              error: result.error,
            })
          }
        } catch (err) {
          errors.push({
            success: false,
            fileName: file.name,
            error: err instanceof Error ? err.message : 'ファイルの読み込みに失敗しました',
          })
        }
      }

      if (loadedFiles.length > 0) {
        onFilesLoaded(loadedFiles)
      }

      if (errors.length > 0) {
        onError(errors)
      }
    },
    [onFilesLoaded, onError]
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(event.target.files)
      // 同じファイルを再選択できるようにリセット
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [processFiles]
  )

  const handleButtonClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragOver(false)
      processFiles(event.dataTransfer.files)
    },
    [processFiles]
  )

  const dropZoneClasses = [styles.dropZone, isDragOver && styles.dragOver]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      data-testid="drop-zone"
      className={dropZoneClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        multiple
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <p className={styles.dropText}>
        ファイルをドラッグ&ドロップ
        <br />
        または
      </p>
      <button type="button" onClick={handleButtonClick} className={styles.selectButton}>
        ファイルを選択
      </button>
    </div>
  )
}
