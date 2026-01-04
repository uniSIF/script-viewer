import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterPanel } from './FilterPanel'

describe('FilterPanel', () => {
  describe('キャラクター一覧の表示', () => {
    it('キャラクター一覧がフィルターUIに表示される', () => {
      const characters = ['太郎', '花子', '次郎']
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set()}
          onSelectionChange={() => {}}
        />
      )

      expect(screen.getByText('太郎')).toBeInTheDocument()
      expect(screen.getByText('花子')).toBeInTheDocument()
      expect(screen.getByText('次郎')).toBeInTheDocument()
    })

    it('キャラクターがいない場合は空のリストを表示する', () => {
      render(
        <FilterPanel
          characters={[]}
          selectedCharacters={new Set()}
          onSelectionChange={() => {}}
        />
      )

      // キャラクターがいない場合でもFilterPanelはレンダリングされる
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument()
    })

    it('キャラクターが登場順で表示される', () => {
      const characters = ['花子', '太郎', '次郎']
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set()}
          onSelectionChange={() => {}}
        />
      )

      // 渡された順序（登場順）で表示
      const buttons = screen.getAllByRole('button')
      // フィルタークリアボタン以外のボタン
      const characterButtons = buttons.filter((btn) =>
        characters.includes(btn.textContent || '')
      )
      expect(characterButtons[0].textContent).toBe('花子')
      expect(characterButtons[1].textContent).toBe('太郎')
      expect(characterButtons[2].textContent).toBe('次郎')
    })
  })

  describe('キャラクター選択によるフィルタリング', () => {
    it('キャラクターをクリックすると選択状態が変わる', async () => {
      const user = userEvent.setup()
      const characters = ['太郎', '花子']
      const onSelectionChange = vi.fn()
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set()}
          onSelectionChange={onSelectionChange}
        />
      )

      await user.click(screen.getByText('太郎'))

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['太郎']))
    })

    it('選択済みのキャラクターをクリックすると選択が解除される', async () => {
      const user = userEvent.setup()
      const characters = ['太郎', '花子']
      const onSelectionChange = vi.fn()
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set(['太郎'])}
          onSelectionChange={onSelectionChange}
        />
      )

      await user.click(screen.getByText('太郎'))

      expect(onSelectionChange).toHaveBeenCalledWith(new Set())
    })

    it('複数のキャラクターを選択できる', async () => {
      const user = userEvent.setup()
      const characters = ['太郎', '花子', '次郎']
      const onSelectionChange = vi.fn()
      const { rerender } = render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set()}
          onSelectionChange={onSelectionChange}
        />
      )

      // 最初の選択
      await user.click(screen.getByText('太郎'))
      expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['太郎']))

      // 状態を更新して再レンダリング
      rerender(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set(['太郎'])}
          onSelectionChange={onSelectionChange}
        />
      )

      // 2つ目の選択
      await user.click(screen.getByText('花子'))
      expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['太郎', '花子']))
    })

    it('フィルター未選択時はすべてのセリフが表示対象となる', () => {
      const characters = ['太郎', '花子']
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set()}
          onSelectionChange={() => {}}
        />
      )

      // 空のSetが渡されている = フィルターなし
      // 選択状態のボタンがないことを確認
      const buttons = screen.getAllByRole('button')
      const characterButtons = buttons.filter((btn) =>
        characters.includes(btn.textContent || '')
      )
      characterButtons.forEach((btn) => {
        expect(btn).not.toHaveAttribute('data-selected', 'true')
      })
    })
  })

  describe('フィルター状態の視覚的表示', () => {
    it('選択中のキャラクターが視覚的に強調される', () => {
      const characters = ['太郎', '花子', '次郎']
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set(['太郎', '次郎'])}
          onSelectionChange={() => {}}
        />
      )

      const taroButton = screen.getByText('太郎')
      const hanakoButton = screen.getByText('花子')
      const jiroButton = screen.getByText('次郎')

      expect(taroButton).toHaveAttribute('data-selected', 'true')
      expect(hanakoButton).not.toHaveAttribute('data-selected', 'true')
      expect(jiroButton).toHaveAttribute('data-selected', 'true')
    })

    it('フィルター適用中であることを示すインジケーターが表示される', () => {
      const characters = ['太郎', '花子']
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set(['太郎'])}
          onSelectionChange={() => {}}
        />
      )

      expect(screen.getByTestId('filter-indicator')).toBeInTheDocument()
    })

    it('フィルター未適用時はインジケーターが表示されない', () => {
      const characters = ['太郎', '花子']
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set()}
          onSelectionChange={() => {}}
        />
      )

      expect(screen.queryByTestId('filter-indicator')).not.toBeInTheDocument()
    })

    it('フィルタークリアボタンでフィルターを解除できる', async () => {
      const user = userEvent.setup()
      const characters = ['太郎', '花子']
      const onSelectionChange = vi.fn()
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set(['太郎', '花子'])}
          onSelectionChange={onSelectionChange}
        />
      )

      await user.click(screen.getByTestId('clear-filter-button'))

      expect(onSelectionChange).toHaveBeenCalledWith(new Set())
    })

    it('フィルター未適用時はクリアボタンが表示されない', () => {
      const characters = ['太郎', '花子']
      render(
        <FilterPanel
          characters={characters}
          selectedCharacters={new Set()}
          onSelectionChange={() => {}}
        />
      )

      expect(screen.queryByTestId('clear-filter-button')).not.toBeInTheDocument()
    })
  })
})
