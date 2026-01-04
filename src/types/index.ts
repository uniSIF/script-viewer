/**
 * 個別のセリフデータ
 */
export interface Dialogue {
  character: string
  text: string
}

/**
 * JSONファイル単位のセリフデータ集合
 */
export interface ScriptFile {
  fileName: string
  dialogues: Dialogue[]
}

/**
 * JSON解析成功結果
 */
export interface ParseSuccess {
  success: true
  dialogues: Dialogue[]
}

/**
 * JSON解析エラー結果
 */
export interface ParseError {
  success: false
  error: string
}

/**
 * JSON解析結果（成功または失敗）
 */
export type ParseResult = ParseSuccess | ParseError

/**
 * ファイル読み込み成功結果
 */
export interface FileLoadSuccess {
  success: true
  file: ScriptFile
}

/**
 * ファイル読み込みエラー結果
 */
export interface FileLoadError {
  success: false
  fileName: string
  error: string
}

/**
 * ファイル読み込み結果（成功または失敗）
 */
export type FileLoadResult = FileLoadSuccess | FileLoadError

/**
 * アプリケーション状態
 */
export interface AppState {
  files: ScriptFile[]
  selectedCharacters: Set<string>
  errors: FileLoadError[]
}
