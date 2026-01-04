import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
  }

  const matchMediaMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock)
    vi.stubGlobal('matchMedia', matchMediaMock)
    localStorageMock.getItem.mockReturnValue(null)
    matchMediaMock.mockReturnValue({
      matches: true, // ダークモード
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('初期状態でsystemテーマを返す', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('system')
  })

  it('localStorageに保存されたテーマを読み込む', () => {
    localStorageMock.getItem.mockReturnValue('light')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(result.current.resolvedTheme).toBe('light')
  })

  it('toggleThemeでテーマを切り替える', () => {
    const { result } = renderHook(() => useTheme())

    // 初期状態はsystem（OS設定に従う、今回はdark）
    expect(result.current.resolvedTheme).toBe('dark')

    // トグルでlightに
    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
    expect(result.current.resolvedTheme).toBe('light')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('script-viewer-theme', 'light')
  })

  it('setThemeでテーマを設定する', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('script-viewer-theme', 'dark')
  })

  it('HTMLにdata-theme属性を設定する', () => {
    renderHook(() => useTheme())

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
