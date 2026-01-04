# Requirements Document

## Introduction
ゲームのキャラクターのセリフを一覧表示するWebアプリケーション。複数のJSONファイルを入力として受け付け、キャラクター名とセリフを時系列順に表示する。JSONファイルは`{"character": キャラクター名, "text": "セリフ"}`形式のオブジェクト配列で構成される。

## Requirements

### Requirement 1: JSONファイル入力
**Objective:** As a ユーザー, I want 複数のJSONファイルをアプリに読み込ませたい, so that ゲームのセリフデータを表示できる

#### Acceptance Criteria
1. When ユーザーがファイル選択ダイアログでJSONファイルを選択した場合, the Script Viewer shall ファイルを読み込みセリフデータとして解析する
2. When ユーザーが複数のJSONファイルを選択した場合, the Script Viewer shall すべてのファイルを順次読み込み統合する
3. When ユーザーがドラッグ＆ドロップでJSONファイルを投入した場合, the Script Viewer shall ファイルを読み込みセリフデータとして解析する
4. If 選択されたファイルがJSON形式でない場合, the Script Viewer shall エラーメッセージを表示しファイルを読み込まない
5. If JSONファイルの構造が不正な場合, the Script Viewer shall エラーメッセージを表示し該当ファイルをスキップする

### Requirement 2: セリフデータ表示
**Objective:** As a ユーザー, I want セリフとキャラクター名を時系列順に閲覧したい, so that ゲームのストーリーを追うことができる

#### Acceptance Criteria
1. When JSONファイルが読み込まれた場合, the Script Viewer shall セリフを時系列順（配列順）に表示する
2. The Script Viewer shall 各セリフにキャラクター名を併記する
3. The Script Viewer shall 複数ファイルのセリフを読み込み順に連結して表示する
4. While セリフが表示されている間, the Script Viewer shall スクロールによる全セリフの閲覧を可能にする
5. The Script Viewer shall ファイルごとにセクションを分けてセリフ一覧を表示する
6. The Script Viewer shall 各セクションにファイル名を見出しとして表示する

### Requirement 3: データ形式サポート
**Objective:** As a ユーザー, I want 指定されたJSON形式のファイルを正しく解析してほしい, so that セリフデータが正確に表示される

#### Acceptance Criteria
1. The Script Viewer shall `{"character": string, "text": string}` 形式のオブジェクト配列を解析できる
2. When `character`フィールドが欠落したオブジェクトがある場合, the Script Viewer shall キャラクター名を「不明」として表示する
3. When `text`フィールドが欠落したオブジェクトがある場合, the Script Viewer shall 該当セリフをスキップする
4. If JSONファイルが空の配列の場合, the Script Viewer shall 「セリフがありません」と表示する

### Requirement 4: ユーザーインターフェース
**Objective:** As a ユーザー, I want シンプルで使いやすいUIでセリフを閲覧したい, so that 直感的に操作できる

#### Acceptance Criteria
1. The Script Viewer shall ファイル選択ボタンまたはドロップエリアを画面に表示する
2. The Script Viewer shall セリフ一覧を読みやすいレイアウトで表示する
3. The Script Viewer shall キャラクター名とセリフを視覚的に区別できるようにする
4. The Script Viewer shall モダンブラウザ（Chrome, Firefox, Safari, Edge最新版）で動作する

### Requirement 5: キャラクターフィルター
**Objective:** As a ユーザー, I want 特定のキャラクターのセリフだけを表示したい, so that 目的のキャラクターのセリフを効率的に確認できる

#### Acceptance Criteria
1. When JSONファイルが読み込まれた場合, the Script Viewer shall 登場キャラクター一覧をフィルターUIに表示する
2. When ユーザーがキャラクターを選択した場合, the Script Viewer shall 選択されたキャラクターのセリフのみを表示する
3. When 複数のキャラクターが選択された場合, the Script Viewer shall 選択されたすべてのキャラクターのセリフを表示する
4. When フィルターがクリアされた場合, the Script Viewer shall すべてのキャラクターのセリフを表示する
5. While フィルターが適用されている間, the Script Viewer shall 現在のフィルター状態を視覚的に示す
