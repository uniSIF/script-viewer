import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('ダークモード時に太陽アイコンを表示する', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle resolvedTheme="dark" onToggle={onToggle} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'ライトモードに切り替え')
  })

  it('ライトモード時に月アイコンを表示する', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle resolvedTheme="light" onToggle={onToggle} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'ダークモードに切り替え')
  })

  it('クリック時にonToggleが呼ばれる', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle resolvedTheme="dark" onToggle={onToggle} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
