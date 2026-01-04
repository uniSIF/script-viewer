import { describe, it, expect } from 'vitest'
import type { Dialogue, ScriptFile, ParseSuccess, ParseError, ParseResult, FileLoadSuccess, FileLoadError, FileLoadResult } from './index'

describe('Type definitions', () => {
  describe('Dialogue', () => {
    it('should have character and text properties', () => {
      const dialogue: Dialogue = {
        character: 'キャラA',
        text: 'こんにちは',
      }
      expect(dialogue.character).toBe('キャラA')
      expect(dialogue.text).toBe('こんにちは')
    })
  })

  describe('ScriptFile', () => {
    it('should have fileName and dialogues properties', () => {
      const scriptFile: ScriptFile = {
        fileName: 'scene1.json',
        dialogues: [
          { character: 'キャラA', text: 'セリフ1' },
          { character: 'キャラB', text: 'セリフ2' },
        ],
      }
      expect(scriptFile.fileName).toBe('scene1.json')
      expect(scriptFile.dialogues).toHaveLength(2)
    })
  })

  describe('ParseResult', () => {
    it('should represent success with dialogues', () => {
      const success: ParseSuccess = {
        success: true,
        dialogues: [{ character: 'キャラA', text: 'セリフ' }],
      }
      expect(success.success).toBe(true)
      expect(success.dialogues).toHaveLength(1)
    })

    it('should represent error with message', () => {
      const error: ParseError = {
        success: false,
        error: 'JSONの解析に失敗しました',
      }
      expect(error.success).toBe(false)
      expect(error.error).toBe('JSONの解析に失敗しました')
    })

    it('should be a union type', () => {
      const result: ParseResult = { success: true, dialogues: [] }
      if (result.success) {
        expect(result.dialogues).toBeDefined()
      }
    })
  })

  describe('FileLoadResult', () => {
    it('should represent success with ScriptFile', () => {
      const success: FileLoadSuccess = {
        success: true,
        file: {
          fileName: 'test.json',
          dialogues: [],
        },
      }
      expect(success.success).toBe(true)
      expect(success.file.fileName).toBe('test.json')
    })

    it('should represent error with fileName and message', () => {
      const error: FileLoadError = {
        success: false,
        fileName: 'invalid.json',
        error: 'ファイルの読み込みに失敗しました',
      }
      expect(error.success).toBe(false)
      expect(error.fileName).toBe('invalid.json')
      expect(error.error).toBe('ファイルの読み込みに失敗しました')
    })

    it('should be a union type', () => {
      const result: FileLoadResult = {
        success: true,
        file: { fileName: 'test.json', dialogues: [] },
      }
      if (result.success) {
        expect(result.file).toBeDefined()
      }
    })
  })
})
