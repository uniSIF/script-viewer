import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileSection } from './FileSection'
import type { ScriptFile } from '../types'

describe('FileSection', () => {
  const sampleFile: ScriptFile = {
    fileName: 'chapter1.json',
    dialogues: [
      { character: '太郎', text: 'こんにちは' },
      { character: '花子', text: 'こんにちは！' },
      { character: '太郎', text: 'いい天気だね' },
    ],
  }

  it('ファイル名を見出しとして表示する', () => {
    render(<FileSection file={sampleFile} selectedCharacters={new Set()} />)

    expect(screen.getByRole('heading')).toHaveTextContent('chapter1.json')
  })

  it('該当ファイルのセリフを時系列順に表示する', () => {
    render(<FileSection file={sampleFile} selectedCharacters={new Set()} />)

    // 全てのセリフが表示されている
    expect(screen.getByText('こんにちは')).toBeInTheDocument()
    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
    expect(screen.getByText('いい天気だね')).toBeInTheDocument()
  })

  it('選択されたキャラクターのセリフのみを表示する', () => {
    const selectedCharacters = new Set(['太郎'])

    render(<FileSection file={sampleFile} selectedCharacters={selectedCharacters} />)

    // 太郎のセリフは表示される
    expect(screen.getByText('こんにちは')).toBeInTheDocument()
    expect(screen.getByText('いい天気だね')).toBeInTheDocument()
    // 花子のセリフは表示されない
    expect(screen.queryByText('こんにちは！')).not.toBeInTheDocument()
  })

  it('フィルター未選択時はすべてのセリフを表示する', () => {
    render(<FileSection file={sampleFile} selectedCharacters={new Set()} />)

    expect(screen.getByText('こんにちは')).toBeInTheDocument()
    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
    expect(screen.getByText('いい天気だね')).toBeInTheDocument()
  })

  it('複数キャラクターがフィルター選択された場合は選択されたキャラクターのセリフを表示', () => {
    const selectedCharacters = new Set(['太郎', '花子'])

    render(<FileSection file={sampleFile} selectedCharacters={selectedCharacters} />)

    expect(screen.getByText('こんにちは')).toBeInTheDocument()
    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
    expect(screen.getByText('いい天気だね')).toBeInTheDocument()
  })

  it('フィルター適用後にセリフがない場合はセクションを表示しない', () => {
    const file: ScriptFile = {
      fileName: 'chapter2.json',
      dialogues: [{ character: '次郎', text: 'おはよう' }],
    }
    const selectedCharacters = new Set(['太郎'])

    const { container } = render(<FileSection file={file} selectedCharacters={selectedCharacters} />)

    // セクション全体が表示されない
    expect(container.firstChild).toBeNull()
  })
})
