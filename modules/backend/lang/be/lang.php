<?php

return [
    'auth' => [
        'title' => "Панэль кіравання"
    ],
    'aria-label' => [
        'footer'        => 'ніжні колер',
        'side_panel'    => 'бакавая панэль',
        'breadcrumb'    => 'сухар',
        'main_content'  => 'Асноўная плошча',
        'tabs'          => 'ўкладкі',
        'sidebar_menu'  => 'Меню бакавой панэлі'
    ],
    'field' => [
        'invalid_type' => "Выкарыстаны няправільны тып поля: \":type\"",
        'options_method_invalid_model' => "Для атрыбуту \":field\" не была знойздена адпаведная мадэль. Паспрабуйце яўна вызначыць метад опцый для мадэлі \":model\"",
        'options_method_not_exists' => "Клас мадэлі \":model\" павінен мець метад \":method()\", які вяртае опцыі для поля формы \":field\""
    ],
    'widget' => [
        'not_registered' => "Віджэт з імем класа \":name\" не быў зарэгістрыраваны",
        'not_bound' => "Віджэт з імем класа \":name\" не быў злучаны з кантролерам"
    ],
    'page' => [
        'untitled' => "Без назвы",
        'access_denied' => [
            'label' => "Доступ забаронены",
            'help' => "У вас няма патрэбных праў для прагляду гэтай старонкі",
            'cms_link' => 'Вярнуцца у панэль кіравання'
        ],
        'no_database' => [
            'label' => "Няма базы дадзеных",
            'help' => "Неабходна база дадзеных мець доступ у панэль кіравання. Праверце, што база дадзеных правільна наладжаная, а міграцыі выкананыя, перад тым, як пасправаць зноў",
            'cms_link' => "Вярнуцца на хатнюю старонку"
        ],
        'invalid_token' => [
            'label' => "Няправільны токен бяспекі"
        ]
    ],
    'partial' => [
        'not_found_name' => "Частковы шаблон \":name\" не знойдзены."
    ],
    'account' => [
        'sign_out' => "Выйсці",
        'login' => "Увайсці",
        'reset' => "Скасаваць",
        'restore' => "Аднавіць",
        'login_placeholder' => "Карыстальнік",
        'password_placeholder' => "Пароль",
        'forgot_password' => "Забыліся пароль?",
        'enter_email' => "Увядзіце электронную пошту",
        'enter_login' => "Увядзіце імя карыстальніка",
        'email_placeholder' => "Электронная пошта",
        'enter_new_password' => "Увядзіце новы пароль",
        'password_reset' => "Скасаванне паролю",
        'restore_success' => "На Вашу электронную пошту было адпраўлена паведамленне з інструкцыямі",
        'restore_error' => "Імя карыстальніка \":login\" не было знойдзена",
        'reset_success' => "Пароль быў зменены, цяпер Вы можаце ўвайсці",
        'reset_error' => "Няправільныя дадзеныя для змены пароля. Паспрабуйце яшчэ!",
        'reset_fail' => "Немагчыма змяніць пароль!",
        'apply' => "Ужыць",
        'cancel' => "Адмяніць",
        'delete' => "Выдаліць",
        'ok' => "Добра"
    ],
    'dashboard' => [
        'menu_label' => "Панэль кіравання",
        'widget_label' => "Віджэт",
        'widget_width' => "Шырыня віджэта",
        'full_width' => "Поўная шырыня",
        'manage_widgets' => "Кіраванне віджэтамі",
        'add_widget' => "Дадаць віджэт",
        'widget_inspector_title' => "Канфігурацыя віджэта",
        'widget_inspector_description' => "Налада адлюстравання віджэта",
        'widget_columns_label' => "Шырыня :columns",
        'widget_columns_description' => "Шырыня віджэта, лічба паміж 1 і 10",
        'widget_columns_error' => "Калі ласка, ужывайце лічбы ад 1 да 10 у якасці шырыні віджэта",
        'columns' => "{1} слупок|[2,4] слупкі|[5,Inf] слупкоў",
        'widget_new_row_label' => "Новы радок",
        'widget_new_row_description' => "Размясціць віджэт на новым радку",
        'widget_title_label' => "Назва віджэта",
        'widget_title_error' => "Віджэт павінен мець назву",
        'reset_layout' => "Скасаваць макет",
        'reset_layout_confirm' => "Скасаваць макет да зыходных наладаў",
        'reset_layout_success' => "Макет быў скасаваны",
        'make_default' => "Зрабіць зыходным",
        'make_default_confirm' => "Зрабіць дадзены макет заходным?",
        'make_default_success' => "Гэты макет цяпер зыходны",
        'status' => [
            'widget_title_default' => "Статус сістэмы",
            'update_available' => "{0} абнаўленняў!|{1} абнаўленне!|[2,4] абнаўленні!|[5,Inf] абнаўленняў",
            'updates_pending' => "Абнаўленні праграмнага забеспячэння ў чаканні",
            'updates_nil' => "Праграмнае забеспячэнне ў актуальным стане",
            'updates_link' => "Абнавіць",
            'warnings_pending' => "Што патрабуе ўвагі",
            'warnings_nil' => "Няма папярэджанняў",
            'warnings_link' => "Прагледзець",
            'core_build' => "Зборка сістэмы",
            'event_log' => "Журнал падзей",
            'request_log' => "Спіс запытаў",
            'app_birthday' => "Анлайн з",
        ],
        'welcome' => [
            'widget_title_default' => "Сардэчна запрашаем",
            'welcome_back_name' => "Сардэчна запрашаем назад да :app, :name.",
            'welcome_to_name' => "Сардэчна запрашаем да :app, :name.",
            'first_sign_in' => "Гэта першы раз, калі Вы ўвайшлі",
            'last_sign_in' => "Ваш апошні ўваход быў",
            'view_access_logs' => "Прагледзець журнал доступу",
            'nice_message' => "Добрага дню!",
        ]
    ],
    'user' => [
        'name' => "Адміністратар",
        'menu_label' => "Адміністратары",
        'menu_description' => "Кіраванне карыстальнікамі панэлі кіравання, групамі і дазволамі",
        'list_title' => "Кіраванне адміністратарамі",
        'new' => "Новы адміністратар",
        'login' => "Лагін",
        'first_name' => "Імя",
        'last_name' => "Прозвішча",
        'full_name' => "Поўнае імя",
        'email' => "Электронная пошта",
        'groups' => "Групы",
        'groups_comment' => "Укажыце, да якіх груп павінен належаць профіль. Для карыстальнікаў групы вызначаюць дазволы, якія для кожнага карыстальніка могуць быць перапісаны на яго ўзроўні на вокладцы \"Дазволы\"",
        'avatar' => "Аватар",
        'password' => "Пароль",
        'password_confirmation' => "Пацвердзіце пароль",
        'permissions' => "Дазволы",
        'account' => "Профіль",
        'superuser' => "Супер карыстальнік",
        'superuser_comment' => "Надзяляе гэтага карыстальніка неабмежаванымі магчымасцямі ва ўсіх абласцях сістэмы. Супер карыстальнікі могуць дадаваць і змяняць іншых карыстальнікаў",
        'send_invite' => "Выслаць запрашэнне па электроннай пошце",
        'send_invite_comment' => "Дасылае вітальнае паведамленне з лагінам і паролем",
        'delete_confirm' => "Выдаліць гэтага адміністратара?",
        'return' => "Вярнуцца да спісу адміністратараў",
        'allow' => "Дазволіць",
        'inherit' => "Успадкаваць",
        'deny' => "Забараніць",
        'activated' => "Актываваны",
        'last_login' => "Апошні ўваход",
        'created_at' => "Створаны",
        'updated_at' => "Абноўлены",
        'group' => [
            'name' => "Група",
            'name_comment' => "Імя адлюстроўваецца ў спісе груп на форме стварэння і рэдагавання адміністратараў",
            'name_field' => "Назва",
            'description_field' => "Апісанне",
            'is_new_user_default_field_label' => "Група па змаўчанні",
            'is_new_user_default_field_comment' => "Дадаваць новых адміністратараў у гэтую групу па змаўчанні",
            'code_field' => "Код",
            'code_comment' => "Увядзіце унікальны код, калі Вы жадаеце мець доступ да групы скрозь API",
            'menu_label' => "Кіраванне групамі",
            'list_title' => "Кіраванне групамі",
            'new' => "Новая група",
            'delete_confirm' => "Выдаліць гэтую адміністратарскую групу?",
            'return' => "Вярнуцца да спісу груп",
            'users_count' => "Карыстальнікі"
        ],
        'preferences' => [
            'not_authenticated' => "Немагчыма загрузіць ці захаваць налады для невядомага карыстальніка"
        ]
    ],
    'list' => [
        'default_title' => "Спіс",
        'search_prompt' => "Пошук...",
        'no_records' => "Няма запісаў для прагляду",
        'missing_model' => "Для спіса, які выкарыстоўваецца ў класе \":class\", не знойдзена мадэль",
        'missing_column' => "Няма ніводных вызначэнняў слупкоў для \":columns\"",
        'missing_columns' => "Спіс, ужыты ў класе \":class\", не мае пэўных слупкоў",
        'missing_definition' => "Вызначаны спіс не мае слупка для поля \":field\"",
        'missing_parent_definition' => "Налады спіса не маюць вызначэнняў для \":definition\"",
        'behavior_not_ready' => "Паводзіны спіса не былі вызначаны, праверце, што Вы вызвалі makeLists() у кантролеры",
        'invalid_column_datetime' => "Значэнне слупку \":column\" не з'яўляецца аб'ектам тыпу DateTime, можа ў Вас адсутнічае спасылка на \$dates у мадэлі?",
        'pagination' => "Паказаныя запісы: :from-:to з :total",
        'prev_page' => "Папярэдняя старонка",
        'next_page' => "Наступная старонка",
        'refresh' => "Абнавіць",
        'updating' => 'Абнаўленне...',
        'loading' => 'Загрузка...',
        'setup_title' => "Налады лісту",
        'setup_help' => "З дапамогай сцяжкоў вызначце слупкі для лісту. Вы можаце змяніць пазіцыю слупкоў, перацягваючы іх уверх і ўніз",
        'records_per_page' => "Запісаў на старонку",
        'records_per_page_help' => "Вызначце, колькі запісаў павінна быць на адной старонцы. Памятайце, што вялікая колькасць запісаў можа паменьшыць прадукцыйнасць",
        'check' => "Праверыць",
        'delete_selected' => "Выдаліць абраныя",
        'delete_selected_empty' => "Няма абраных запісаў для выдалення",
        'delete_selected_confirm' => "Выдяліць абраныя запісы?",
        'delete_selected_success' => "Абраныя запісы былі выдаленыя",
        'column_switch_true' => "Так",
        'column_switch_false' => "Не"
    ],
    'fileupload' => [
        'attachment' => "Прымацаванне",
        'help' => "Дадайце назву і апісанне для гэтага прымацавання",
        'title_label' => "Назва",
        'description_label' => "Апісанне",
        'default_prompt' => "Націсніце %s альбо перацягніце файл сюды, каб загрузіць",
        'attachment_url' => "URL прымацавання",
        'upload_file' => "Загрузіць файл",
        'upload_error' => "Памылка загрузкі",
        'remove_confirm' => "Вы ўпэўнены?",
        'remove_file' => "Выдаліць файл"
    ],
    'form' => [
        'create_title' => "Новая :name",
        'update_title' => "Рэдагаваць :name",
        'preview_title' => "Папярэдні прагляд :name",
        'create_success' => ":name была створаная",
        'update_success' => ":name абноўленая",
        'delete_success' => ":name выдаленая",
        'reset_success' => "Скід зроблены",
        'missing_id' => "Ідентыфікатар запісу формы не быў указаны",
        'missing_model' => "Для паводзінаў форму ў класе \":class\" няма вызначанай мадэлі",
        'missing_definition' => "Паводзіны формы не маюць поля для \":field\"",
        'not_found' => "Немагчыма знайсці запіс формы з ідэнтыфікатарам :id",
        'action_confirm' => "Вы ўпэўнены?",
        'create' => "Стварыць",
        'create_and_close' => "Стварыць і зачыніць",
        'creating' => "Стварэнне...",
        'creating_name' => "Стварэнне :name...",
        'save' => "Захаваць",
        'save_and_close' => "Захаваць і зачыніць",
        'saving' => "Захаванне...",
        'saving_name' => "Захаванне :name...",
        'delete' => "Выдаліць",
        'deleting' => "Выдаленне...",
        'confirm_delete' => "Выдаліць запіс?",
        'confirm_delete_multiple' => "Выдаліць абраныя запісы?",
        'deleting_name' => "Выдаленне :name...",
        'reset_default' => "Скінуць да стану па змаўчанні",
        'resetting' => "Скіданне",
        'resetting_name' => "Скіданне :name",
        'undefined_tab' => "Рознае",
        'field_off' => "Выкл",
        'field_on' => "Укл",
        'add' => "Дадаць",
        'apply' => "Ужыць",
        'cancel' => "Адмяніць",
        'close' => "Зачыніць",
        'confirm' => "Пацвердзіць",
        'reload' => "Перазагрузіць",
        'complete' => "Завяршыць",
        'ok' => "Добра",
        'or' => "ці",
        'confirm_tab_close' => "Зачыніць вокладку? Незахаваныя змяненні будуць згубленыя",
        'behavior_not_ready' => "Паводзіны формы пакуль не былі ініцыялізаваныя, упэўніцеся, што Вы выканалі initForm() у сваім кантролеры",
        'preview_no_files_message' => "Няма загружаных файлаў",
        'preview_no_record_message' => "Няма выбраных запісаў",
        'select' => "Выбраць",
        'select_all' => "усё",
        'select_none' => "нічога",
        'select_placeholder' => "Калі ласка, выберыце",
        'insert_row' => "Уставіць радок",
        'insert_row_below' => "Уставіць радок ніжэй",
        'delete_row' => "Выдаліць радок",
        'concurrency_file_changed_title' => "Файл быў зменены",
        'concurrency_file_changed_description' => "Файл які вы рэдагуеце быў зменены на діску іншым карыстальнікам. Вы можаце альбо перазагрузіць файл і згубіць сваі змяненні, альбо перазапісаць файл на діску",
        'return_to_list' => "Вярнуцца да спісу"
    ],
    'recordfinder' => [
        'find_record' => "Знайсці запіс"
    ],
    'pagelist' => [
        'page_link' => "Спасылка на староку",
        'select_page' => "Выберыце старонку..."
    ],
    'relation' => [
        'missing_config' => "Паводзіны стаўлення не маюць ніводнай канфігурацыі для \":config\"",
        'missing_definition' => "Паводзіны стаўлення не маюць вызначэнняў для поля \":field\"",
        'missing_model' => "Паводзіны стаўлення ў :class не маюць вызначанай мадэлі",
        'invalid_action_single' => "Гэтае дзеянне немагчыма выканаць на адзіночным стаўленні",
        'invalid_action_multi' => "Гэтае дзеянне немагчыма выканаць на множным стаўленні",
        'help' => "Націсніце на пункт, каб дадаць",
        'related_data' => "Роднасныя :name дадзеныя",
        'add' => "Дадаць",
        'add_selected' => "Дадаць выбраныя",
        'add_a_new' => "Дадаць новае :name",
        'link_selected' => "Звязаць выбраныя",
        'link_a_new' => "Звязаць з новым :name",
        'cancel' => "Адмяніць",
        'close' => "Зачыніць",
        'add_name' => "Дадаць :name",
        'create' => "Стварыць",
        'create_name' => "Стварыць :name",
        'update' => "Абнавіць",
        'update_name' => "Абнавіць :name",
        'preview' => "Папярэдні прагляд",
        'preview_name' => "Прагледзець :name",
        'remove' => "Выдаліць",
        'remove_name' => "Выдаліць :name",
        'delete' => "Выдаліць",
        'delete_name' => "Выдаліць :name",
        'delete_confirm' => "Вы ўпэўнены?",
        'link' => "Звязаць",
        'link_name' => "Звязаць :name",
        'unlink' => "Раз'яднаць",
        'unlink_name' => "Раз'яднаць :name",
        'unlink_confirm' => "Вы ўпэўнены?"
    ],
    'reorder' => [
        'default_title' => "Змяніць парадак запісаў",
        'no_records' => "Няма запісаў для сартавання"
    ],
    'model' => [
        'name' => 'Мадэль',
        'not_found' => "Немагчыма знайсці мадэль \":class\" з ідэнтыфікатарам \":id\"",
        'missing_id' => "Не вызначаны ідэнтыфікатар для пошуку запісу мадэлі",
        'missing_relation' => "Мадэль \":class\" не мае вызначэнняў для \":relation\"",
        'missing_method' => "Мадэль \":class\" не мае метаду \":method\"",
        'invalid_class' => "Мадэль \":model\" выкарыстаная ў класе \":class\" неправільная, яна павінна ўспадкоўваць клас \\Model",
        'mass_assignment_failed' => "Памылковае масавае прызначэнне для атрыбуту \":attribute\""
    ],
    'warnings' => [
        'tips' => "Парады па канфігурацыі сістэмы",
        'tips_description' => "Ёсць пытанні, на якія Вам неабходна звярнуць увагу, каб наладзіць сістэму належным чынам",
        'permissions'  => "PHP не можа пісаць у каталог \":name\" альбо ў яго падкаталогі. Калі ласка, вызначце патрэбныя дазволы ў наладах сервера для гэтага каталога",
        'extension' => "Пашыранне PHP \":name\" не ўсталявана. Калі ласка, ўсталюце пашырэнне і актывуйце яго"
    ],
    'editor' => [
        'menu_label' => "Налады рэдактара",
        'menu_description' => "Налада глабальных наладаў рэдактара, такіх як памер шрыфта і каляровая схема",
        'font_size' => "Памер шрыфта",
        'tab_size' => "Памер табуляцыі",
        'use_hard_tabs' => "Водступ з дапамогай табуляцыі",
        'code_folding' => "Складванне коду",
        'code_folding_begin' => "Пазначыць пачатак",
        'code_folding_begin_end' => "Пазначыць пачатак і канец",
        'autocompletion' => "Аўтазавяршэнне",
        'word_wrap' => "Перанос слоў",
        'highlight_active_line' => "Вылучыць актыўную лінію",
        'auto_closing' => "Аўтаматычна зачыняць тэгі",
        'show_invisibles' => "Паказваць нябачныя сімвалы",
        'show_gutter' => "Паказваць нумерацыю радкоў",
        'basic_autocompletion'=> "Простае аўтазавяршэнне (Ctrl + Space)",
        'live_autocompletion'=> "Жывое аўтазавяршэнне",
        'enable_snippets'=> "Уключыць фрагменты кода (Tab)",
        'display_indent_guides'=> "Паказываць водступы",
        'show_print_margin'=> "Паказываць палі для друку",
        'mode_off' => "Выкл",
        'mode_fluid' => "Вадкі",
        '40_characters' => "40 сімвалаў",
        '80_characters' => "80 сімвалаў",
        'theme' => "Каляровая схема",
        'markup_styles' => "Стылі макету",
        'custom_styles' => "Прыстасаваныя табліцы стыляў",
        'custom styles_comment' => "Прыстасаваныя стылі якія патрэбна дадаць у рэдактар",
        'markup_classes' => "Класы макету",
        'paragraph' => "Параграф",
        'link' => "Спасылка",
        'table' => "Табліца",
        'table_cell' => "Клетка табліцы",
        'image' => "Карцінка",
        'label' => "Назва",
        'class_name' => "Імя класу",
        'markup_tags' => "Тэгі макету",
        'allowed_empty_tags' => "Дазволеныя пустыя тэгі",
        'allowed_empty_tags_comment' => "Ліст тэгаў, якія не выдаляюцца нават без зместу",
        'allowed_tags' => "Дазволеныя тэгі",
        'allowed_tags_comment' => "Ліст дазволеных тэгаў",
        'no_wrap' => "Не абгортваць тэгі",
        'no_wrap_comment' => "Ліст тэгаў, якія не абгортваюцца блокавымі тэгамі",
        'remove_tags' => "Выдаліць тэгі",
        'remove_tags_comment' => "Ліст тэгаў, якія выдаляюцца разам са зместам"
    ],
    'tooltips' => [
        'preview_website' => "Праглядзець сайт"
    ],
    'mysettings' => [
        'menu_label' => "Маі налады",
        'menu_description' => "Налады для Вашага акаунту"
    ],
    'myaccount' => [
        'menu_label' => "Мой акаунт",
        'menu_description' => "Абнавіць прыватныя налады (імя, электронную пошту, пароль)",
        'menu_keywords' => "бяспека лагін"
    ],
    'branding' => [
        'menu_label' => "Налады адлюстравання панэлі кіравання",
        'menu_description' => "Налады панэлі кіравання, такія як колер фона, лагатып, апісанні",
        'brand' => "Брэнд",
        'logo' => "Лагатып",
        'logo_description' => "Загрузіце лагатып для ўжывання ў панэлі кіравання",
        'app_name' => "Назва прыкладання",
        'app_name_description' => "Гэта імя паказваецца ў загалоўку панэлі кіравання",
        'app_tagline' => "Слоган прыкладання",
        'app_tagline_description' => "Гэты слоган паказваецца на старонцы ўваходу",
        'colors' => "Колеры",
        'primary_color' => "Галоўны колер",
        'secondary_color' => "Дадатковы колер",
        'accent_color' => "Акцэнтавы колер",
        'styles' => "Стылі",
        'custom_stylesheet' => "Карыстацкія табліцы стыляў",
        'navigation' => "Навігацыя",
        'menu_mode' => "Стыль меню",
        'menu_mode_inline' => "Строкавы",
        'menu_mode_tile' => "Плітка",
        'menu_mode_collapsed' => "Выпадаючы"
    ],
    'backend_preferences' => [
        'menu_label' => "Сістэмныя налады панэлі кіравання",
        'menu_description' => "Кіруйце такімі наладамі, як, напрыклад, мовай прыкладання",
        'region' => "Рэгіён",
        'code_editor' => "Рэдактар коду",
        'timezone' => "Часавая зона",
        'timezone_comment' => "Настройка адлюстравання дат у гэтым часавым поясе",
        'locale' => "Лакалізацыя",
        'locale_comment' => "Выберыце жаданую лакалізацыю, каб змяніць мову"
    ],
    'access_log' => [
        'hint' => "Гэты ліст паказвае паспяховыя спробы ўваходу адміністратараў. Запісы захоўваюцца на працягу :days д",
        'menu_label' => "Дзеннік доступаў",
        'menu_description' => "Прагледзець ліст паспяховых уваходаў у панэль кіравання",
        'created_at' => "Дата і час",
        'login' => "Лагін",
        'ip_address' => "IP адрас",
        'first_name' => "Імя",
        'last_name' => "Прозвішча",
        'email' => "Электронная пошта"
    ],
    'filter' => [
        'all' => 'all',
        'options_method_not_exists' => "The model class :model must define a method :method() returning options for the ':filter' filter.",
        'date_all' => 'all period'
    ],
    'import_export' => [
        'upload_csv_file' => "1. Загрузіць CSV файл",
        'import_file' => "Імпартаваць файл",
        'first_row_contains_titles' => "Першы радок утрымлівае назвы слупкоў",
        'first_row_contains_titles_desc' => "Пакіньце гэтую пазнаку, калі першы радок утрымлівае назвы слупкоў",
        'match_columns' => "2. Суаднесці слупкі з палямі ў табліцы базы дадзеных",
        'file_columns' => "Слупкі файла",
        'database_fields' => "Палі базы дадзеных",
        'set_import_options' => "3. Налады імпарту",
        'export_output_format' => "1. Фармат выходнага файлу экспарту",
        'file_format' => "Фармат файлу",
        'standard_format' => "Стандартны фармат",
        'custom_format' => "Фармат карыстальніка",
        'delimiter_char' => "Сімвал для абмежавання",
        'enclosure_char' => "Сімвал для абгароджвання",
        'escape_char' => "Сімвал для экранавання",
        'select_columns' => "2. Выберыце слупкі для экспарту",
        'column' => "Слупок",
        'columns' => "Слупкі",
        'set_export_options' => "3. Налады экспарту",
        'show_ignored_columns' => "Паказаць слупкі якія ігнаруюцца",
        'auto_match_columns' => "Аўтаматычныя суадносіны слупкоў",
        'created' => "Створана",
        'updated' => "Абноўлена",
        'skipped' => "Прапушчана",
        'warnings' => "Папярэджанні",
        'errors' => "Памылкі",
        'skipped_rows' => "Прапушчаныя радкі",
        'import_progress' => "Прагрэс імпарту",
        'processing' => "Абработка",
        'import_error' => "Памылка імпарту",
        'upload_valid_csv' => "Калі ласка, загрузіце правільны CSV файл",
        'drop_column_here' => "Скінуць слупок сюды...",
        'ignore_this_column' => "Ігнараваць гэты слупок",
        'processing_successful_line1' => "Экспарт завершаны!",
        'processing_successful_line2' => "Браўзер зараз пяройдзе да пампавання файла",
        'export_progress' => "Прагрэс экспарту",
        'export_error' => "Памылка экспарту",
        'column_preview' => "Прагляд слупкоў",
        'file_not_found_error' => "Файл не знойдзены",
        'empty_error' => "Няма дадзеных для экспарту",
        'empty_import_columns_error' => "Калі ласка, укажыце слупкі для імпарту",
        'match_some_column_error' => "Калі ласка, спачатку суаднясіце некалькі слупкоў",
        'required_match_column_error' => "Калі ласка, вызначце суадносіны для патрэбнага слупка \":label\"",
        'empty_export_columns_error' => "Калі ласка, вызначце слупкі для экспарту",
        'behavior_missing_uselist_error' => "Вы павінны вызначыць паводзіны кантролера ListController з уключанай наладай \"useList\"",
        'missing_model_class_error' => "Калі ласка вызначце modelClass уласцівасць для \":type\"",
        'missing_column_id_error' => "Прапушчаны ідэнтыфікатар слупка",
        'unknown_column_error' => "Невядомы слупок",
        'encoding_not_supported_error' => "Не атрымалася вызначыць кадзіроўку файла. Калі ласка, выберыце правільны фармат самастойна",
        'encoding_format' => "Кадзіроўка файла"
    ],
    'permissions' => [
        'manage_media' => "Загрузка і кіраванне медыя зместам - выявы, відэа, гукі, дакументы"
    ],
    'mediafinder' => [
        'label' => "Медыя каталог",
        'default_prompt' => "Націсніце %s кнопку, каб адшукаць медыя файлы"
    ],
    'media' => [
        'menu_label' => "Медыя",
        'upload' => "Загрузіць",
        'move' => "Перамясціць",
        'delete' => "Выдаліць",
        'add_folder' => "Дадаць каталог",
        'search' => "Пошук",
        'display' => "Паказаць",
        'filter_everything' => "Усё",
        'filter_images' => "Выявы",
        'filter_video' => "Відэа",
        'filter_audio' => "Аўдыё",
        'filter_documents' => "Дакументы",
        'library' => "Бібліятэка",
        'size' => "Памер",
        'title' => "Назва",
        'last_modified' => "Час апошняй мадыфікацыі",
        'public_url' => "Публічны URL",
        'click_here' => "Націсніце сюды",
        'thumbnail_error' => "Памылка падчас генерацыі мініяцюры",
        'return_to_parent' => "Вярнуцца да бацькоўскага каталогу",
        'return_to_parent_label' => "Падняцца ..",
        'nothing_selected' => "Нічога не выбрана",
        'multiple_selected' => "Шматлікія аб'екты выбраны",
        'uploading_file_num' => "Загрузка :number файла(аў)...",
        'uploading_complete' => "Загрузка скончаная",
        'uploading_error' => "Не атымалася загрузіць",
        'type_blocked' => "Гэты тып файлу заблакіраваны з-за небяспекі",
        'order_by' => "Сартаваць па",
        'folder' => "Каталог",
        'no_files_found' => "Не знойдзена файлаў па Вашым запыце",
        'delete_empty' => "Калі ласка, вызначце файлы для выдалення",
        'delete_confirm' => "Выдаліць абраныя аб'екты?",
        'error_renaming_file' => "Памылка падчас пераіменавання аб'екту",
        'new_folder_title' => "Новы каталог",
        'folder_name' => "Імя каталогу",
        'error_creating_folder' => "Памылка падчас стварэння каталогу",
        'folder_or_file_exist' => "Каталог альбо файл з такім імем ужо існуе",
        'move_empty' => "Калі ласка, выберыце аб'екты для перамяшчэння",
        'move_popup_title' => "Перамясціць файлы альбо каталогі",
        'move_destination' => "Каталог прызначэння",
        'please_select_move_dest' => "Калі ласка, выберыце каталог прызначэння",
        'move_dest_src_match' => "Калі ласка, выберыце іншы каталог прызначэння",
        'empty_library' => "Медыя бібліятэка пустая. Загрузіце файлы альбо стварыце каталогі, каб пачаць",
        'insert' => "Уставіць",
        'crop_and_insert' => "Абрэзаць і ўставіць",
        'select_single_image' => "Калі ласка, выберыце адну выяву",
        'selection_not_image' => "Абраны аб'ект не з'яўляецца файлам",
        'restore' => "Адмяніць усе змяненні",
        'resize' => "Змяніць памер...",
        'selection_mode_normal' => "Нармальны",
        'selection_mode_fixed_ratio' => "Фіксіраваныя суадносіны старонак",
        'selection_mode_fixed_size' => "Фіксіраваны памер",
        'height' => "Вышыня",
        'width' => "Шырыня",
        'selection_mode' => "Рэжым выбару",
        'resize_image' => "Змяніць памер",
        'image_size' => "Памер выявы:",
        'selected_size' => "Выбрана:"
    ]
];
