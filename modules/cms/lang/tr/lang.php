<?php

return [
    'cms_object' => [
        'invalid_file' => 'Hatalı dosya adı: :name. Dosya isimleri sadece alfanümerik semboller, alt çizgiler, tire ve nokta içerebilir. Bazı doğru dosya adı örnekleri: sayfa.htm, sayfa, altdizin/sayfa',
        'invalid_property' => '":name" özelliği ayarlanamadı',
        'file_already_exists' => '":name" isimli dosya mevcut.',
        'error_saving' => '":name" kaydedilirken hatayla oluştu.',
        'error_creating_directory' => ':name klasörü oluşturulurken hata oluştu',
        'invalid_file_extension'=>'Hatalı dosya uzantısı: :invalid. İzin verilen uzantılar: :allowed.',
        'error_deleting' => '":name" şablon dosyası silinirken hatayla karşılaşıldı.',
        'delete_success' => ':count şablon başarıyla silindi.',
        'file_name_required' => 'Dosya adı alanı gereklidir.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "Aktif tema belirtilmedi.",
        ],
        'edit' => [
            'not_set' => "Düzenlenecek tema belirtilmedi.",
            'not_found' => "Düzenlenecek tema bulunamadı.",
            'not_match' => "Ulaşmaya çalıştığınız nesne düzenlenecek temaya ait değil. Lütfen sayfayı yenileyin."
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
        'invalid_url' => 'Hatalı URL formatı. URL eğik çizgi ile başlamalı ve sayı, Latin harfleri ve aşağıdaki sembolleri içerebilir: ._-[]:?|/+*^$',
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
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Ekle',
        'search' => 'Ara...'
    ],
    'editor' => [
        'settings' => 'Ayarlar',
        'title' => 'Başlık',
        'new_title' => 'Yeni sayfa başlığı',
        'url' => 'URL',
        'filename' => 'Dosya Adı',
        'layout' => 'Düzen',
        'description' => 'Tanım',
        'preview' => 'Önizleme',
        'meta' => 'Meta',
        'meta_title' => 'Meta Başlık',
        'meta_description' => 'Meta Tanım',
        'markup' => 'Biçimlendirme',
        'code' => 'Kod',
        'content' => 'İçerik',
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
        'invalid_path' => 'Yol sadece sayı, Latin harfleri, boşluk ve şu sembolleri içerebilir: ._-/',
        'error_deleting_file' => ':name dosyası silinirken hatayla karşılaşıldı.',
        'error_deleting_dir_not_empty' => ':name klasörü silinemedi. Klasör boş değil.',
        'error_deleting_dir' => ':name dosyası silinirken hatayla karşılaşıldı.',
        'invalid_name' => 'İsim sadece sayı, Latin harfleri, boşluk ve şu sembolleri içerebilir: ._-',
        'original_not_found' => 'Orjinal dosya veya dizin bulunamadı',
        'already_exists' => 'Bu isimde dosya veya dizin zaten var',
        'error_renaming' => 'Dosya veya dizin ismi düzenlenemedi',
        'name_cant_be_empty' => 'İsim alanı boş bırakılamaz.',
        'too_large' => 'Yüklenen dosya çok büyük. İzin verilen maksimum boyut :max_size',
        'type_not_allowed' => 'İzin verilen dosya tipleri: :allowed_types',
        'file_not_valid' => 'Dosya geçerli değil',
        'error_uploading_file' => '":name" yüklenirken hatayla karşılaşıldı: :error',
        'move_please_select' => 'lütfen seçiniz',
        'move_destination' => 'Hedef klasör',
        'move_popup_title' => 'Assets\'i taşı',
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
        'alias_description' => "Bu bileşen için benzersiz bir isim. Sayfa veya şablonda kullanırken bu isim gerekecektir.",
        'validation_message' => "Bileşen isimleri gerkelidir ve sadece Latin semboller, sayılar, ve alt çizgi içerebilir. Bileşen ismi ayrıca Latin harfle başlamalı.",
        'invalid_request' => "Şablonda hatalı bileşen verisi olduğu için kaydedilemedi.",
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
