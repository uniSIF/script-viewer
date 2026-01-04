import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScriptItem } from './ScriptItem'
import type { Dialogue } from '../types'

describe('ScriptItem', () => {
  it('キャラクター名とセリフテキストを表示する', () => {
    const dialogue: Dialogue = {
      character: '太郎',
      text: 'こんにちは！',
    }

    render(<ScriptItem dialogue={dialogue} />)

    expect(screen.getByText('太郎')).toBeInTheDocument()
    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
  })

  it('キャラクター名とセリフを視覚的に区別できるスタイルを適用する', () => {
    const dialogue: Dialogue = {
      character: '花子',
      text: 'ありがとう',
    }

    render(<ScriptItem dialogue={dialogue} />)

    const characterElement = screen.getByText('花子')
    const textElement = screen.getByText('ありがとう')

    // キャラクター名とセリフが異なるクラスを持つことを確認
    expect(characterElement.className).not.toBe(textElement.className)
  })

  it('長いセリフテキストも正しく表示する', () => {
    const longText = 'これはとても長いセリフです。'.repeat(10)
    const dialogue: Dialogue = {
      character: 'キャラクター',
      text: longText,
    }

    render(<ScriptItem dialogue={dialogue} />)

    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it('「不明」キャラクターのセリフも表示できる', () => {
    const dialogue: Dialogue = {
      character: '不明',
      text: '誰かのセリフ',
    }

    render(<ScriptItem dialogue={dialogue} />)

    expect(screen.getByText('不明')).toBeInTheDocument()
    expect(screen.getByText('誰かのセリフ')).toBeInTheDocument()
  })
})
