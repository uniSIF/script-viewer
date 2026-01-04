import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

// File APIモック
const createMockFile = (name: string, content: string): File => {
  const blob = new Blob([content], { type: 'application/json' })
  return new File([blob], name, { type: 'application/json' })
}

describe('App', () => {
  describe('レイアウト構成', () => {
    it('アプリケーションタイトルが表示される', () => {
      render(<App />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Script Viewer')
    })

    it('ファイル入力エリア（DropZone）が表示される', () => {
      render(<App />)
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument()
    })

    it('ファイル未読み込み時はフィルターパネルが表示されない', () => {
      render(<App />)
      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument()
    })

    it('ファイル未読み込み時はセリフ一覧が表示されない', () => {
      render(<App />)
      expect(screen.queryByText('セリフがありません')).not.toBeInTheDocument()
    })
  })

  describe('状態連携', () => {
    it('ファイル読み込み後にフィルターパネルが表示される', async () => {
      render(<App />)

      const jsonContent = JSON.stringify([
        { character: 'キャラA', text: 'こんにちは' },
        { character: 'キャラB', text: 'おはよう' },
      ])
      const file = createMockFile('test.json', jsonContent)

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!
      Object.defineProperty(input, 'files', {
        value: [file],
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByTestId('filter-panel')).toBeInTheDocument()
      })
    })

    it('ファイル読み込み後にセリフ一覧が表示される', async () => {
      render(<App />)

      const jsonContent = JSON.stringify([
        { character: 'キャラA', text: 'こんにちは' },
      ])
      const file = createMockFile('test.json', jsonContent)

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!
      Object.defineProperty(input, 'files', {
        value: [file],
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByText('こんにちは')).toBeInTheDocument()
      })
    })

    it('キャラクターフィルターを選択するとセリフがフィルタリングされる', async () => {
      render(<App />)

      const jsonContent = JSON.stringify([
        { character: 'キャラA', text: 'セリフA' },
        { character: 'キャラB', text: 'セリフB' },
      ])
      const file = createMockFile('test.json', jsonContent)

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!
      Object.defineProperty(input, 'files', {
        value: [file],
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByText('セリフA')).toBeInTheDocument()
        expect(screen.getByText('セリフB')).toBeInTheDocument()
      })

      // キャラAのフィルターボタンをクリック
      const characterButton = screen.getByRole('button', { name: 'キャラA' })
      fireEvent.click(characterButton)

      await waitFor(() => {
        expect(screen.getByText('セリフA')).toBeInTheDocument()
        expect(screen.queryByText('セリフB')).not.toBeInTheDocument()
      })
    })

    it('複数ファイルを読み込むと追加される', async () => {
      render(<App />)

      const jsonContent1 = JSON.stringify([
        { character: 'キャラA', text: 'ファイル1のセリフ' },
      ])
      const jsonContent2 = JSON.stringify([
        { character: 'キャラB', text: 'ファイル2のセリフ' },
      ])
      const file1 = createMockFile('file1.json', jsonContent1)
      const file2 = createMockFile('file2.json', jsonContent2)

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!

      // 1つ目のファイル
      Object.defineProperty(input, 'files', { value: [file1], configurable: true })
      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByText('ファイル1のセリフ')).toBeInTheDocument()
      })

      // 2つ目のファイル
      Object.defineProperty(input, 'files', { value: [file2], configurable: true })
      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByText('ファイル1のセリフ')).toBeInTheDocument()
        expect(screen.getByText('ファイル2のセリフ')).toBeInTheDocument()
      })
    })

    it('エラー発生時にエラーリストが表示される', async () => {
      render(<App />)

      const file = createMockFile('invalid.json', 'invalid json')

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!
      Object.defineProperty(input, 'files', { value: [file] })

      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText(/invalid.json/)).toBeInTheDocument()
      })
    })

    it('エラーリストを閉じることができる', async () => {
      render(<App />)

      const file = createMockFile('invalid.json', 'invalid json')

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!
      Object.defineProperty(input, 'files', { value: [file] })

      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      const dismissButton = screen.getByRole('button', { name: '閉じる' })
      fireEvent.click(dismissButton)

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('E2Eシナリオ', () => {
    it('ファイル選択からセリフ表示までの一連フロー', async () => {
      render(<App />)

      // 初期状態確認
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Script Viewer')
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument()
      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument()

      // ファイル選択
      const jsonContent = JSON.stringify([
        { character: '主人公', text: 'はじめまして' },
        { character: 'ヒロイン', text: 'よろしくお願いします' },
        { character: '主人公', text: 'こちらこそ' },
      ])
      const file = createMockFile('chapter1.json', jsonContent)

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!
      Object.defineProperty(input, 'files', { value: [file] })
      fireEvent.change(input)

      // セリフ表示確認
      await waitFor(() => {
        expect(screen.getByText('はじめまして')).toBeInTheDocument()
        expect(screen.getByText('よろしくお願いします')).toBeInTheDocument()
        expect(screen.getByText('こちらこそ')).toBeInTheDocument()
      })

      // ファイル名がセクション見出しとして表示
      expect(screen.getByText('chapter1.json')).toBeInTheDocument()

      // キャラクター名が表示
      expect(screen.getAllByText('主人公').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('ヒロイン').length).toBeGreaterThanOrEqual(1)

      // フィルターパネルが表示
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument()
    })

    it('ドラッグ&ドロップからセリフ表示までの一連フロー', async () => {
      render(<App />)

      const jsonContent = JSON.stringify([
        { character: 'キャラクター1', text: 'D&Dテスト' },
      ])
      const file = createMockFile('drop-test.json', jsonContent)

      const dropZone = screen.getByTestId('drop-zone')

      // ドロップイベントをシミュレート
      const dataTransfer = {
        files: [file],
        types: ['Files'],
      }

      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(screen.getByText('D&Dテスト')).toBeInTheDocument()
        expect(screen.getByText('drop-test.json')).toBeInTheDocument()
      })
    })

    it('キャラクターフィルターの完全なフロー', async () => {
      render(<App />)

      const jsonContent = JSON.stringify([
        { character: 'アリス', text: 'アリスのセリフ1' },
        { character: 'ボブ', text: 'ボブのセリフ1' },
        { character: 'アリス', text: 'アリスのセリフ2' },
        { character: 'チャーリー', text: 'チャーリーのセリフ1' },
      ])
      const file = createMockFile('test.json', jsonContent)

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!
      Object.defineProperty(input, 'files', { value: [file] })
      fireEvent.change(input)

      // 全セリフが表示される
      await waitFor(() => {
        expect(screen.getByText('アリスのセリフ1')).toBeInTheDocument()
        expect(screen.getByText('ボブのセリフ1')).toBeInTheDocument()
        expect(screen.getByText('アリスのセリフ2')).toBeInTheDocument()
        expect(screen.getByText('チャーリーのセリフ1')).toBeInTheDocument()
      })

      // アリスでフィルター
      fireEvent.click(screen.getByRole('button', { name: 'アリス' }))
      await waitFor(() => {
        expect(screen.getByText('アリスのセリフ1')).toBeInTheDocument()
        expect(screen.getByText('アリスのセリフ2')).toBeInTheDocument()
        expect(screen.queryByText('ボブのセリフ1')).not.toBeInTheDocument()
        expect(screen.queryByText('チャーリーのセリフ1')).not.toBeInTheDocument()
      })

      // フィルター適用中インジケーター
      expect(screen.getByTestId('filter-indicator')).toBeInTheDocument()

      // ボブも追加選択
      fireEvent.click(screen.getByRole('button', { name: 'ボブ' }))
      await waitFor(() => {
        expect(screen.getByText('アリスのセリフ1')).toBeInTheDocument()
        expect(screen.getByText('ボブのセリフ1')).toBeInTheDocument()
        expect(screen.queryByText('チャーリーのセリフ1')).not.toBeInTheDocument()
      })

      // フィルタークリア
      fireEvent.click(screen.getByTestId('clear-filter-button'))
      await waitFor(() => {
        expect(screen.getByText('アリスのセリフ1')).toBeInTheDocument()
        expect(screen.getByText('ボブのセリフ1')).toBeInTheDocument()
        expect(screen.getByText('チャーリーのセリフ1')).toBeInTheDocument()
      })
    })

    it('複数ファイル読み込み時の動作', async () => {
      render(<App />)

      const jsonContent1 = JSON.stringify([
        { character: 'キャラ1', text: 'チャプター1セリフ' },
      ])
      const jsonContent2 = JSON.stringify([
        { character: 'キャラ2', text: 'チャプター2セリフ' },
      ])

      const input = screen.getByTestId('drop-zone').querySelector('input[type="file"]')!

      // 1つ目のファイル
      const file1 = createMockFile('chapter1.json', jsonContent1)
      Object.defineProperty(input, 'files', { value: [file1], configurable: true })
      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByText('chapter1.json')).toBeInTheDocument()
        expect(screen.getByText('チャプター1セリフ')).toBeInTheDocument()
      })

      // 2つ目のファイル
      const file2 = createMockFile('chapter2.json', jsonContent2)
      Object.defineProperty(input, 'files', { value: [file2], configurable: true })
      fireEvent.change(input)

      await waitFor(() => {
        // 両方のファイルセクションが表示
        expect(screen.getByText('chapter1.json')).toBeInTheDocument()
        expect(screen.getByText('chapter2.json')).toBeInTheDocument()
        expect(screen.getByText('チャプター1セリフ')).toBeInTheDocument()
        expect(screen.getByText('チャプター2セリフ')).toBeInTheDocument()
      })

      // 両方のキャラクターがフィルターに表示
      expect(screen.getByRole('button', { name: 'キャラ1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'キャラ2' })).toBeInTheDocument()
    })

    it('エラー発生時の動作（成功ファイルと混在）', async () => {
      render(<App />)

      const validContent = JSON.stringify([
        { character: 'キャラ', text: '正常なセリフ' },
      ])
      const validFile = createMockFile('valid.json', validContent)
      const invalidFile = createMockFile('invalid.json', 'not json')

      const dropZone = screen.getByTestId('drop-zone')

      const dataTransfer = {
        files: [validFile, invalidFile],
        types: ['Files'],
      }

      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        // 正常なファイルは表示される
        expect(screen.getByText('正常なセリフ')).toBeInTheDocument()
        // エラーも表示される
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText(/invalid.json/)).toBeInTheDocument()
      })
    })
  })
})
