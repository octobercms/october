<?php

return [
    'cms_object' => [
        'invalid_file' => 'نام :name برای فایل نام معتبر است. نام فایل میتواند شامل کاراکتر ، خط تیره و نقطه باشد. لعنوان مثال page.htm، page و subdirectory/page',
        'invalid_property' => 'عدم توانایی در تغییر خاصیت ":name"',
        'file_already_exists' => 'فایلی با نام ":name" موجود است.',
        'error_saving' => 'خطا در ذخیره فایل ":name". لطفا حق دسترسی ها را بررسی نمایید.',
        'error_creating_directory' => 'خطا در ایجاد پوشه ی :name. لطفا حق دسترسی ها را بررسی نمایید.',
        'invalid_file_extension'=>'پسوند :invalid برای فایل نا معتبر است. پسوند های معتبر عبارتند از: :allowed.',
        'error_deleting' => 'خطا در خذف فایل ":name". لطفا حق دسترسی ها را بررسی نمایید.',
        'delete_success' => 'تعداد :count فایل با موفقیت حذف شد.',
        'file_name_required' => 'نام فایل را وارد نمایید.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "قالب فعال مشخص نشده است.",
            'not_found' => "قالب فعال یافت نشد.",
        ],
        'edit' => [
            'not_set' => "قالب ویرایش مشخص نشده ایت.",
            'not_found' => "قالب ویرایش یافت نشد.",
            'not_match' => "شی مورد مظر شما در قالبی که ویرایش می کنید یافت نشد. لطفا صفحه را مجددا بارگذاری نمایید."
        ],
        'settings_menu' => 'قالب نمایشی',
        'settings_menu_description' => 'پیش نمایش قالب های موجود و انتخاب قالب فعال.',
        'find_more_themes' => 'دریافت قالب های بیشتر.',
        'activate_button' => 'فعال کردن',
        'active_button' => 'فعال',
    ],
    'page' => [
        'not_found' => [
            'label' => "صفحه مورد نظر یافت نشد",
            'help' => "صفحه مورد نظر یافت نشد.",
        ],
        'custom_error' => [
            'label' => "خطای صفحه",
            'help' => "متاسفانه مشکلی در نمایش صفحه مورد نظر به وجود آمده است.",
        ],
        'menu_label' => 'صفخات',
        'no_list_records' => 'صفحه ای یافت نشد',
        'new' => 'New page',
        'invalid_url' => 'قالب آدرس صحیح نمی باشد. آدرس باید با اسلش شروع شده و می تواند شامل اعداد، خروف لاتین و این کاراکتر ها باشد: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'آیا از حذف صفحات انتخاب شده اطمینان دارید؟',
        'delete_confirm_single' => 'آیا از حذف این صفحه اطمینان دارید؟',
        'no_layout' => '-- بدون طرح بندی --'
    ],
    'layout' => [
        'not_found_name' => "طرح بندی ی ':name' یافت نشد",
        'menu_label' => 'طرح بندی ها',
        'no_list_records' => 'طرحبندی یافت نشد',
        'new' => 'طرح بندی جدید',
        'delete_confirm_multiple' => 'آیا از حذف طرح بندی های انتخاب شده اطمینان دارید؟',
        'delete_confirm_single' => 'آیا از حذف این طرحبندی اطمینان دارید؟'
    ],
    'partial' => [
        'not_found_name' => "بخشی با نام ':name' یافت نشد.",
        'invalid_name' => "نام بخش نا معتبر است: :name.",
        'menu_label' => 'بخش ها',
        'no_list_records' => 'بخشی وجود ندارد',
        'delete_confirm_multiple' => 'آیا از حذف بخش های انتخاب شده اطمینان دارید؟',
        'delete_confirm_single' => 'آیا از حذف این بخش بندی اطمینان دارید؟',
        'new' => 'بخش بندی جدید'
    ],
    'content' => [
        'not_found_name' => "فایل محتوای ':name' یافت نشد.",
        'menu_label' => 'محتوا',
        'no_list_records' => 'هیچ فایل محتوایی وجود ندارد',
        'delete_confirm_multiple' => 'آیا از خذف فایل ها و یا پوشه های انتخاب شده اطمینان دارید؟',
        'delete_confirm_single' => 'آیا از حذف این فایل اطمینان دارید؟',
        'new' => 'فایل محتوی جدید'
    ],
    'ajax_handler' => [
        'invalid_name' => "نام کنترل کننده آژاکس نا معتبر است: :name.",
        'not_found' => "کنترل کننده آژاکس ':name' یافت نشد.",
    ],
    'cms' => [
        'menu_label' => "مدیریت محتوی"
    ],
    'sidebar' => [
        'add' => 'افزودن',
        'search' => 'جستجو...'
    ],
    'editor' => [
        'settings' => 'تنظیمات',
        'title' => 'عنوان',
        'new_title' => 'عنوان صفحه جدید',
        'url' => 'آدرس',
        'filename' => 'تام فایل',
        'layout' => 'طرح بندی',
        'description' => 'توضیحات',
        'preview' => 'پیش نمایش',
        'meta' => 'متا',
        'meta_title' => 'عنوان متا',
        'meta_description' => 'توضیحات متا',
        'markup' => 'نشانه گذاری',
        'code' => 'کد',
        'content' => 'محتوی',
        'hidden' => 'مخفی',
        'hidden_comment' => 'صفحات مخفی فقط برای کاربران وارد شده به سیستم نمایش داده می شود.',
        'enter_fullscreen' => 'حالت تمام صفحه',
        'exit_fullscreen' => 'خروج از حالت تمام صفحه'
    ],
    'asset' => [
        'menu_label' => "فایلها",
        'drop_down_add_title' => 'افزودن...',
        'drop_down_operation_title' => 'عملیات...',
        'upload_files' => 'افزودن فایل(ها)',
        'create_file' => 'ایجاد فایل',
        'create_directory' => 'ایجاد پوشه',
        'directory_popup_title' => 'پوشه ی جدید',
        'directory_name' => 'نام پوشه',
        'rename' => 'تغییر نام',
        'delete' => 'حذف',
        'move' => 'جابحایی',
        'select' => 'انتخاب',
        'new' => 'فایل جدید',
        'rename_popup_title' => 'تغییر نام',
        'rename_new_name' => 'نام جدید',
        'invalid_path' => 'مسیر می تواند فقط شلمل اعداد، حروف لاتین، حط فاصلع و این کاراکتر ها باشد: ._-/',
        'error_deleting_file' => 'در حذف فایل :name مشکلی به وجود آمده است.',
        'error_deleting_dir_not_empty' => 'در حذف پوشه ی :name مشکلی به وجود آمده است. پوشه خالی نیست.',
        'error_deleting_dir' => 'خطایی در حذف :name به وجود آمده است.',
        'invalid_name' => 'نام میتوامد شامل اعداد، خروف لاتین، خط فاصله و این کاراکتر ها باشد: ._-',
        'original_not_found' => 'فایل یا پوشه ی اصلی یافت نشد.',
        'already_exists' => 'فایل یا پوشه ای با این نام وجود دارد.',
        'error_renaming' => 'در تغییر نام فایل یا پوشه مورد نظر خطایی رخ داده است',
        'name_cant_be_empty' => 'نام منی تواند خالی باشد',
        'too_large' => 'فایل ارسال شده بیش از حد حجیم اشت. بیشترین حجم مورد قبول :max_size می باشد',
        'type_not_allowed' => 'فقط این نوع فایل ها قابل قبول می باشد: :allowed_types',
        'file_not_valid' => 'فال نا معتبر است',
        'error_uploading_file' => 'خطا در ارسال فال ":name": :error',
        'move_please_select' => 'اطفا انتخاب نمایید',
        'move_destination' => 'پوشه مورد نظر',
        'move_popup_title' => 'جابجایی فایل',
        'move_button' => 'جابجایی',
        'selected_files_not_found' => 'فایل انتخاب شده یافت نشد',
        'select_destination_dir' => 'لطفا پوشه ی مورد نظر را انتخاب نمایید',
        'destination_not_found' => 'پوشه مورد نظر یافت نشد',
        'error_moving_file' => 'خطایی در جابجایی :file رخ داده است',
        'error_moving_directory' => 'خطایی در جابجایی :dir رخ داده است',
        'error_deleting_directory' => 'خطایی در حذف :dir رخ داده است',
        'path' => 'Path'
    ],
    'component' => [
        'menu_label' => "ابرار ها",
        'unnamed' => "بدون نام",
        'no_description' => "توصیحات وجود ندارد",
        'alias' => "نام مستعار",
        'alias_description' => "نام یکتایی که به این ابزار داده می شود تا درون صفحات و طرح بندی ها به این ابزار اشاره کند.",
        'validation_message' => "نام مستعار برای ابزار مورد نیاز بوده و می تواند شامل حروف لاتین، اعداد، و خط زیر باشد و باید با حرف لاتین شروع شود.",
        'invalid_request' => "بدلیل داده ی نا معتبر ابزار امکان ذخیره قالب وجود ندارد.",
        'no_records' => 'ابزاری یافت نشد',
        'not_found' => "ابزار ':name' یافت نشد.",
        'method_not_found' => "ابزار ':name' شامل متدی با نام ':method' نمی باشد.",
    ],
    'template' => [
        'invalid_type' => "نوع قالب معتبر نمی باشد.",
        'not_found' => "قالب درخواست شده یافت نشد.",
        'saved'=> "قالب با موفقیت ذخیره شد."
    ],
    'permissions' => [
        'manage_content' => 'مدیریت محتوی',
        'manage_assets' => 'مدیریت فایلها',
        'manage_pages' => 'مدیریت صفحات',
        'manage_layouts' => 'مدیریت طرح بندی ها',
        'manage_partials' => 'مدیریت بخش ها',
        'manage_themes' => 'مدیریت قالب ها'
    ]
];
