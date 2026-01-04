import type { Dialogue, ParseResult } from '../types'

/**
 * JSONテキストを解析してDialogue配列に変換する
 * @param jsonText JSON形式の文字列
 * @returns ParseResult（成功時はダイアログ配列、失敗時はエラーメッセージ）
 */
export function parseJson(jsonText: string): ParseResult {
  try {
    const parsed = JSON.parse(jsonText)

    // 配列でない場合はエラー
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        error: 'JSONは配列形式である必要があります',
      }
    }

    const dialogues: Dialogue[] = []

    for (const item of parsed) {
      // オブジェクトでない場合はスキップ
      if (typeof item !== 'object' || item === null) {
        continue
      }

      // textフィールドがない場合はスキップ
      if (typeof item.text !== 'string') {
        continue
      }

      // characterフィールドがない場合は「不明」を設定
      const character = typeof item.character === 'string' ? item.character : '不明'

      dialogues.push({
        character,
        text: item.text,
      })
    }

    return {
      success: true,
      dialogues,
    }
  } catch {
    return {
      success: false,
      error: 'JSONの解析に失敗しました',
    }
  }
}
