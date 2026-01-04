import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorList } from './ErrorList'
import type { FileLoadError } from '../types'

describe('ErrorList', () => {
  const createErrors = (): FileLoadError[] => [
    { success: false, fileName: 'file1.json', error: 'JSONの解析に失敗しました' },
    { success: false, fileName: 'file2.json', error: 'JSONファイルを選択してください' },
  ]

  it('エラーがない場合は何も表示しない', () => {
    const { container } = render(<ErrorList errors={[]} onDismiss={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('エラーメッセージを表示する', () => {
    const errors = createErrors()
    render(<ErrorList errors={errors} onDismiss={vi.fn()} />)

    expect(screen.getByText('file1.json')).toBeInTheDocument()
    expect(screen.getByText(/JSONの解析に失敗しました/)).toBeInTheDocument()
    expect(screen.getByText('file2.json')).toBeInTheDocument()
    expect(screen.getByText(/JSONファイルを選択してください/)).toBeInTheDocument()
  })

  it('閉じるボタンをクリックするとonDismissが呼ばれる', () => {
    const errors = createErrors()
    const onDismiss = vi.fn()
    render(<ErrorList errors={errors} onDismiss={onDismiss} />)

    const dismissButton = screen.getByRole('button', { name: /閉じる/i })
    fireEvent.click(dismissButton)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('エラー数を表示する', () => {
    const errors = createErrors()
    render(<ErrorList errors={errors} onDismiss={vi.fn()} />)

    expect(screen.getByText(/2件のエラー/)).toBeInTheDocument()
  })
})
