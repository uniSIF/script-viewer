import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScriptList } from './ScriptList'
import type { ScriptFile } from '../types'

describe('ScriptList', () => {
  const sampleFiles: ScriptFile[] = [
    {
      fileName: 'chapter1.json',
      dialogues: [
        { character: '太郎', text: 'こんにちは' },
        { character: '花子', text: 'こんにちは！' },
      ],
    },
    {
      fileName: 'chapter2.json',
      dialogues: [
        { character: '次郎', text: 'おはよう' },
        { character: '太郎', text: 'おはよう！' },
      ],
    },
  ]

  it('読み込んだすべてのファイルをファイル別セクションで表示する', () => {
    render(<ScriptList files={sampleFiles} selectedCharacters={new Set()} />)

    expect(screen.getByText('chapter1.json')).toBeInTheDocument()
    expect(screen.getByText('chapter2.json')).toBeInTheDocument()
  })

  it('複数ファイルを読み込み順に連結して表示する', () => {
    render(<ScriptList files={sampleFiles} selectedCharacters={new Set()} />)

    const headings = screen.getAllByRole('heading')
    expect(headings[0]).toHaveTextContent('chapter1.json')
    expect(headings[1]).toHaveTextContent('chapter2.json')
  })

  it('スクロールで全セリフを閲覧可能にする（スクロール可能なコンテナを持つ）', () => {
    const { container } = render(<ScriptList files={sampleFiles} selectedCharacters={new Set()} />)

    // スクロール可能なコンテナを持つことを確認（classNameで検証）
    const scriptList = container.firstChild as HTMLElement
    expect(scriptList).toHaveClass(/scriptList/)
  })

  it('セリフがない場合は「セリフがありません」と表示する', () => {
    render(<ScriptList files={[]} selectedCharacters={new Set()} />)

    expect(screen.getByText('セリフがありません')).toBeInTheDocument()
  })

  it('すべてのファイルが空のセリフ配列の場合も「セリフがありません」と表示する', () => {
    const emptyFiles: ScriptFile[] = [
      { fileName: 'empty1.json', dialogues: [] },
      { fileName: 'empty2.json', dialogues: [] },
    ]

    render(<ScriptList files={emptyFiles} selectedCharacters={new Set()} />)

    expect(screen.getByText('セリフがありません')).toBeInTheDocument()
  })

  it('フィルター適用後に表示するセリフがない場合も「セリフがありません」と表示する', () => {
    const selectedCharacters = new Set(['存在しないキャラ'])

    render(<ScriptList files={sampleFiles} selectedCharacters={selectedCharacters} />)

    expect(screen.getByText('セリフがありません')).toBeInTheDocument()
  })

  it('すべてのセリフが表示される（フィルターなし）', () => {
    render(<ScriptList files={sampleFiles} selectedCharacters={new Set()} />)

    expect(screen.getByText('こんにちは')).toBeInTheDocument()
    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
    expect(screen.getByText('おはよう')).toBeInTheDocument()
    expect(screen.getByText('おはよう！')).toBeInTheDocument()
  })

  it('フィルター適用時は選択されたキャラクターのセリフのみ表示', () => {
    const selectedCharacters = new Set(['太郎'])

    render(<ScriptList files={sampleFiles} selectedCharacters={selectedCharacters} />)

    // 太郎のセリフは表示
    expect(screen.getByText('こんにちは')).toBeInTheDocument()
    expect(screen.getByText('おはよう！')).toBeInTheDocument()
    // 他のキャラクターのセリフは非表示
    expect(screen.queryByText('こんにちは！')).not.toBeInTheDocument()
    expect(screen.queryByText('おはよう')).not.toBeInTheDocument()
  })
})
