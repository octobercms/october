<?php

return [
    'field' => [
        'invalid_type' => '無効なフィールドタイプ :type が使用されています。',
        'options_method_not_exists' => 'モデルクラスの:modelは、":field"フォームフィールドのためにオプションを返す、:method()メソッドを定義しなくてはなりません。',
    ],
    'widget' => [
        'not_registered' => "':name'は、ウィジット名として登録されていません。",
        'not_bound' => "ウィジットクラス名の':name'は、コントローラーと結び付けられていません。",
    ],
    'page' => [
        'untitled' => "タイトル無し",
        'access_denied' => [
            'label' => "アクセスが拒否されました",
            'help' => "このページを表示するために必要な権限がありません。",
            'cms_link' => "CMSのバックエンドに行く",
        ],
    ],
    'partial' => [
        'not_found' => "':name'パーシャルは見つかりません。",
    ],
    'account' => [
        'sign_out' => 'ログアウト',
        'login' => 'ログイン',
        'reset' => 'リセット',
        'restore' => '元に戻す',
        'login_placeholder' => 'ユーザー名',
        'password_placeholder' => 'パスワード',
        'forgot_password' => "パスワードを忘れましたか？",
        'enter_email' => "メールアドレスを入力してください",
        'enter_login' => "ユーザー名を入力してください",
        'email_placeholder' => "メールアドレス",
        'enter_new_password' => "新パスワードを入力してください",
        'password_reset' => "パスワードリセット",
        'restore_success' => "パスワードを元に戻すための手順を説明したメールを送信しました。",
        'restore_error' => "':login'というユーザーは登録されていません。",
        'reset_success' => "パスワードがリセットされました。",
        'reset_error' => "間違ったパスワードリセットデーターが送信されました。再実行してください。",
        'reset_fail' => "パスワードをリセットできませんでした。",
        'apply' => '適用',
        'cancel' => 'キャンセル',
        'delete' => '削除',
        'ok' => 'OK',
    ],
    'dashboard' => [
        'menu_label' => 'ダッシュボード',
    ],
    'user' => [
        'name' => '管理者',
        'menu_label' => '管理者',
        'list_title' => '管理者管理',
        'new' => '新管理者',
        'login' => "ログイン",
        'first_name' => "名",
        'last_name' => "氏",
        'full_name' => "氏名",
        'email' => "メールアドレス",
        'groups' => "グループ",
        'groups_comment' => "このユーザー所属が所属するグループを指定してください。",
        'avatar' => "アバター",
        'password' => "パスワード",
        'password_confirmation' => "パスワード確認",
        'superuser' => "スーパーユーザー",
        'superuser_comment' => "全領域へのアクセスをこのユーザーに許可する場合、ボックスをチェックしてください。",
        'send_invite' => 'メールにより招待送信',
        'send_invite_comment' => 'このユーザーに、メールで招待状を送る場合、ボックスをチェックしてください。',
        'delete_confirm' => 'この管理者を本当に削除しますか？',
        'return' => '管理者リストに戻る',
        'group' => [
            'name' => 'グループ',
            'name_field' => '名前',
            'menu_label' => 'グループ',
            'list_title' => 'グループ管理',
            'new' => '新管理者グループ',
            'delete_confirm' => '本当にこの管理者グループを削除しますか？',
            'return' => 'グループリストへ戻る',
        ],
        'preferences' => [
            'not_authenticated' => '設定を読み込み／保存する、認証されたユーザーが存在していません。'
        ]
    ],
    'list' => [
        'default_title' => 'リスト',
        'search_prompt' => '検索…',
        'no_records' => 'このビューにはレコードがありません。',
        'missing_model' => ':classクラスの中のリストビヘイビアーにモデルがありません。',
        'missing_column' => ':columnsに対する、カラム定義がありません。',
        'missing_columns' => ':classクラスの中のリストには、リストするカラムが定義されていません。',
        'missing_definition' => "リストビヘイビアーは、':field'に対するカラムを持っていません。",
        'behavior_not_ready' => 'リストビヘイビアーは初期化されていません。コントローラーで、makeLists()を呼び出しているか確認してください。',
        'invalid_column_datetime' => "Column value ':column' is not a DateTime object, are you missing a \$dates reference in the Model?",
    ],
    'form' => [
        'create_title' => "新規 :name",
        'update_title' => "編集 :name",
        'preview_title' => "プレビュー :name",
        'create_success' => ':nameを作成しました。',
        'update_success' => ':nameを更新しました。',
        'delete_success' => ':nameを削除しました。',
        'missing_id' => "フォームのレコードIDが指定されていません。",
        'missing_model' => ':classクラスで使用している、フォームビヘイビアーは、モデル定義を持っていません。',
        'missing_definition' => "フォームビヘイビアーは、':field'フィールドを持っていません。",
        'not_found' => 'IDが:idのフォームレコードが見つかりません。',
        'create' => '作成',
        'create_and_close' => '作成後閉じる',
        'creating' => '作成中…',
        'save' => '保存',
        'save_and_close' => '保存後閉じる',
        'saving' => '保存中…',
        'delete' => '削除',
        'deleting' => '削除中…',
        'undefined_tab' => 'その他',
        'field_off' => '無効',
        'field_on' => '有効',
        'apply' => '適用',
        'cancel' => 'キャンセル',
        'close' => 'クローズ',
        'ok' => 'OK',
        'or' => 'または',
        'confirm_tab_close' => '本当にタブを閉じますか？ 保存されていない変更は消えてしまいます。',
        'behavior_not_ready' => 'フォームビヘイビアーは初期化されていません。コントローラーでinitForm()を呼び出しているか確認してください。',
    ],
    'relation' => [
        'missing_definition' => "リレーションビヘイビアーは、':field'フィールドに対する定義を持っていません。",
        'missing_model' => ":classクラスで使用している、リレーションビヘイビアーは、モデル定義を持っていません。",
        'invalid_action_single' => "このアクションは、単一リレーションでは実行できません。",
        'invalid_action_multi' => "このアクションは、複数リレーションでは実行できません。",
        'add' => "追加",
        'add_name' => "追加 :name",
        'create' => "作成",
        'create_name' => "作成 :name",
        'update' => "Update",
        'update_name' => "Update :name",
        'remove' => "削除",
        'remove_name' => "削除 :name",
        'delete' => "削除",
        'delete_name' => "削除 :name",
    ],
    'model' => [
        'name' => "Model",
        'not_found' => "IDが:idの、':class'モデルは見つかりません。",
        'missing_id' => "モデルレコードを探すためのIDが、指定されていません。",
        'missing_relation' => "':class'モデルは、':relation'の定義を持っていません。",
        'invalid_class' => ":classクラスで使用している、:modelモデルは正しくありません。\Modelクラスを継承してください。",
        'mass_assignment_failed' => "Mass assignment failed for Model attribute ':attribute'.",
    ],
    'warnings' => [
        'tips' => 'System configuration tips',
        'tips_description' => 'There are issues you need to pay attention to in order to configure the system properly.',
        'permissions'  => 'Directory :name or its subdirectories is not writable for PHP. Please set corresponding permissions for the webserver on this directory.',
        'extension' => 'The PHP extension :name is not installed. Please install this library and activate the extension.'
    ],
    'editor' => [
        'menu_label' => 'Editor Preferences',
        'menu_description' => 'Manage code editor preferences.',
        'font_size' => 'Font size',
        'tab_size' => 'Tab size',
        'use_hard_tabs' => 'Indent using tabs',
        'code_folding' => 'Code folding',
        'word_wrap' => 'Word wrap',
        'highlight_active_line' => 'Highlight active line',
        'show_invisibles' => 'Show invisible characters',
        'show_gutter' => 'Show gutter',
        'theme' => 'Color scheme',
    ],
    'layout' => [
        'direction' => 'lrt'
    ]
];
