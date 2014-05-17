<?php

return [
    'cms_object' => [
        'invalid_file' => '正しくないファイル名：:name。ファイル名は英文字、下線(_)、ダッシュ(-)、ピリオド(.)で構成されなくてはなりません。（正しいファイル名の例：page, page.htm, subdirectory/page）',
        'invalid_property' => '":name"プロパティーをセットできません。',
        'file_already_exists' => '":name"ファイルは既に存在しています。',
        'error_saving' => '":name"ファイル保存エラー',
        'error_creating_directory' => ':nameディレクトリー作成エラー',
        'invalid_file_extension'=>'正しくないファイル拡張子：:invalid。許されている拡張子は、:allowedです。',
        'error_deleting' => '":name"一時ファイル削除エラー',
        'delete_success' => ':count個のテンプレートを削除しました。',
        'file_name_required' => 'ファイル名フィールドが必要です。'
    ],
    'theme' => [
        'active' => [
            'not_set' => "アクティブなテーマがセットされていません。",
        ],
        'edit' => [
            'not_set' => "編集テーマがセットされていません。",
            'not_found' => "編集テーマが見つかりません。",
            'not_match' => "アクセスしようとしてるオブジェクトは、編集中のテーマに所属していません。ページを再読込してください。"
        ]
    ],
    'page' => [
        'not_found' => [
            'label' => "ページが見つかりません。",
            'help' => "要求されているページが見つかりません。",
        ],
        'custom_error' => [
            'label' => "ページエラー。",
            'help' => "恐れいります。何かが間違っているようで、ページが表示できません。",
        ],
        'menu_label' => 'ページ',
        'no_list_records' => 'ページが見つかりません',
        'new' => '新ページ',
        'invalid_url' => '正しくないURL形式。URLはスラッシュ(/)で始まり、数字、ラテン文字、_-[]:?|/+*で構成します。',
        'delete_confirm_multiple' => '指定した全ページを本当に削除しますか？',
        'delete_confirm_single' => '本当にこのページを削除しますか？',
        'no_layout' => '-- レイアウト無し --'
    ],
    'layout' => [
        'not_found' => "レイアウト':name'が見つかりません。",
        'menu_label' => 'レイアウト',
        'no_list_records' => 'レイアウトが見つかりません',
        'new' => '新レイアウト',
        'delete_confirm_multiple' => '指定した全ページを本当に削除しますか？',
        'delete_confirm_single' => '本当にこのページを削除しますか？'
    ],
    'partial' => [
        'invalid_name' => "正しくないパーシャル名：:name。",
        'not_found' => "':name'パーシャルが見つかりません。",
        'menu_label' => 'パーシャル',
        'no_list_records' => 'パーシャルが見つかりません。',
        'delete_confirm_multiple' => '指定した全パーシャルを本当に削除しますか？',
        'delete_confirm_single' => '本当にこのパーシャルを削除しますか？',
        'new' => '新パーシャル'
    ],
    'content' => [
        'not_found' => "':name'コンテンツファイルが見つかりません。",
        'menu_label' => 'コンテンツ',
        'no_list_records' => 'コンテンツファイルが見つかりません',
        'delete_confirm_multiple' => '指定した全コンテンツファイル／ディレクトリーを本当に削除しますか？',
        'delete_confirm_single' => '本当にこのコンテンツファイルを削除しますか？',
        'new' => '新コンテンツファイル'
    ],
    'ajax_handler' => [
        'invalid_name' => "正しくないAJAXハンドラー名：:name。",
        'not_found' => "':name' AJAXハンドラーが見つかりません。",
    ],
    'combiner' => [
        'not_found' => "':name'コンバイナーファイルが見つかりません。",
    ],
    'cms' => [
        'menu_label' => "ＣＭＳ"
    ],
    'sidebar' => [
        'add' => '追加',
        'search' => '検索…'
    ],
    'editor' => [
        'settings' => '設定',
        'title' => 'タイトル',
        'new_title' => '新ページタイトル',
        'url' => 'URL',
        'filename' => 'ファイル名',
        'layout' => 'レイアウト',
        'description' => '説明',
        'preview' => 'プレビュー',
        'meta' => 'メタ',
        'meta_title' => 'メタタイトル',
        'meta_description' => 'メタ説明',
        'markup' => 'マークアップ',
        'code' => 'コード',
        'content' => 'コンテンツ',
    ],
    'asset' => [
        'menu_label' => "アセット",
        'drop_down_add_title' => '追加…',
        'drop_down_operation_title' => 'アクション…',
        'upload_files' => 'ファイルアップロード',
        'create_file' => 'ファイル作成',
        'create_directory' => 'ディレクトリー作成',
        'rename' => '名前変更',
        'delete' => '削除',
        'move' => '移動',
        'new' => '新ファイル',
        'rename_popup_title' => '名前変更',
        'rename_new_name' => '新しい名前',
        'invalid_path' => 'パスは数字、ラテン文字、空白、._-/で構成されなくてはなりません。',
        'error_deleting_file' => ':nameファイル削除エラー。',
        'error_deleting_dir_not_empty' => ':nameディレクトリー削除エラー。ディレクトリーが空ではありません。',
        'error_deleting_dir' => ':nameディレクトリー削除エラー。',
        'invalid_name' => '名前は数字、ラテン文字、空白、._-で構成されなくてはなりません。',
        'original_not_found' => '元のファイル／ディレクトリーが見つかりません',
        'already_exists' => 'この名前のファイル／ディレクトリーは既に存在します。',
        'error_renaming' => 'ファイル／ディレクトリー名前変更エラー',
        'name_cant_be_empty' => '名前は空白にできません',
        'too_large' => 'アップロードファイルは大きすぎます。ファイルサイズは最大で、:max_sizeです。',
        'type_not_allowed' => '許可されているファイルタイプは、:allowed_typesだけです。',
        'file_not_valid' => 'ファイルが正しくありません。',
        'error_uploading_file' => '":name":ファイルアップロードエラー。(:error)',
        'move_please_select' => '選択してください',
        'move_destination' => '移動先ディレクトリー',
        'move_popup_title' => 'アセット移動',
        'move_button' => '移動',
        'selected_files_not_found' => '選択されたファイルは存在しません。',
        'select_destination_dir' => '移動先ディレクトリーを選択してください',
        'destination_not_found' => '移動先ディレクトリーは存在しません。',
        'error_moving_file' => ':fileファイル移動エラー',
        'error_moving_directory' => ':dirディレクトリー移動エラー',
        'error_deleting_directory' => '移動元:dirディレクトリー削除エラー',
        'path' => 'パス'
    ],
    'component' => [
        'menu_label' => "コンポーネント",
        'unnamed' => "名前なし",
        'no_description' => "説明なし",
        'alias' => "エイリアス",
        'alias_description' => "ページやレイアウトコードの中で使用される、一意のコンポーネント名。",
        'validation_message' => "ラテン文字、数字、下線(_)で構成された、コンポーネントエイリアスが必要です。エイリアスはラテン文字で始まらなくてなりません。",
        'invalid_request' => "コンポーネントデータが正しくないため、テンプレートは保存できません。",
        'no_records' => 'コンポーネントが見つかりません。',
        'not_found' => "':name'コンポーネントが見つかりません。",
        'method_not_found' => "':name'コンポーネントは、':method'メソッドを持っていません。",
    ],
    'template' => [
        'invalid_type' => "未知のテンプレートタイプ。",
        'not_found' => "リクエストされたテンプレートが見つかりません。",
        'saved'=> "テンプレートを保存しました。"
    ]
];
