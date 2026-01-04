import { useState, useEffect, useCallback } from 'react'

// テーマの型定義
export type Theme = 'light' | 'dark' | 'system'

// 実際に適用されるテーマ（light または dark）
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'script-viewer-theme'

/**
 * OSのカラースキーム設定を取得する
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * テーマをHTMLに適用する
 */
function applyTheme(resolvedTheme: ResolvedTheme): void {
  document.documentElement.setAttribute('data-theme', resolvedTheme)
}

/**
 * テーマ管理用のカスタムフック
 * - light/dark/systemの3つのモードをサポート
 * - localStorageに保存して永続化
 * - systemモードの場合はOSの設定に従う
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    return saved || 'system'
  })

  // 実際に適用されるテーマを計算
  const resolvedTheme: ResolvedTheme = theme === 'system' ? getSystemTheme() : theme

  // テーマを設定する関数
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }, [])

  // テーマを切り替える関数（light <-> dark）
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  // テーマをHTMLに適用
  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  // OSのカラースキーム変更を監視（systemモードの場合）
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applyTheme(getSystemTheme())
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }
}
