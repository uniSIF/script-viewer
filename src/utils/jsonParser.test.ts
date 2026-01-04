import { describe, it, expect } from 'vitest'
import { parseJson } from './jsonParser'

describe('parseJson', () => {
  describe('正常なJSONの解析', () => {
    it('正常なセリフ配列を解析できる', () => {
      const json = JSON.stringify([
        { character: 'キャラA', text: 'こんにちは' },
        { character: 'キャラB', text: 'やあ' },
      ])

      const result = parseJson(json)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.dialogues).toHaveLength(2)
        expect(result.dialogues[0]).toEqual({ character: 'キャラA', text: 'こんにちは' })
        expect(result.dialogues[1]).toEqual({ character: 'キャラB', text: 'やあ' })
      }
    })

    it('キャラクター名が欠落している場合は「不明」を設定する', () => {
      const json = JSON.stringify([
        { text: 'セリフ1' },
        { character: 'キャラA', text: 'セリフ2' },
      ])

      const result = parseJson(json)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.dialogues).toHaveLength(2)
        expect(result.dialogues[0].character).toBe('不明')
        expect(result.dialogues[0].text).toBe('セリフ1')
      }
    })

    it('テキストが欠落しているオブジェクトはスキップする', () => {
      const json = JSON.stringify([
        { character: 'キャラA' },
        { character: 'キャラB', text: 'セリフ' },
        { character: 'キャラC' },
      ])

      const result = parseJson(json)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.dialogues).toHaveLength(1)
        expect(result.dialogues[0].character).toBe('キャラB')
      }
    })

    it('空の配列を正常に処理する', () => {
      const json = JSON.stringify([])

      const result = parseJson(json)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.dialogues).toHaveLength(0)
      }
    })
  })

  describe('追加のフィールドの処理', () => {
    it('追加フィールドがあっても正常に解析する', () => {
      const json = JSON.stringify([
        { character: 'キャラA', text: 'セリフ', emotion: 'happy', id: 1 },
      ])

      const result = parseJson(json)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.dialogues[0]).toEqual({ character: 'キャラA', text: 'セリフ' })
      }
    })
  })

  describe('エラーハンドリング', () => {
    it('不正なJSON構文でエラーを返す', () => {
      const invalidJson = '{ invalid json }'

      const result = parseJson(invalidJson)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('JSONの解析に失敗しました')
      }
    })

    it('配列以外のデータ構造でエラーを返す', () => {
      const objectJson = JSON.stringify({ character: 'キャラA', text: 'セリフ' })

      const result = parseJson(objectJson)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('JSONは配列形式である必要があります')
      }
    })

    it('文字列のJSONでエラーを返す', () => {
      const stringJson = JSON.stringify('これは文字列です')

      const result = parseJson(stringJson)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('JSONは配列形式である必要があります')
      }
    })

    it('数値のJSONでエラーを返す', () => {
      const numberJson = JSON.stringify(123)

      const result = parseJson(numberJson)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('JSONは配列形式である必要があります')
      }
    })

    it('nullのJSONでエラーを返す', () => {
      const nullJson = JSON.stringify(null)

      const result = parseJson(nullJson)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('JSONは配列形式である必要があります')
      }
    })
  })
})
