import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropZone } from './DropZone'
import type { ScriptFile, FileLoadError } from '../types'

describe('DropZone', () => {
  const createMockFile = (name: string, content: string): File => {
    return new File([content], name, { type: 'application/json' })
  }

  describe('ファイル選択ダイアログ', () => {
    it('ファイル選択ボタンが表示される', () => {
      render(<DropZone onFilesLoaded={vi.fn()} onError={vi.fn()} />)
      expect(screen.getByRole('button', { name: /ファイルを選択/i })).toBeInTheDocument()
    })

    it('複数ファイル選択が有効になっている', () => {
      render(<DropZone onFilesLoaded={vi.fn()} onError={vi.fn()} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input).toHaveAttribute('multiple')
    })

    it('JSONファイルのフィルターが設定されている', () => {
      render(<DropZone onFilesLoaded={vi.fn()} onError={vi.fn()} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input).toHaveAttribute('accept', '.json,application/json')
    })

    it('有効なJSONファイルを選択すると onFilesLoaded が呼ばれる', async () => {
      const onFilesLoaded = vi.fn()
      const onError = vi.fn()
      render(<DropZone onFilesLoaded={onFilesLoaded} onError={onError} />)

      const validJson = JSON.stringify([
        { character: 'Alice', text: 'Hello!' },
        { character: 'Bob', text: 'Hi there!' },
      ])
      const file = createMockFile('test.json', validJson)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(onFilesLoaded).toHaveBeenCalledWith([
          {
            fileName: 'test.json',
            dialogues: [
              { character: 'Alice', text: 'Hello!' },
              { character: 'Bob', text: 'Hi there!' },
            ],
          },
        ])
      })
    })

    it('複数のJSONファイルを選択すると すべてのファイルが処理される', async () => {
      const onFilesLoaded = vi.fn()
      const onError = vi.fn()
      render(<DropZone onFilesLoaded={onFilesLoaded} onError={onError} />)

      const json1 = JSON.stringify([{ character: 'Alice', text: 'Hello!' }])
      const json2 = JSON.stringify([{ character: 'Bob', text: 'Hi!' }])
      const file1 = createMockFile('file1.json', json1)
      const file2 = createMockFile('file2.json', json2)

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, [file1, file2])

      await waitFor(() => {
        expect(onFilesLoaded).toHaveBeenCalled()
        const loadedFiles = onFilesLoaded.mock.calls[0][0] as ScriptFile[]
        expect(loadedFiles).toHaveLength(2)
      })
    })

    it('非JSONファイルが選択された場合は onError が呼ばれる', async () => {
      const onFilesLoaded = vi.fn()
      const onError = vi.fn()
      render(<DropZone onFilesLoaded={onFilesLoaded} onError={onError} />)

      const file = new File(['not json content'], 'test.txt', { type: 'text/plain' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      // userEvent.uploadはaccept属性を尊重するため、fireEventを使用
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })
      fireEvent.change(input)

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
        const errors = onError.mock.calls[0][0] as FileLoadError[]
        expect(errors[0].error).toContain('JSONファイルを選択してください')
      })
    })

    it('不正なJSON構文のファイルが選択された場合は onError が呼ばれる', async () => {
      const onFilesLoaded = vi.fn()
      const onError = vi.fn()
      render(<DropZone onFilesLoaded={onFilesLoaded} onError={onError} />)

      const file = createMockFile('invalid.json', '{ invalid json }')
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
        const errors = onError.mock.calls[0][0] as FileLoadError[]
        expect(errors[0].fileName).toBe('invalid.json')
      })
    })
  })

  describe('ドラッグ&ドロップ', () => {
    // CSS Modulesのクラス名にはハッシュが付与されるため、部分一致でテスト
    const hasDragOverClass = (element: HTMLElement): boolean => {
      return Array.from(element.classList).some((cls) => cls.includes('dragOver'))
    }

    // jsdom環境用のDataTransferモック
    const createMockDataTransfer = (files: File[]): { files: FileList } => {
      const fileList = {
        length: files.length,
        item: (index: number) => files[index] ?? null,
        [Symbol.iterator]: function* () {
          for (let i = 0; i < files.length; i++) {
            yield files[i]
          }
        },
      } as unknown as FileList

      // インデックスアクセスを追加
      files.forEach((file, index) => {
        Object.defineProperty(fileList, index, { value: file })
      })

      return { files: fileList }
    }

    it('ドロップエリアが表示される', () => {
      render(<DropZone onFilesLoaded={vi.fn()} onError={vi.fn()} />)
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument()
    })

    it('ドラッグオーバー時に視覚的フィードバックが表示される', () => {
      render(<DropZone onFilesLoaded={vi.fn()} onError={vi.fn()} />)
      const dropZone = screen.getByTestId('drop-zone')

      fireEvent.dragOver(dropZone)
      expect(hasDragOverClass(dropZone)).toBe(true)
    })

    it('ドラッグリーブ時に視覚的フィードバックが消える', () => {
      render(<DropZone onFilesLoaded={vi.fn()} onError={vi.fn()} />)
      const dropZone = screen.getByTestId('drop-zone')

      fireEvent.dragOver(dropZone)
      expect(hasDragOverClass(dropZone)).toBe(true)

      fireEvent.dragLeave(dropZone)
      expect(hasDragOverClass(dropZone)).toBe(false)
    })

    it('有効なJSONファイルをドロップすると onFilesLoaded が呼ばれる', async () => {
      const onFilesLoaded = vi.fn()
      const onError = vi.fn()
      render(<DropZone onFilesLoaded={onFilesLoaded} onError={onError} />)

      const validJson = JSON.stringify([
        { character: 'Alice', text: 'Hello!' },
      ])
      const file = new File([validJson], 'test.json', { type: 'application/json' })
      const dataTransfer = createMockDataTransfer([file])

      const dropZone = screen.getByTestId('drop-zone')
      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(onFilesLoaded).toHaveBeenCalledWith([
          {
            fileName: 'test.json',
            dialogues: [{ character: 'Alice', text: 'Hello!' }],
          },
        ])
      })
    })

    it('複数ファイルをドロップするとすべてが処理される', async () => {
      const onFilesLoaded = vi.fn()
      const onError = vi.fn()
      render(<DropZone onFilesLoaded={onFilesLoaded} onError={onError} />)

      const json1 = JSON.stringify([{ character: 'Alice', text: 'Hello!' }])
      const json2 = JSON.stringify([{ character: 'Bob', text: 'Hi!' }])
      const file1 = new File([json1], 'file1.json', { type: 'application/json' })
      const file2 = new File([json2], 'file2.json', { type: 'application/json' })
      const dataTransfer = createMockDataTransfer([file1, file2])

      const dropZone = screen.getByTestId('drop-zone')
      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(onFilesLoaded).toHaveBeenCalled()
        const loadedFiles = onFilesLoaded.mock.calls[0][0] as ScriptFile[]
        expect(loadedFiles).toHaveLength(2)
      })
    })

    it('ドロップ後にドラッグオーバー状態がリセットされる', async () => {
      render(<DropZone onFilesLoaded={vi.fn()} onError={vi.fn()} />)
      const dropZone = screen.getByTestId('drop-zone')

      const validJson = JSON.stringify([{ character: 'Alice', text: 'Hello!' }])
      const file = new File([validJson], 'test.json', { type: 'application/json' })
      const dataTransfer = createMockDataTransfer([file])

      fireEvent.dragOver(dropZone)
      expect(hasDragOverClass(dropZone)).toBe(true)

      fireEvent.drop(dropZone, { dataTransfer })
      expect(hasDragOverClass(dropZone)).toBe(false)
    })
  })
})
