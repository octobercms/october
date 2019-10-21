<?php

return [
    'cms_object' => [
        'invalid_file' => '올바르지않은 파일명: :name .파일명은 영문자, 언더스코어(_), 하이픈(-), 피리오드(.) 로만 구성되어야 합니다. (올바른파일명예: page, page.htm, subdirectory/page)',
        'invalid_property' => '":name" 속성(Property)을 할당할 수 없습니다.',
        'file_already_exists' => '이미 ":name"이 존재합니다.',
        'error_saving' => '":name" 파일 저장 오류',
        'error_creating_directory' => ':name 디렉토리 작성 오류',
        'invalid_file_extension'=>'올바르지 않은 파일 확장자: :invalid. 허가된 확장자는 :allowed 입니다.',
        'error_deleting' => '":name" 파일 삭제 오류',
        'delete_success' => ':count 개의 템플릿을 삭제했습니다.',
        'file_name_required' => '파일명 필드가 필요합니다.',
        'safe_mode_enabled' => '안전모드가 활성화 되었습니다.'
    ],
    'dashboard' => [
        'active_theme' => [
            'widget_title_default' => '웹사이트',
            'online' => '온라인',
            'maintenance' => '유지보수중',
            'manage_themes' => '테마관리',
            'customize_theme' => '테마변경'
        ]
    ],
    'theme' => [
        'not_found_name' => "':name' 테마를 찾을 수 없습니다.",
        'by_author' => 'By :name',
        'active' => [
            'not_set' => "활성 테마가 설정되어 있지 않습니다.",
            'not_found' => '활성 테마를 발견할 수 없습니다.',
        ],
        'edit' => [
            'not_set' => "편집 테마가 설정되어있지 않습니다.",
            'not_found' => "편집 테마를 발견할 수 없습니다.",
            'not_match' => "접근하려는 오브젝트는 편집 테마에 속할 수 없습니다. 페이지를 다시 로드해주세요.",
        ],
        'settings_menu' => '프론트엔드 테마',
        'settings_menu_description' => '설치된 테마와 활성 테마 목록의 미리보기.',
        'default_tab' => '속성',
        'name_label' => '이름',
        'name_create_placeholder' => '신규 테마명',
        'author_label' => '작성자',
        'author_placeholder' => '개인/회사 이름',
        'description_label' => '설명',
        'description_placeholder' => '테마 설명',
        'homepage_label' => '홈페이지',
        'homepage_placeholder' => '웹사이트 URL',
        'code_label' => '코드',
        'code_placeholder' => '배포를 위한 고유한 코드',
        'preview_image_label' => '이미지 미리보기',
        'preview_image_placeholder' => '테마 미리보기 이미지 경로',
        'dir_name_label' => '디렉토리 이름',
        'dir_name_create_label' => '목표 테마 디렉토리',
        'theme_label' => '테마',
        'theme_title' => '테마목록',
        'activate_button' => '활성화',
        'active_button' => '활성화',
        'customize_theme' => '테마 변경',
        'customize_button' => '테마변경',
        'duplicate_button' => '테마복사',
        'duplicate_title' => '테마 복사',
        'duplicate_theme_success' => '테마가 복사되었습니다!',
        'manage_button' => '테마관리',
        'manage_title' => '테마 관리',
        'edit_properties_title' => '속성 변경',
        'edit_properties_button' => '속성변경',
        'save_properties' => '속성 저장',
        'import_button' => '가져오기',
        'import_title' => '테마 가져오기',
        'import_theme_success' => '테마 가져오기가 완료되었습니다!',
        'import_uploaded_file' => '테마 보관 파일',
        'import_overwrite_label' => '현재 파일 덮어쓰기',
        'import_overwrite_comment' => '없는 파일판 가져오기 원할경우 체크 해제',
        'import_folders_label' => '폴더목록',
        'import_folders_comment' => '가져오기 원하는 테마 폴더를 선택하세요.',
        'export_button' => '내보내기',
        'export_title' => '테마 내보내기',
        'export_folders_label' => '폴더목록',
        'export_folders_comment' => '내보내기 원하는 테마 폴더를 선택하세요.',
        'delete_button' => '삭제',
        'delete_confirm' => '이 테마를 삭제하시겠습니까? 되돌릴 수 없습니다!',
        'delete_active_theme_failed' => '활성 테마는 삭제할 수 없습니다. 다른 테마를 활성상태로 변경하세요.',
        'delete_theme_success' => '테마가 삭제되었습니다!',
        'create_title' => '테마 생성',
        'create_button' => '생성',
        'create_new_blank_theme' => '신규 테마 생성',
        'create_theme_success' => '테마가 생성되었습니다!',
        'create_theme_required_name' => '테마 이름을 설정하세요.',
        'new_directory_name_label' => '테마 디렉토리',
        'new_directory_name_comment' => '복제된 테마를 위한 신규 디렉토리 이름을 설정하세요.',
        'dir_name_invalid' => '디렉토리 이름은 오직 숫자, 알파벳, 언더스코어와 하이픈(_,-)만 가능합니다.',
        'dir_name_taken' => '원하는 디렉토리가 이미 있습니다.',
        'find_more_themes' => '테마 더 찾아보기',
        'saving' => '테마를 저장하는 중입니다...',
        'return' => '테마 목록으로 돌아가기'
    ],
    'maintenance' => [
        'settings_menu' => '유지보수모드',
        'settings_menu_description' => '유지보수모드 페이지의 설정과 변경을 합니다.',
        'is_enabled' => '유지보수모드 활성화',
        'is_enabled_comment' => '유지보수모드일때 웹사이트 방문자가 보는 페이지를 선택해주세요.',
        'hint' => '유지보수모드는 백엔드에 로그인하지않은 방문자에 유지보수안내 페이지를 표시합니다.'
    ],
    'page' => [
        'not_found_name' => "':name' 페이지가 없습니다.",
        'not_found' => [
            'label' => "페이지를 찾을 수 없습니다.",
            'help' => "요청 페이지를 찾을 수 없었습니다.",
        ],
        'custom_error' => [
            'label' => "페이지 오류",
            'help' => "죄송합니다. 뭔가 문제가 있는것 같아 페이지를 표시할 수 없습니다.",
        ],
        'menu_label' => '페이지',
        'unsaved_label' => '저장안한 페이지',
        'no_list_records' => '페이지를 찾을 수 없습니다',
        'new' => '신규 페이지',
        'invalid_url' => '올바르지 않은 URL형식。URL은 슬래쉬(/)로 시작 숫자, 알파벳, ._-[]:?|/+*^$ 로 구성됩니다.',
        'delete_confirm_multiple' => '선택하신 페이지 전체를 정말로 삭제하시겠습니까?',
        'delete_confirm_single' => '선택하신 페이지를 삭제하시겠습니까?',
        'no_layout' => '-- 레이아웃 없음 --',
        'cms_page' => 'CMS 페이지',
        'title' => '페이지 제목',
        'url' => '페이지 URL',
        'file_name' => '페이지 파일 이름'
    ],
    'layout' => [
        'not_found_name' => "':name' 레이아웃이 없습니다.",
        'menu_label' => '레이아웃',
        'unsaved_label' => '저장하지 않은 레이아웃',
        'no_list_records' => '레이아웃을 발견할 수 없습니다',
        'new' => '신규 레이아웃',
        'delete_confirm_multiple' => '선택하신 레이아웃 전체를 정말로 삭제하시겠습니까?',
        'delete_confirm_single' => '선택하신 레이아웃을 삭제하시겠씁니까?',
    ],
    'partial' => [
        'not_found_name' => "':name' 파셜이 없습니다.",
        'invalid_name' => "올바르지 않은 파셜명: :name",
        'menu_label' => '파셜',
        'unsaved_label' => '저장하지 않은 파셜',
        'no_list_records' => '파셜을 발견할 수 없습니다',
        'delete_confirm_multiple' => '선택하신 파셜 전체를 정말로 삭제하시겠습니까?',
        'delete_confirm_single' => '선택하신 파셜을 삭제하시겠습니까?',
        'new' => '신규 파셜',
    ],
    'content' => [
        'not_found_name' => "':name' 콘텐츠 파일이 없습니다.",
        'menu_label' => '콘텐츠',
        'unsaved_label' => '저장하지 않은 콘텐츠',
        'no_list_records' => '콘텐츠 파일을 발견할 수 없습니다',
        'delete_confirm_multiple' => '선택하신 콘텐츠/디렉토리 전체를 정말로 삭제하시겠습니까?',
        'delete_confirm_single' => '선택하신 콘첸츠 파일을 삭제하시겠습니까?',
        'new' => '신규 콘텐츠 파일',
    ],
    'ajax_handler' => [
        'invalid_name' => "올바르지 않은 Ajax핸들러이름: :name",
        'not_found' => "':name' Ajax핸들러를 찾을 수 없습니다.",
    ],
    'cms' => [
        'menu_label' => "CMS",
    ],
    'sidebar' => [
        'add' => '추가',
        'search' => '검색...',
    ],
    'editor' => [
        'settings' => '설정',
        'title' => '타이틀',
        'new_title' => '신규 페이지 타이틀',
        'url' => 'URL',
        'filename' => '파일명',
        'layout' => '레이아웃',
        'description' => '설명',
        'preview' => '미리보기',
        'meta' => '메타',
        'meta_title' => '메타 타이틀',
        'meta_description' => '메타 설명',
        'meta_robots_noindex'=> '이 페이지의 색인을 생성하기 위해 검색 엔진을 비활성화 하시겠습니까?',
        'meta_robots_noindex_comment'=> '일반 사용자는 검색 엔진에서 숨겨진 페이지를 방문합니다.',
        'meta_robots_nofollow'=> '검색 엔진이이 페이지의 링크를 따라 가지 못하게 하시겠습니까?',
        'meta_robots_noarchive'=> '검색 엔진 페이지 보관을 제공 하시겠습니까?',
        'markup' => '마크업',
        'code' => '코드',
        'content' => '콘텐츠',
        'hidden' => '표시안함',
        'hidden_comment' => '프론트엔드에 페이지를 표시하지 않습니다. 백엔드에서 보기/편집이 가능합니다.',
        'enter_fullscreen' => '전체화면모드',
        'exit_fullscreen' => '전체화면모드 해제',
        'open_searchbox' => '검색 열기',
        'close_searchbox'  => '검색 닫기',
        'open_replacebox' => '교체 열기',
        'close_replacebox'  => '교체 닫기'
    ],
    'asset' => [
        'menu_label' => "자산",
        'unsaved_label' => '저장하지 않은 자산',
        'drop_down_add_title' => '추가...',
        'drop_down_operation_title' => '동작...',
        'upload_files' => '파일 업로드',
        'create_file' => '파일 작성',
        'create_directory' => '디렉토리 작성',
        'directory_popup_title' => '신규 디렉토리',
        'directory_name' => '디렉토리명',
        'rename' => '이름변경',
        'delete' => '삭제',
        'move' => '이동',
        'select' => '선택',
        'new' => '신규 파일',
        'rename_popup_title' => '이름변경',
        'rename_new_name' => '새 이름',
        'invalid_path' => '경로는 숫자, 알파벳, 공백, ._-/로 구성되어야 합니다.',
        'error_deleting_file' => ':name 파일 삭제 오류',
        'error_deleting_dir_not_empty' => ':name 디렉토리 삭제 오류. 디렉토리가 비어있지 않습니다.',
        'error_deleting_dir' => ':name 디렉토리 삭제 오류.',
        'invalid_name' => '이름은 숫자, 알파벳, 공백, ._-로 구성되어야 합니다.',
        'original_not_found' => '본래의 파일/디렉토리를 발견할 수 없습니다',
        'already_exists' => '이 이름의 파일/디렉토리가 이미 존재합니다.',
        'error_renaming' => '파일/디렉토리 이름변경 오류',
        'name_cant_be_empty' => '이름은 공백으로만 할 수 없습니다',
        'too_large' => '업로드 파일이 너무 큽니다. 파일 사이즈는 최대 :max_size 입니다.',
        'type_not_allowed' => '허가된 파일타입은  :allowed_types 입니다.',
        'file_not_valid' => '파일이 올바르지 않습니다.',
        'error_uploading_file' => '파일 업로드 오류: ":name"',
        'move_please_select' => '선택해 주세요',
        'move_destination' => '목표 디렉토리',
        'move_popup_title' => '자산 이동',
        'move_button' => '이동',
        'selected_files_not_found' => '선택한 파일이 존재하지 않습니다.',
        'select_destination_dir' => '이동 목적지 디렉토리를 선택해주세요.',
        'destination_not_found' => '이동 목적지 디렉토리가 존재하지 않습니다.',
        'error_moving_file' => ':file 파일 이동 오류',
        'error_moving_directory' => ':dir 디렉토리 이동 오류',
        'error_deleting_directory' => ':dir 디렉토리 삭제 오류',
        'no_list_records' => '파일을 발견할 수 없습니다',
        'delete_confirm' => '선택한 파일이나 폴더를 삭제하시겠습니까?',
        'path' => '경로',
    ],
    'component' => [
        'menu_label' => "컴포넌트",
        'unnamed' => "이름없음",
        'no_description' => "설명없음",
        'alias' => "별칭",
        'alias_description' => "페이지나 레이아웃 코드에서 사용하는 고유 컴포넌트 이름.",
        'validation_message' => "알파벳, 숫자, 언더스코어(_)로 구성한 컴포넌트 별칭이 필요합니다. 별칭은 알파벳으로 시작해야 합니다.",
        'invalid_request' => "컴포넌트 데이터가 올바르지 않아서 템플릿을 저장할 수 없습니다.",
        'no_records' => '컴포넌트가 없습니다.',
        'not_found' => "':name' 컴포넌트를 발견할 수 없습니다.",
        'method_not_found' => "':name' 컴포넌트는 ':method' 메소드를 가지고있지 않습니다.",
    ],
    'template' => [
        'invalid_type' => "알수없는 템플릿 타입",
        'not_found' => "요청한 템플릿이 없습니다.",
        'saved'=> "템플릿을 저장합니다.",
        'no_list_records' => '템플릿을 찾을 수 없습니다',
        'delete_confirm' => '선택한 템플릿을 삭제하시겠습니까?',
        'order_by' => '정렬방법'
    ],
    'permissions' => [
        'name' => 'CMS',
        'manage_content' => '콘텐츠 관리',
        'manage_assets' => '자산 관리',
        'manage_pages' => '페이지 관리',
        'manage_layouts' => '레이아웃 관리',
        'manage_partials' => '파셜 관리',
        'manage_themes' => '테마 관리',
    ],
    'theme_log' => [
        'hint' => '백엔드에서 관리자에 의해 변경된 테마의 변경사항에 대한 로그를 표시합니다.',
        'menu_label' => '테마 로그',
        'menu_description' => '활성 테마 변경 표시',
        'empty_link' => '테마 로그 비우기',
        'empty_loading' => '테마 로그 비우는 중...',
        'empty_success' => '테마 로그를 비웠습니다',
        'return_link' => '테마 로그로 돌아가기',
        'id' => 'ID',
        'id_label' => '로그 ID',
        'created_at' => '날짜 & 시간',
        'user' => '유저',
        'type' => '타입',
        'type_create' => '생성',
        'type_update' => '변경',
        'type_delete' => '삭제',
        'theme_name' => '테마명',
        'theme_code' => '테마코드',
        'old_template' => '템플릿(이전)',
        'new_template' => '템플릿(신규)',
        'template' => '템플릿',
        'diff' => '변경점',
        'old_value' => '이전 값',
        'new_value' => '신규 값',
        'preview_title' => '템플릿 변경',
        'template_updated' => '템플릿이 변경되었습니다',
        'template_created' => '템플릿이 생성되었습니다',
        'template_deleted' => '템플릿이 삭제되었습니다',
    ],
];
