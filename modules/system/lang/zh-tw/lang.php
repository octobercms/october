<?php

return [
    'app' => [
        'name' => 'October CMS',
        'tagline' => '登入'
    ],
    'locale' => [
        'cs' => 'Czech',
        'da' => 'Danish',
        'en' => 'English',
        'de' => 'German',
        'es' => 'Spanish',
        'es-ar' => 'Spanish (Argentina)',
        'fa' => 'Persian',
        'fr' => 'French',
        'hu' => 'Hungarian',
        'id' => 'Bahasa Indonesia',
        'it' => 'Italian',
        'ja' => 'Japanese',
        'lv' => 'Latvian',
        'nb-no' => 'Norwegian (Bokmål)',
        'nl' => 'Dutch',
        'pl' => 'Polish',
        'pt-br' => 'Portuguese (Brazil)',
        'ro' => 'Romanian',
        'ru' => 'Russian',
        'sv' => 'Swedish',
        'sk' => 'Slovak (Slovakia)',
        'tr' => 'Turkish',
        'zh-cn' => 'Chinese (China)',
        'zh-tw' => 'Chinese (Taiwan)'
    ],
    'directory' => [
        'create_fail' => '不能建立目錄: :name'
    ],
    'file' => [
        'create_fail' => '不能建立檔案: :name'
    ],
    'combiner' => [
        'not_found' => "混合檔案 ':name' 沒找到."
    ],
    'system' => [
        'name' => '系統',
        'menu_label' => '系統',
        'categories' => [
            'cms' => '內容管理',
            'misc' => '雜項',
            'logs' => '日誌',
            'mail' => '郵件',
            'shop' => '商舖',
            'team' => '團隊',
            'users' => '使用者',
            'system' => '系統',
            'social' => '社交',
            'events' => '事件',
            'customers' => '自訂',
            'my_settings' => '我的設定'
        ]
    ],
    'theme' => [
        'unnamed' => '未命名主題',
        'name' => [
            'label' => '主題名稱',
            'help' => '主題的唯一名稱，例如：RainLab.Vanilla'
        ],
    ],
    'themes' => [
        'install' => '安裝主題',
        'search' => '搜尋主題...',
        'installed' => '已安裝主題',
        'no_themes' => '市集上沒有已安裝的主題。',
        'recommended' => '推薦',
        'remove_confirm' => '您確定要刪除這些主題嗎？'
    ],
    'plugin' => [
        'unnamed' => '未命名的外掛',
        'name' => [
            'label' => '外掛名稱',
            'help' => '外掛的唯一名稱，例如：RainLab.Blog'
        ]
    ],
    'plugins' => [
        'manage' => '管理外掛',
        'enable_or_disable' => '啟用或停用',
        'enable_or_disable_title' => '啟用或停用外掛',
        'install' => '安裝外掛',
        'install_products' => '安裝產品',
        'search' => '搜尋外掛...',
        'installed' => '已安裝外掛',
        'no_plugins' => '市集中沒有已安裝的外掛。',
        'recommended' => '推薦',
        'remove' => '移除',
        'refresh' => '更新',
        'disabled_label' => '停用',
        'disabled_help' => '被停用的外掛被應用程式忽略了.',
        'selected_amount' => '選取的外掛: :數目',
        'remove_confirm' => '您確定嗎?',
        'remove_success' => '成功從系統移除這些外掛.',
        'refresh_confirm' => '您確定嗎?',
        'refresh_success' => '成功更新了系統中的外掛.',
        'disable_confirm' => '您確定嗎?',
        'disable_success' => '成功停用了這些外掛.',
        'enable_success' => '成功啟用了這些外掛',
        'unknown_plugin' => '外掛從檔案系統中移除了.'
    ],
    'project' => [
        'name' => '產品',
        'owner_label' => '擁有者',
        'attach' => '增加產品',
        'detach' => '刪除產品',
        'none' => '沒有',
        'id' => [
            'label' => '產品ID',
            'help' => '如何找到您的產品ID',
            'missing' => '請確認您想使用的產品ID.'
        ],
        'detach_confirm' => '您確定要刪除這個產品嗎?',
        'unbind_success' => '產品刪除成功.'
    ],
    'settings' => [
        'menu_label' => '設定',
        'not_found' => '不能找到特定的設定.',
        'missing_model' => '設定頁缺少Model定義.',
        'update_success' => ':name 的設定更新成功了.',
        'return' => '返回系統設定',
        'search' => '搜尋'
    ],
    'mail' => [
        'log_file' => '日誌檔案',
        'menu_label' => '郵件設定',
        'menu_description' => '管理郵件設定.',
        'general' => '常規',
        'method' => '郵件方法',
        'sender_name' => '發送者名稱',
        'sender_email' => '發送者郵件',
        'php_mail' => 'PHP mail',
        'smtp' => 'SMTP',
        'smtp_address' => 'SMTP 地址',
        'smtp_authorization' => '需要 SMTP 認證',
        'smtp_authorization_comment' => '勾選這個多選框如果您的SMTP伺服器需要認證.',
        'smtp_username' => '使用者名',
        'smtp_password' => '密碼',
        'smtp_port' => 'SMTP 端口',
        'smtp_ssl' => '需要SSL連接',
        'sendmail' => 'Sendmail',
        'sendmail_path' => 'Sendmail 路徑',
        'sendmail_path_comment' => '請確認 Sendmail 路徑.',
        'mailgun' => 'Mailgun',
        'mailgun_domain' => 'Mailgun 域名',
        'mailgun_domain_comment' => '請確認 Mailgun 域名.',
        'mailgun_secret' => 'Mailgun Secret',
        'mailgun_secret_comment' => '輸入您的 Mailgun API key.',
        'mandrill' => 'Mandrill',
        'mandrill_secret' => 'Mandrill Secret',
        'mandrill_secret_comment' => '輸入您的 Mandrill API key.'
    ],
    'mail_templates' => [
        'menu_label' => '郵件模板',
        'menu_description' => '編輯發送到使用者和管理員的郵件模板, 管理郵件佈局.',
        'new_template' => '新模板',
        'new_layout' => '新佈局',
        'template' => '模板',
        'templates' => '模板',
        'menu_layouts_label' => '郵件佈局',
        'layout' => '佈局',
        'layouts' => '佈局',
        'name' => '名稱',
        'name_comment' => '指向這個模板的唯一名稱',
        'code' => '代碼',
        'code_comment' => '指向這個模板的唯一代碼',
        'subject' => '標題',
        'subject_comment' => '郵箱訊息標題',
        'description' => '描述',
        'content_html' => 'HTML',
        'content_css' => 'CSS',
        'content_text' => '純文字',
        'test_send' => '發送測試訊息',
        'test_success' => '測試訊息已經成功發送.',
        'return' => '返回模板列表'
    ],
    'install' => [
        'project_label' => '加入產品',
        'plugin_label' => '安裝外掛',
        'theme_label' => '安裝主題',
        'missing_plugin_name' => '請輸入要安裝的外掛名稱。',
        'missing_theme_name' => '請輸入要安裝的主題名稱。',
        'install_completing' => '完成安裝過程',
        'install_success' => '外掛安裝成功。'
    ],
    'updates' => [
        'title' => '管理更新',
        'name' => '軟件更新',
        'menu_label' => '更新',
        'menu_description' => '更新系統, 管理並安裝外掛和主題.',
        'check_label' => '檢查更新',
        'retry_label' => '重試',
        'plugin_name' => '名字',
        'plugin_description' => '描述',
        'plugin_version' => '版本',
        'plugin_author' => '作者',
        'plugin_not_found' => 'Plugin not found',
        'core_current_build' => '目前版本',
        'core_build' => '版本 :build',
        'core_build_help' => '新的版本可用.',
        'core_downloading' => '下載應用程式',
        'core_extracting' => '解壓縮應用程式',
        'plugins' => '外掛',
        'themes' => '主題',
        'disabled' => '停用',
        'plugin_downloading' => '下載外掛: :name',
        'plugin_extracting' => '解壓縮外掛: :name',
        'plugin_version_none' => '新外掛',
        'theme_new_install' => '新主題安裝.',
        'theme_downloading' => '下載主題: :name',
        'theme_extracting' => '解壓縮主題: :name',
        'update_label' => '更新軟件',
        'update_completing' => '完成更新過程',
        'update_loading' => '加載可用更新...',
        'update_success' => '更新完成.',
        'update_failed_label' => '更新失敗',
        'force_label' => '強制更新',
        'found' => [
            'label' => '發現新的更新!',
            'help' => '點選更新.'
        ],
        'none' => [
            'label' => '沒有更新',
            'help' => '沒有發現新的更新.'
        ]
    ],
    'server' => [
        'connect_error' => '連接伺服器失敗.',
        'response_not_found' => '找不到更新伺服器.',
        'response_invalid' => '伺服器返回異常.',
        'response_empty' => '伺服器返回為空.',
        'file_error' => '伺服器下載檔案失敗.',
        'file_corrupt' => '伺服器下載檔案校驗失敗.'
    ],
    'behavior' => [
        'missing_property' => 'Class :class 必須定義屬性 $:property 被 :behavior behavior 使用.'
    ],
    'config' => [
        'not_found' => '不能搜尋設定檔案 :file 為 :location 定義.',
        'required' => "設定 :location 必須有 ':property'."
    ],
    'zip' => [
        'extract_failed' => "不能解壓縮檔案 ':file'."
    ],
    'event_log' => [
        'hint' => '日誌顯示了程序中的潛在錯誤, 比如異常和測試訊息.',
        'menu_label' => '事件日誌',
        'menu_description' => '查看系統日誌訊息, 包括時間和詳細訊息.',
        'empty_link' => '清空事件日誌',
        'empty_loading' => '清空事件日誌...',
        'empty_success' => '成功清空時間日誌.',
        'return_link' => '返回時間日誌',
        'id' => 'ID',
        'id_label' => '事件 ID',
        'created_at' => '時間和日期',
        'message' => '訊息',
        'level' => '等級'
    ],
    'request_log' => [
        'hint' => '這個日誌顯示了需要注意的瀏覽器請求. 比如如果一個訪問者打開一個沒有的CMS頁面, 一條返回狀態404的記錄被建立.',
        'menu_label' => '請求日誌',
        'menu_description' => '查看壞的或者重定向的請求, 比如頁面找不到(404).',
        'empty_link' => '清空請求日誌',
        'empty_loading' => '清空請求日誌...',
        'empty_success' => '成功清空請求日誌.',
        'return_link' => '返回請求日誌',
        'id' => 'ID',
        'id_label' => '登錄ID',
        'count' => '次數',
        'referer' => '來源',
        'url' => 'URL',
        'status_code' => '狀態'
    ],
    'permissions' => [
        'name' => '系統',
        'manage_system_settings' => '管理系統設定',
        'manage_software_updates' => '管理軟件更新',
        'access_logs' => '查看訪問日誌',
        'manage_mail_templates' => '管理郵件模板',
        'manage_mail_settings' => '管理郵件設定',
        'manage_other_administrators' => '管理其他管理員',
        'view_the_dashboard' => '查看儀表板',
        'manage_branding' => '自訂後台'
    ]
];