import { useState, useCallback, useMemo } from 'react'
import type { ScriptFile, FileLoadError } from './types'
import { DropZone } from './components/DropZone'
import { ScriptList } from './components/ScriptList'
import { FilterPanel } from './components/FilterPanel'
import { ErrorList } from './components/ErrorList'
import './App.css'

function App() {
  const [files, setFiles] = useState<ScriptFile[]>([])
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<FileLoadError[]>([])

  const handleFilesLoaded = useCallback((newFiles: ScriptFile[]) => {
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleError = useCallback((newErrors: FileLoadError[]) => {
    setErrors((prev) => [...prev, ...newErrors])
  }, [])

  const handleDismissErrors = useCallback(() => {
    setErrors([])
  }, [])

  const handleSelectionChange = useCallback((selected: Set<string>) => {
    setSelectedCharacters(selected)
  }, [])

  const characters = useMemo(() => {
    const charSet = new Set<string>()
    for (const file of files) {
      for (const dialogue of file.dialogues) {
        charSet.add(dialogue.character)
      }
    }
    return Array.from(charSet).sort()
  }, [files])

  const hasFiles = files.length > 0

  return (
    <div className="app">
      <h1>Script Viewer</h1>
      <DropZone onFilesLoaded={handleFilesLoaded} onError={handleError} />
      <ErrorList errors={errors} onDismiss={handleDismissErrors} />
      {hasFiles && (
        <>
          <FilterPanel
            characters={characters}
            selectedCharacters={selectedCharacters}
            onSelectionChange={handleSelectionChange}
          />
          <ScriptList files={files} selectedCharacters={selectedCharacters} />
        </>
      )}
    </div>
  )
}

export default App
