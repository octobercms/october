<?php

return [
    'auth' => [
        'title' => '시스템관리자영역'
    ],
    'aria-label' => [
        'footer'        => '보행인',
        'side_panel'    => '측면 패널',
        'breadcrumb'    => '빵 부스러기 흔적',
        'main_content'  => '주요 지역',
        'tabs'          => '탭',
    ],	
    'field' => [
        'invalid_type' => '유효하지 않은 필드타입 사용 :type ',
        'options_method_invalid_model' => "':field' 속성은 리졸브 될 수 없습니다. :model 모델 클래스의 특정 옵션 메소드를 명시적으로 사용해 보세요.",
        'options_method_not_exists' => ':model 모델 클래스는 ":field" 폼 필드의 옵션들을 반환하기위한  :method() 메소드를 정의해야 합니다.',
    ],
    'widget' => [
        'not_registered' => "':name' 위젯 클래스로 등록되지 않았습니다.",
        'not_bound' => "':name' 위젯 클래스는 컨트롤러와 바인드되지 않았습니다.",
    ],
    'page' => [
        'untitled' => "타이틀 없음",
        'access_denied' => [
            'label' => "액세스가 거부되었습니다",
            'help' => "이 페이지를 표시하기위한 권한이 없습니다.",
            'cms_link' => "CMS의 백엔드로 가기",
        ],
        'no_database' => [
            'label' => 'DB를 찾을 수 없습니다',
            'help' => "백엔드에 접속하기 위해선 DB가 필요합니다. 다시 접속하시기 전에 DB가 정상적으로 설정및 이전되었는지 확인해주세요.",
            'cms_link' => '홈페이지로 돌아가기'
        ],
        'invalid_token' => [
            'label' => '잘못된 보안 토큰'
        ]
    ],
    'partial' => [
        'not_found_name' => "':name' 페이지를 찾을 수 없습니다.",
    ],
    'account' => [
        'sign_out' => '로그아웃',
        'login' => '로그인',
        'reset' => '리셋',
        'restore' => '되돌리기',
        'login_placeholder' => '아이디',
        'password_placeholder' => '비밀번호',
        'forgot_password' => "비밀번호를 잊어버리셨습니까?",
        'enter_email' => "이메일 주소를 입력해주세요",
        'enter_login' => "아이디를 입력해 주세요",
        'email_placeholder' => "이메일 주소",
        'enter_new_password' => "변경할 비밀번호를 입력해주세요",
        'password_reset' => "비밀번호 재설정",
        'restore_success' => "비밀번호를 복구하기 위한 절차를 설명한 메일을 발송합니다.",
        'restore_error' => "':login' 아이디는 등록되어있지 않습니다.",
        'reset_success' => "비밀번호가 재설정 되었습니다.",
        'reset_error' => "잘못된 비밀번호 재설정 데이터가 발송되었습니다. 다시 해주세요.",
        'reset_fail' => "비밀번호를 재설정 할 수 없습니다.",
        'apply' => '적용',
        'cancel' => '취소',
        'delete' => '삭제',
        'ok' => 'OK',
    ],
    'dashboard' => [
        'menu_label' => '대시보드',
        'widget_label' => '위젯',
        'widget_width' => '위젯 넓이',
        'full_width' => '전체 넓이',
        'manage_widgets' => '위젯 관리',
        'add_widget' => '위젯 추가',
        'widget_inspector_title' => '위젯 환경설정',
        'widget_inspector_description' => '리포트 위젯',
        'widget_columns_label' => '넓이 :columns',
        'widget_columns_description' => '위젯 넓이는 1에서 10까지 숫자입니다.',
        'widget_columns_error' => '위젯 넓이는 1에서 10까지의 숫자로 입력해주세요.',
        'columns' => '{1} 열|[2,Inf] 열',
        'widget_new_row_label' => '신규 행',
        'widget_new_row_description' => '신규 행에 위젯을 놓습니다.',
        'widget_title_label' => '위젯 제목',
        'widget_title_error' => '위젯 제목이 필요합니다.',
        'reset_layout' => '레이아웃 재설정',
        'reset_layout_confirm' => '초기값으로 레이아웃을 재설정할까요?',
        'reset_layout_success' => '레이아웃이 초기화 되었습니다',
        'make_default' => '기본값으로',
        'make_default_confirm' => '현재 레이아웃을 기본값으로 할까요?',
        'make_default_success' => '현재 레이아웃을 기본값으로 설정했습니다',
        'collapse_all' => '전체 접기',
        'expand_all' => '전체 펼치기',
        'status' => [
            'widget_title_default' => '시스템 상태',
            'update_available' => '{0} 업데이트 가능!|{1} 업데이트 가능!|[2,Inf] 업데이트 가능!',
            'updates_pending' => 'SW 업데이트 보류',
            'updates_nil' => 'SW가 업데이트 되었습니다',
            'updates_link' => '업데이트',
            'warnings_pending' => '몇몇 이슈는 주의가 필요합니다',
            'warnings_nil' => '표시할 경고가 없습니다',
            'warnings_link' => '보기',
            'core_build' => '시스템 빌드',
            'event_log' => '이벤트 로그',
            'request_log' => '요청 로그',
            'app_birthday' => '온라인시간 ',
        ],
        'welcome' => [
            'widget_title_default' => '환영합니다',
            'welcome_back_name' => ':app로 돌아오신것을 환영합니다, :name님',
            'welcome_to_name' => ':app로 오신것을 환영합니다, :name님',
            'first_sign_in' => '이번이 최초접속입니다.',
            'last_sign_in' => '당신의 최종 접속은 ',
            'view_access_logs' => '접속 로그 보기',
            'nice_message' => '좋은 하루 되세요!',
        ]
    ],
    'user' => [
        'name' => '사용자관리',
        'menu_label' => '사용자관리',
        'menu_description' => '백엔드 관리, 사용자,그룹 및 권한 관리.',
        'list_title' => '사용자 관리',
        'new' => '신규사용자',
        'login' => "아이디",
        'first_name' => "이름",
        'last_name' => "성",
        'full_name' => "성명",
        'email' => "이메일주소",
        'groups' => "그룹",
        'groups_comment' => "이 사용자가 소속될 그룹을 선택해 주세요.",
        'avatar' => "아바타",
        'password' => "비밀번호",
        'password_confirmation' => "비밀번호 확인",
        'permissions' => '권한',
        'superuser' => "수퍼유저",
        'superuser_comment' => "전영역의 접속을 이사용자에게 허가하길 원할경우 체크해주세요.",
        'send_invite' => '이메일로 초대장 발송',
        'send_invite_comment' => '이 사용자에 초대장을 발송하길 원할경우 체크해주세요.',
        'delete_confirm' => '이 사용자를 정말로 삭제하시겠습니까?',
        'return' => '사용자관리로 돌아가기',
        'allow' => '허가',
        'inherit' => '상속',
        'deny' => '거부',
        'activated' => '활성화됨',
        'last_login' => '최종접속',
        'created_at' => '생성일시',
        'updated_at' => '변경일시',
        'group' => [
            'name' => '그룹',
            'name_comment' => '사용자 관리폼에 표시될 그룹목록에 표시됩니다.',
            'name_field' => '이름',
            'description_field' => '설명',
            'is_new_user_default_field_label' => '기본 그룹',
            'is_new_user_default_field_comment' => '신규 사용자를 이 그룹에 자동으로 소속시킵니다.',
            'code_field' => '코드',
            'code_comment' => 'API로 그룹 오브젝트에 접근하길 원할경우 고유한 코드를 입력해주세요.',
            'menu_label' => '그룹 관리',
            'list_title' => '그룹 관리',
            'new' => '신규 그룹',
            'delete_confirm' => '이 사용자 그룹을 삭제하시겠습니까?',
            'return' => '그룹 관리로 돌아가기',
            'users_count' => '명'
        ],
        'preferences' => [
            'not_authenticated' => '설정을 저장하기 위한 권한확인이 되지 않았습니다.'
        ]
    ],
    'list' => [
        'default_title' => '목록',
        'search_prompt' => '검색...',
        'no_records' => '표시할 기록이 없습니다.',
        'missing_model' => ':class 클래스의 목록 행동이 모델 정의를 가지고 있지 않습니다.',
        'missing_column' => ':columns 를 위한 칼럼정의가 없습니다.',
        'missing_columns' => ':class 클래스에서 사용하는 List에 칼럼정의가 없습니다.',
        'missing_definition' => "목록 행동이 ':field' 칼럼을 포함하지 않습니다.",
        'missing_parent_definition' => "목록 행동 ':definition' 정의를 포함하지 않습니다.",
        'behavior_not_ready' => '목록 행동이 초기화되지 않았습니다. 컨트롤러의 makeLists() 를 체크해주세요.',
        'invalid_column_datetime' => "':column' 칼럼값이 DateTime 객체가 아닙니다. 모델에서 \$dates 참조를 잊어버리지 않았습니까?",
        'pagination' => '총 :total 중 표시된 기록: :from-:to',
        'first_page' => '처음',
        'last_page' => '마지막',
        'prev_page' => '이전',
        'next_page' => '다음',
        'refresh' => '새로고침',
        'updating' => '변경중...',
        'loading' => '로딩중...',
        'setup_title' => '목록 설정',
        'setup_help' => '목록에 표시하길 원하는 열에 체크하세요. 위아래로 드래그해서 위치를 변경할 수 있습니다.',
        'records_per_page' => '페이지당 목록갯수',
        'records_per_page_help' => '페이지당 표시할 목록 갯수를 선택하세요. 많이 설정할수록 페이지 표시속도가 느려질 수 있습니다.',
        'check' => '체크',
        'delete_selected' => '선택삭제',
        'delete_selected_empty' => '삭제할 기록이 없습니다.',
        'delete_selected_confirm' => '선택하신 기록을 삭제하시겠습니까?',
        'delete_selected_success' => '선택하신 기록을 삭제했습니다.',
        'column_switch_true' => 'Y',
        'column_switch_false' => 'N'
    ],
    'fileupload' => [
        'attachment' => '첨부',
        'help' => '이 첨부에 대한 제목과  설명을 추가.',
        'title_label' => '제목',
        'description_label' => '설명',
        'default_prompt' => '여기에 %s 클릭하거나 파일 드래그하여 업로드',
        'attachment_url' => '첨부 URL',
        'upload_file' => '파일 업로드',
        'upload_error' => '업로드 오류',
        'remove_confirm' => '삭제하시겠습니까?',
        'remove_file' => '파일 삭제'
    ],
    'form' => [
        'create_title' => '신규 :name',
        'update_title' => '수정 :name',
        'preview_title' => '미리보기 :name',
        'create_success' => ':name 생성됨',
        'update_success' => ':name 변경됨',
        'delete_success' => ':name 삭제됨',
        'reset_success' => '재설정 완료',
        'missing_id' => 'Form 기록의 ID가 특정되지 않았습니다.',
        'missing_model' => ':class 에서 사용하는 폼 행동이 모델정의를 가지고 있지 않습니다.',
        'missing_definition' => "폼 행동 ':field' 를 위한 필드를 가지고 있지 않습니다.",
        'not_found' => ':id 아이디의 Form 레코드를 찾을 수 없습니다.',
        'action_confirm' => '진행하시겠습니까?',
        'create' => '생성',
        'create_and_close' => '생성후 닫기',
        'creating' => '생성중...',
        'creating_name' => '생성중 :name...',
        'save' => '저장',
        'save_and_close' => '저장후 닫기',
        'saving' => '저장중...',
        'saving_name' => '저장중 :name...',
        'delete' => '삭제',
        'deleting' => '삭제중...',
        'confirm_delete' => '삭제하시겠습니까?',
        'confirm_delete_multiple' => '선택하신 기록을 삭제하시겠습니까?',
        'deleting_name' => '삭제중 :name...',
        'reset_default' => '초기값으로 재설정',
        'resetting' => '재설정중',
        'resetting_name' => '재설정 :name',
        'undefined_tab' => '기타',
        'field_off' => '끔',
        'field_on' => '켬',
        'add' => '추가',
        'apply' => '적용',
        'cancel' => '취소',
        'close' => '닫기',
        'confirm' => '확인',
        'reload' => '갱신',
        'complete' => '완료',
        'ok' => 'OK',
        'or' => 'or',
        'confirm_tab_close' => '탭을 닫으시겠습니까? 저장하지 않은 내용은 잃게됩니다.',
        'behavior_not_ready' => '폼 행동이 초기화되지 않았습니다. 컨트롤러에서 initForm()을 체크해보세요.',
        'preview_no_files_message' => '업로드할 파일이 없습니다.',
        'preview_no_media_message' => '선택하신 미디어가 없습니다.',
        'preview_no_record_message' => '선택하신 기록이 없습니다.',
        'select' => '선택',
        'select_all' => '전체선택',
        'select_none' => '선택없음',
        'select_placeholder' => '선택해주세요',
        'insert_row' => '행 추가',
        'insert_row_below' => '아래 행 추가',
        'delete_row' => '행 삭제',
        'concurrency_file_changed_title' => '파일이 변경되었습니다',
        'concurrency_file_changed_description' => "다른 사용자에의해 파일이 변경되었습니다. 갱신하여 변경내용을 버리거나 덮어쓰기를 하실 수 있습니다.",
        'return_to_list' => '목록으로 돌아가기'
    ],
    'recordfinder' => [
        'find_record' => '기록 찾기',
        'cancel' => '취소',
    ],
    'pagelist' => [
        'page_link' => '페이지 링크',
        'select_page' => '페이지를 선택...'
    ],
    'relation' => [
        'missing_config' => "릴레이션 행동은 ':config' 설정을 가지고 있지 않습니다.",
        'missing_definition' => "릴레이션 행동이 ':field' 필드에 대한 정의를 가지고 있지 않습니다.",
        'missing_model' => ":class 클래스에서 사용하는 릴레이션 행동은 모델정의를 가지고 있지 않습니다.",
        'invalid_action_single' => "이 동작은 단 릴레이션에서는 실행하실 수 없습니다.",
        'invalid_action_multi' => "이 동작은 복수 릴레이션에서는 실행하실 수 없습니다.",
        'help' => '항목을 클릭하시면 추가합니다.',
        'related_data' => "관련데이터 :name",
        'add' => "추가",
        'add_name' => "추가 :name",
        'add_selected' => "추가가 선택되어 있습니다",
        'add_a_new' => "신규추가 :name",
        'link_selected' => "링크가 선택되어 있습니다",
        'link_a_new' => "신규링크 :name",
        'cancel' => "취소",
        'close' => "닫기",
        'create' => "생성",
        'create_name' => "생성 :name",
        'update' => "변경",
        'update_name' => "변경 :name",
        'preview' => "미리보기",
        'preview_name' => "미리보기 :name",
        'remove' => "삭제",
        'remove_name' => "삭제 :name",
        'delete' => "삭제",
        'delete_name' => "삭제 :name",
        'delete_confirm' => "삭제해도 될까요?",
        'link' => "링크",
        'link_name' => "링크 :name",
        'unlink' => "링크삭제",
        'unlink_name' => "링크삭제 :name",
        'unlink_confirm' => "링크를 삭제해도 될까요？",
    ],
    'reorder' => [
        'default_title' => '기록순서변경',
        'no_records' => '분류할 기록이 없습니다.'
    ],
    'model' => [
        'name' => "모델",
        'not_found' => "ID가 :id인 ':class' 모델을 찾을 수 없습니다.",
        'missing_id' => "모델 레코드를 찾기위한 ID 설정되어 있지 않습니다.",
        'missing_relation' => "':class' 모델은 ':relation'의 정의를 가지고있지 않습니다.",
        'missing_method' => "':class' 모델에 ':method' 메소드가 정의되어있지 않습니다.",
        'invalid_class' => ":class 로 사용되는 :model 모델이 올바르지 않습니다. \Model 클래스를 상속해주세요.",
        'mass_assignment_failed' => "':attribute' 모델속성의 일괄설정에 실패하였습니다.",
    ],
    'warnings' => [
        'tips' => '시스템설정 팁',
        'tips_description' => '당신이 시스템을 적절하게 설정하기위해 명심해야할 이슈들이 있습니다.',
        'permissions'  => '":name" 디렉토리 또는 서브디렉토리는 PHP에서 쓸 수 없습니다. 이 디렉토리의 퍼미션을 설정해주세요.',
        'extension' => '":name" PHP 익스텐션이 설치되어있지 않습니다. 설치후 활성화해주세요.',
        'plugin_missing' => ':name 플러그인에 의존성이 해결되지 않았습니다. 이 플러그인을 설치해주세요.',
    ],
    'editor' => [
        'menu_label' => '에디터 설정',
        'menu_description' => '폰트 사이즈나 컬러 스키마등의 전역 에디터의 설정.',
        'font_size' => '폰트크기',
        'tab_size' => '텝사이즈',
        'use_hard_tabs' => '텝으로 들여쓰기사용',
        'code_folding' => '코드 접기',
        'code_folding_begin' => '마크사용',
        'code_folding_begin_end' => '마크사용과 종료',
        'autocompletion' => '자동완성',
        'word_wrap' => '줄바꿈',
        'highlight_active_line' => '현재라인강조',
        'auto_closing' => '자동 테그닫기',
        'show_invisibles' => '보이지않는 문자 보기',
        'show_gutter' => '라인넘버보기',
        'basic_autocompletion'=> '기본 자동완성 (Ctrl + Space)',
        'live_autocompletion'=> '라이브 자동완성',
        'enable_snippets'=> '코드 스니핏 사용 (Tab)',
        'display_indent_guides'=> '들여쓰기 가이드 표시',
        'show_print_margin'=> '출력마진 보기',
        'mode_off' => 'Off',
        'mode_fluid' => 'Fluid',
        '40_characters' => '40 문자',
        '80_characters' => '80 문자',
        'theme' => '색상 스키마',
        'markup_styles' => '마크업 스타일',
        'custom_styles' => '별도의 스타일시트',
        'custom styles_comment' => '에디터에 별도의 스타일시트를 포함시킨다.',
        'markup_classes' => '마크업 클래스',
        'paragraph' => '단락',
        'link' => '링크',
        'table' => '테이블',
        'table_cell' => '셀',
        'image' => '이미지',
        'label' => '라벨',
        'class_name' => '클래스 이름',
        'markup_tags' => '마크업 테그들',
        'allowed_empty_tags' => '빈테그 허용',
        'allowed_empty_tags_comment' => '내용이 없어도 제거하지 않을 테그목록',
        'allowed_tags' => '허용된 테그들',
        'allowed_tags_comment' => '허용된 테그목록',
        'no_wrap' => '테그를 줄바꿈하지 않음',
        'no_wrap_comment' => '블록 테그안에서 줄바꿈 하지않을 테그목록',
        'remove_tags' => '테그제거',
        'remove_tags_comment' => '내용과 함께 제거할 테그목록'
    ],
    'tooltips' => [
        'preview_website' => '웹사이트 미리보기'
    ],
    'mysettings' => [
        'menu_label' => '내 설정',
        'menu_description' => '사용자 계정의 설정을 합니다.'
    ],
    'myaccount' => [
        'menu_label' => '계정',
        'menu_description' => '이름, 이메일주소, 비밀번호 등의 계정 세부정보를 변경해주세요.',
        'menu_keywords' => '보안 로그인'
    ],
    'branding' => [
        'menu_label' => '백엔드 설정변경',
        'menu_description' => '앱 이름이나 색, 로고 등의 시스템 설정을 변경합니다.',
        'brand' => '브랜드',
        'logo' => '로고',
        'logo_description' => '백엔드에서 사용하는 로고를 업로드합니다.',
        'app_name' => '앱 이름',
        'app_name_description' => '이 이름은 백엔드의 타이틀영역에 표시됩니다.',
        'app_tagline' => '앱 테그라인',
        'app_tagline_description' => '이 이름은 백엔드의 로그인 페이지에 표시됩니다.',
        'colors' => '색상',
        'primary_color' => '주요 색상',
        'secondary_color' => '부수적인 색상',
        'accent_color' => '강조 색상',
        'styles' => '스타일',
        'custom_stylesheet' => '별도의 스타일시트',
        'navigation' => '네비게이션',
        'menu_mode' => '메뉴 스타일',
        'menu_mode_inline' => '인라인',
        'menu_mode_tile' => '타일',
        'menu_mode_collapsed' => '접힘'
    ],
    'backend_preferences' => [
        'menu_label' => '백엔드 환경설정',
        'menu_description' => '당신 계정의 사용언어 등의 환경설정',
        'region' => '지역',
        'code_editor' => '코드 에디터',
        'timezone' => '타임존',
        'timezone_comment' => '타임존에 맞는 날짜 조정.',
        'locale' => '로케일',
        'locale_comment' => '사용언어에 맞는 로케일을 선택해주세요.'
    ],
    'access_log' => [
        'hint' => '이 로그는 사용자들의 성공적인 로그인 접속 기록 목록을 표시합니다. 총 :days일보관함.',
        'menu_label' => '접속 로그',
        'menu_description' => '백엔드 계정의 성공 로그인 기록보기',
        'created_at' => '일시',
        'login' => '계정',
        'ip_address' => 'IP주소',
        'first_name' => '이름',
        'last_name' => '성',
        'email' => '이메일'
    ],
    'filter' => [
        'all' => '전체',
        'options_method_not_exists' => ":model 모델클래스는 ':filter' 필터옵션을 리턴하기위해서 반드시 :method() 메소드를 정의해야합니다.",
        'date_all' => '전체기간'
    ],
    'import_export' => [
        'upload_csv_file' => '1. CSV 파일 업로드',
        'import_file' => '파일 가져오기',
        'first_row_contains_titles' => '첫 행에 열 제목을 담기',
        'first_row_contains_titles_desc' => '첫 행을 CSV의 열 타이틀로 쓰려면 이 항목을 체크해주세요.',
        'match_columns' => '2. DB필드와 파일열을 일치',
        'file_columns' => '파일 열',
        'database_fields' => 'DB 필드',
        'set_import_options' => '3. 가져오기 옵션 설정',
        'export_output_format' => '1. 내보내기 출력 형식',
        'file_format' => '파일 형식',
        'standard_format' => '표준 형식',
        'custom_format' => '다른 형식',
        'delimiter_char' => '구분자 문자',
        'enclosure_char' => '종결 문자',
        'escape_char' => '회피 문자',
        'select_columns' => '2. 내보낼 열을 선택',
        'column' => '열',
        'columns' => '열들',
        'set_export_options' => '3. 내보내기 옵션 설정',
        'show_ignored_columns' => '무시한 열들 표시',
        'auto_match_columns' => '자동 일치 열',
        'created' => '생성됨',
        'updated' => '변경됨',
        'skipped' => '건너뜀',
        'warnings' => '경고',
        'errors' => '오류',
        'skipped_rows' => '건너뛴 행',
        'import_progress' => '가져오기 처리',
        'processing' => '처리중',
        'import_error' => '가져오기 오류',
        'upload_valid_csv' => '유효한 CSV파일을 업로드하세요.',
        'drop_column_here' => '이곳에 열을 떨굼...',
        'ignore_this_column' => '이 열을 무시',
        'processing_successful_line1' => '파일 내보내기 과정이 완료되었습니다!',
        'processing_successful_line2' => '브라우저가 파일다운로드 화면으로 이동합니다.',
        'export_progress' => '내보내기 처리',
        'export_error' => '내보내기 오류',
        'column_preview' => '열 미리보기',
        'file_not_found_error' => '파일을 찾을 수 없습니다',
        'empty_error' => '내보내기 위한 데이터가 없습니다',
        'empty_import_columns_error' => '가져올 열을 정해주세요.',
        'match_some_column_error' => '먼저 일치시킬 열을 선택해주세요.',
        'required_match_column_error' => '필요한 :label 필드에 일치시킬 짝을 선택해주세요.',
        'empty_export_columns_error' => '내보낼 열을 선택해주세요.',
        'behavior_missing_uselist_error' => '컨트롤러 행동 ListController를 useList 옵션을 켜고 내보내기를 시행해야만합니다.',
        'missing_model_class_error' => ':type 타입을 위한 모델 성질을 선택해주세요.',
        'missing_column_id_error' => '잃은 열의 식별자',
        'unknown_column_error' => '모르는 열',
        'encoding_not_supported_error' => '원본 파일의 인코딩을 인식할 수 없습니다. 가져오기를 위해선 정당한 인코딩의 자체파일포멧을 선택해주세요.',
        'encoding_format' => '파일 인코딩',
        'encodings' => [
            'utf_8' => 'UTF-8',
            'us_ascii' => 'US-ASCII',
            'iso_8859_1' => 'ISO-8859-1 (Latin-1, Western European)',
            'iso_8859_2' => 'ISO-8859-2 (Latin-2, Central European)',
            'iso_8859_3' => 'ISO-8859-3 (Latin-3, South European)',
            'iso_8859_4' => 'ISO-8859-4 (Latin-4, North European)',
            'iso_8859_5' => 'ISO-8859-5 (Latin, Cyrillic)',
            'iso_8859_6' => 'ISO-8859-6 (Latin, Arabic)',
            'iso_8859_7' => 'ISO-8859-7 (Latin, Greek)',
            'iso_8859_8' => 'ISO-8859-8 (Latin, Hebrew)',
            'iso_8859_0' => 'ISO-8859-9 (Latin-5, Turkish)',
            'iso_8859_10' => 'ISO-8859-10 (Latin-6, Nordic)',
            'iso_8859_11' => 'ISO-8859-11 (Latin, Thai)',
            'iso_8859_13' => 'ISO-8859-13 (Latin-7, Baltic Rim)',
            'iso_8859_14' => 'ISO-8859-14 (Latin-8, Celtic)',
            'iso_8859_15' => 'ISO-8859-15 (Latin-9, Western European revision with euro sign)',
            'windows_1251' => 'Windows-1251 (CP1251)',
            'windows_1252' => 'Windows-1252 (CP1252)'
        ]
    ],
    'permissions' => [
        'manage_media' => '미디어관리와 업로드 - 이미지, 동영상, 소리, 문서'
    ],
    'mediafinder' => [
        'label' => '미디어 탐색기',
        'default_prompt' => '%s 버튼 클릭하여 미디어 아이템 찾기'
    ],
    'media' => [
        'menu_label' => '미디어',
        'upload' => '업로드',
        'move' => '이동',
        'delete' => '삭제',
        'add_folder' => '폴더 추가',
        'search' => '검색',
        'display' => '표시방법',
        'filter_everything' => '전체표시',
        'filter_images' => '이미지',
        'filter_video' => '동영상',
        'filter_audio' => '소리',
        'filter_documents' => '문서',
        'library' => '라이브러리',
        'size' => '용량',
        'title' => '제목',
        'last_modified' => '최종변경',
        'public_url' => '다운로드 URL',
        'click_here' => '클릭해주세요',
        'thumbnail_error' => '썸네일 생성 오류.',
        'return_to_parent' => '상위 폴더로 돌아가기',
        'return_to_parent_label' => '상위 폴더 ..',
        'nothing_selected' => '선택없음.',
        'multiple_selected' => '여러개 선택됨.',
        'uploading_file_num' => ':number 파일 업로드중...',
        'uploading_complete' => '업로드 완료',
        'uploading_error' => '업로드 실패',
        'type_blocked' => '보안문제로 해당 파일타입은 불가능합니다.',
        'order_by' => '정렬방법',
        'folder' => '폴더',
        'no_files_found' => '요청하신 파일을 찾을 수 없습니다.',
        'delete_empty' => '삭제할 대상을 선택해 주세요.',
        'delete_confirm' => '선택하신 대상을 삭제하시겠습니까?',
        'error_renaming_file' => '이름변경 오류.',
        'new_folder_title' => '신규 폴더',
        'folder_name' => '폴더 이름',
        'error_creating_folder' => '폴더 생성 오류',
        'folder_or_file_exist' => '해당 이름의 파일이나 폴더가 이미 존재합니다.',
        'move_empty' => '이동할 대상을 선택하세요.',
        'move_popup_title' => '파일이나 폴더를 이동',
        'move_destination' => '목적지 폴더',
        'please_select_move_dest' => '목적지 폴더를 선택하세요.',
        'move_dest_src_match' => '다른 목적지 폴더를 선택하세요.',
        'empty_library' => '라이브러리가 비어있습니다. 파일을 업로드하거나 폴더를 생성하여 시작해보세요.',
        'insert' => '삽입',
        'crop_and_insert' => '자르기 & 삽입',
        'select_single_image' => '한개의 이미지를 선택해주세요.',
        'selection_not_image' => '선택하신 것은 이미지가 아닙니다.',
        'restore' => '모든 변경 되돌리기',
        'resize' => '크기변경...',
        'selection_mode_normal' => '일반',
        'selection_mode_fixed_ratio' => '고정 비율',
        'selection_mode_fixed_size' => '고정 크기',
        'height' => '높이',
        'width' => '넓이',
        'selection_mode' => '선택 모드',
        'resize_image' => '이미지 크기 변경',
        'image_size' => '이미지 크기:',
        'selected_size' => '선택크기:'
    ],
];
