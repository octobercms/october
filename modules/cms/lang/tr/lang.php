<?php

return [
    'cms_object' => [
        'invalid_file' => 'Hatalı dosya adı: :name. File names can contain only alphanumeric symbols, underscores, dashes and dots. Bazı doğru dosya adı örnekleri: page.htm, page, subdirectory/page',
        'invalid_property' => 'The property ":name" cannot be set',
        'file_already_exists' => '":name" isimli dosya mevcut.',
        'error_saving' => '":name" kaydedilirken hatayla karşılaşıldı.',
        'error_creating_directory' => ':name klasörü oluşturulurken hatayla karşılaşıldı',
        'invalid_file_extension'=>'Hatalı dosya uzantısı: :invalid. İzin verilen uzantılar: :allowed.',
        'error_deleting' => '":name" şablon dosyası silinirken hatayla karşılaşıldı.',
        'delete_success' => ':count şablon başarıyla silindi.',
        'file_name_required' => 'Dosya adı alanı gereklidir.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "The active theme is not set.",
        ],
        'edit' => [
            'not_set' => "The edit theme is not set.",
            'not_found' => "The edit theme is not found.",
            'not_match' => "The object you're trying to access doesn't belong to the theme being edited. Please reload the page."
        ]
    ],
    'page' => [
        'not_found' => [
            'label' => "Sayfa bulunamadı",
            'help' => "İstenilen sayfa bulunamadı.",
        ],
        'custom_error' => [
            'label' => "Sayfa hatası",
            'help' => "Üzgünüz, bir şeyler ters gitti ve sayfa görüntülenemiyor.",
        ],
        'menu_label' => 'Sayfalar',
        'no_list_records' => 'Hiç sayfa yok.',
        'new' => 'Sayfa oluştur',
        'invalid_url' => 'Hata URL formatı. The URL should start with the forward slash symbol and can contain digits, Latin letters and the following symbols: ._-[]:?|/+*',
        'delete_confirm_multiple' => 'Seçili sayfaları silmek istediğinize emin misiniz?',
        'delete_confirm_single' => 'Bu sayfayı silmek istediğinize emin misiniz?',
        'no_layout' => '-- şablon yok --'
    ],
    'layout' => [
        'not_found' => "':name' isimli şablon bulunamadı",
        'menu_label' => 'Şablonlar',
        'no_list_records' => 'Şablon bulunamadı',
        'new' => 'Şablon oluştur',
        'delete_confirm_multiple' => 'Seçili şablonları silmek istediğinize emin misiniz?',
        'delete_confirm_single' => 'Seçili şablonu silmek istediğinize emin misiniz?'
    ],
    'partial' => [
        'invalid_name' => "Hatalı bölüm adı: :name.",
        'not_found' => "':name' bölümü bulunamadı.",
        'menu_label' => 'Bölümler',
        'no_list_records' => 'Bölüm bulunamadı.',
        'delete_confirm_multiple' => 'Seçili bölümleri silmek istediğinize gerçekten emin misiniz?',
        'delete_confirm_single' => 'Bu bölümü silmek istediğinize emin misiniz?',
        'new' => 'Bölüm Oluştur'
    ],
    'content' => [
        'not_found' => "':name' isminde içerik dosyası bulunamadı.",
        'menu_label' => 'İçerik',
        'no_list_records' => 'İçerik dosyası bulunamadı.',
        'delete_confirm_multiple' => 'Seçili içerik dosyaları veya klasörlerini silmek istediğinize gerçekten emin misiniz?',
        'delete_confirm_single' => 'Bu içerik dosyasını silmek istediğinize emin misiniz?',
        'new' => 'Yeni İçerik'
    ],
    'ajax_handler' => [
        'invalid_name' => "Hatalı AJAX işleyici adı: :name.",
        'not_found' => "':name' isimli AJAX işleyici bulunamadı.",
    ],
    'combiner' => [
        'not_found' => "The combiner file ':name' is not found.",
    ],
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Add',
        'search' => 'Search...'
    ],
    'editor' => [
        'settings' => 'Settings',
        'title' => 'Title',
        'new_title' => 'New page title',
        'url' => 'URL',
        'filename' => 'File Name',
        'layout' => 'Layout',
        'description' => 'Description',
        'preview' => 'Preview',
        'meta' => 'Meta',
        'meta_title' => 'Meta Title',
        'meta_description' => 'Meta Description',
        'markup' => 'Markup',
        'code' => 'Code',
        'content' => 'Content',
    ],
    'asset' => [
        'menu_label' => "Dosyalar",
        'drop_down_add_title' => 'Ekle...',
        'drop_down_operation_title' => 'İşlemler...',
        'upload_files' => 'Dosya(lar) yükle',
        'create_file' => 'Dosya oluştur',
        'create_directory' => 'Klasör oluştur',
        'rename' => 'Yeniden isimlendir',
        'delete' => 'Sil',
        'move' => 'Taşı',
        'new' => 'Yeni dosya',
        'rename_popup_title' => 'Yeniden isimlendir',
        'rename_new_name' => 'Yeni isim',
        'invalid_path' => 'Path can contain only digits, Latin letters, spaces and the following symbols: ._-/',
        'error_deleting_file' => ':name dosyası silinirken hatayla karşılaşıldı.',
        'error_deleting_dir_not_empty' => 'Error deleting directory :name. The directory is not empty.',
        'error_deleting_dir' => ':name dosyası silinirken hatayla karşılaşıldı.',
        'invalid_name' => 'Name can contain only digits, Latin letters, spaces and the following symbols: ._-',
        'original_not_found' => 'Original file or directory not found',
        'already_exists' => 'File or directory with this name already exists',
        'error_renaming' => 'Error renaming the file or directory',
        'name_cant_be_empty' => 'İsim alanı boş bırakılamaz.',
        'too_large' => 'Yüklenen dosya çok büyük. İzin verilen maksimum boyut :max_size',
        'type_not_allowed' => 'İzin verilen dosya tipleri: :allowed_types',
        'file_not_valid' => 'Dosya geçerli değil',
        'error_uploading_file' => '":name" yüklenirken hatayla karşılaşıldı: :error',
        'move_please_select' => 'lütfen seçiniz',
        'move_destination' => 'Hedef klasör',
        'move_popup_title' => 'Assets taşı',
        'move_button' => 'Taşı',
        'selected_files_not_found' => 'Seçilen dosyalar bulunamadı.',
        'select_destination_dir' => 'Lütfen hedef klasör seçiniz',
        'destination_not_found' => 'Hedef klasör bulunamadı',
        'error_moving_file' => ':file dosyası taşınırken hatayla karşılaşıldı',
        'error_moving_directory' => ':dir klasörü taşınırken hatayla karşılaşıldı',
        'error_deleting_directory' => ':dir klasörü silinirken hatayla karşılaşıldı',
        'path' => 'Yol'
    ],
    'component' => [
        'menu_label' => "Bileşenler",
        'unnamed' => "İsimsiz",
        'no_description' => "Açıklama girilmedi.",
        'alias' => "Takma ad",
        'alias_description' => "A unique name given to this component when using it in the page or layout code.",
        'validation_message' => "Component aliases are required and can contain only Latin symbols, digits, and underscores. The aliases should start with a Latin symbol.",
        'invalid_request' => "Şablon hatalı bileşen verisi olduğu için kaydedilemedi.",
        'no_records' => 'Bileşen bulunamadı.',
        'not_found' => "':name' isimli bileşen bulunamadı.",
        'method_not_found' => "':name' isimli bileşen ':method'unu içermiyor.",
    ],
    'template' => [
        'invalid_type' => "Hatalı şablon tipi.",
        'not_found' => "İstenilen şablon bulunamadı.",
        'saved'=> "Şablon başarıyla kaydedildi."
    ]
];