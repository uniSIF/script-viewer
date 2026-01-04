import styles from './FilterPanel.module.css'

interface FilterPanelProps {
  characters: string[]
  selectedCharacters: Set<string>
  onSelectionChange: (selected: Set<string>) => void
}

export function FilterPanel({
  characters,
  selectedCharacters,
  onSelectionChange,
}: FilterPanelProps) {
  const hasFilter = selectedCharacters.size > 0

  const handleCharacterClick = (character: string) => {
    const newSelection = new Set(selectedCharacters)
    if (newSelection.has(character)) {
      newSelection.delete(character)
    } else {
      newSelection.add(character)
    }
    onSelectionChange(newSelection)
  }

  const handleClearFilter = () => {
    onSelectionChange(new Set())
  }

  return (
    <div data-testid="filter-panel" className={styles.filterPanel}>
      {hasFilter && (
        <div className={styles.filterHeader}>
          <span data-testid="filter-indicator" className={styles.filterIndicator}>
            フィルター適用中
          </span>
          <button
            type="button"
            data-testid="clear-filter-button"
            className={styles.clearButton}
            onClick={handleClearFilter}
          >
            クリア
          </button>
        </div>
      )}
      <div className={styles.characterList}>
        {characters.map((character) => {
          const isSelected = selectedCharacters.has(character)
          return (
            <button
              key={character}
              type="button"
              className={`${styles.characterButton} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleCharacterClick(character)}
              data-selected={isSelected ? 'true' : undefined}
            >
              {character}
            </button>
          )
        })}
      </div>
    </div>
  )
}
