<?php return [
  'app' => [
    'name' => 'October CMS',
    'tagline' => '基本に戻ろう！',
  ],
  'directory' => [
    'create_fail' => 'ディレクトリ\':name\'を作成できません。',
  ],
  'file' => [
    'create_fail' => 'ファイル\':name\'を作成できません。',
  ],
  'combiner' => [
    'not_found' => 'コンバイナファイル\':name\'が見つかりません。',
  ],
  'system' => [
    'name' => 'システム',
    'menu_label' => 'システム',
    'categories' => [
      'cms' => 'CMS',
      'misc' => 'その他',
      'logs' => 'ログ',
      'mail' => 'メール',
      'shop' => 'ショップ',
      'team' => 'チーム',
      'users' => 'ユーザー',
      'system' => 'システム',
      'social' => 'ソーシャル',
      'events' => 'イベント',
      'customers' => 'カスタマー',
      'my_settings' => 'マイ設定',
    ],
  ],
  'plugin' => [
    'unnamed' => '名前なしプラグイン',
    'name' => [
      'label' => 'プラグイン名',
      'help' => '重複しないプラグイン名を付けてください。（例：RainLab.Blog）',
    ],
  ],
  'plugins' => [
    'enable_or_disable' => '有効化・無効化',
    'enable_or_disable_title' => 'プラグインの有効化・無効化',
    'remove' => '削除',
    'refresh' => '更新',
    'disabled_label' => '無効にする',
    'disabled_help' => 'プラグインを無効にすると、アプリケーションから参照されなくなります。',
    'selected_amount' => 'プラグインを:amount個選択',
    'remove_confirm' => '削除していいですか？',
    'remove_success' => 'システムからプラグインを削除しました。',
    'refresh_confirm' => '更新していいですか？',
    'refresh_success' => 'システム内のプラグインを更新しました。',
    'disable_confirm' => '無効にしていいですか？',
    'disable_success' => 'プラグインを無効にしました。',
    'enable_success' => 'プラグインを有効にしました。',
    'unknown_plugin' => 'システムから見知らぬプラグインを削除しました。',
  ],
  'project' => [
    'attach' => 'プロジェクト追加',
    'detach' => 'プロジェクト切り離し',
    'none' => '無し',
    'id' => [
      'missing' => '使用するプロジェクトのIDを指定してください。',
    ],
    'detach_confirm' => 'このプロジェクトを切り離しますか？',
    'unbind_success' => 'プロジェクトを切り離しました。',
  ],
  'settings' => [
    'search' => '検索',
  ],
  'mail' => [
    'smtp_ssl' => 'SSL接続が必要',
  ],
  'mail_templates' => [
    'name_comment' => 'システム内で一意な名前をつけてください。',
    'test_send' => 'テストメッセージを送信する',
    'return' => 'テンプレートリストに戻る',
  ],
  'install' => [
    'plugin_label' => 'プラグインインストール',
  ],
  'updates' => [
    'plugin_author' => '作者',
    'plugin_not_found' => 'Plugin not found',
    'core_build' => 'ビルド :build',
    'core_build_help' => '新しいビルドが存在します。',
    'plugin_version_none' => '新プラグイン',
    'theme_new_install' => '新しいテーマのインストール',
    'theme_extracting' => 'テーマ \':name\' を展開しています',
    'update_label' => 'ソフトウェアアップデート',
    'update_loading' => 'アップデートロード中…',
    'force_label' => '強制アップデート',
    'found' => [
      'label' => '新しいアップデートあり',
      'help' => 'アップデートしたいソフトウェアをクリックしてください。',
    ],
    'none' => [
      'label' => 'アップデートなし',
      'help' => '新しいアップデートが見つかりません。',
    ],
  ],
  'server' => [
    'connect_error' => 'サーバー接続エラー。',
    'response_not_found' => '更新サーバーが見つかりません。',
    'response_invalid' => 'サーバーからの無効なレスポンス。',
    'response_empty' => 'サーバーから空のレスポンス。',
    'file_error' => 'サーバーがパッケージ配布に失敗。',
    'file_corrupt' => 'サーバーからのファイルが壊れています。',
  ],
  'behavior' => [
    'missing_property' => ':class クラスは、 :behavior ビヘイビアーにより使用される、 :property プロパティーを定義する必要があります。',
  ],
  'config' => [
    'not_found' => ':location で、 :file 設定ファイルが見つかりません。',
    'required' => ':location　の中の設定で、値の指定が必要な、 :property が見つかりません。',
  ],
  'zip' => [
    'extract_failed' => 'コアファイル： \':file\' が取り出せません。',
  ],
  'event_log' => [],
  'request_log' => [
    'empty_link' => 'リクエストログを空にする',
    'empty_loading' => 'リクエストログを空にしています...',
    'empty_success' => 'リクエストログを空にしました。',
    'return_link' => 'リクエストログに戻る',
    'id' => 'ID',
  ],
  'permissions' => [
    'name' => 'システム',
    'manage_system_settings' => 'システム設定の管理',
    'manage_software_updates' => 'ソフトウェアアップデートの管理',
    'manage_mail_templates' => 'メールテンプレートの管理',
    'manage_other_administrators' => '他のアドミニストレーターの管理',
  ],
];
