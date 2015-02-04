<?php

return [
    'app' => [
        'name' => 'October CMS',
        'tagline' => 'Basitliğe dönüş...'
    ],
    'locale' => [
        'en' => 'English (United States)',
        'de' => 'Deutsch (Deutschland)',
        'es' => 'Español (Spanish)',
        'es-ar' => 'Español (Argentina)',
        'fa' => '‏فارسی‏ (Iran) ايران',
        'fr' => 'Français (France)',
        'hu' => 'Magyar (Magyarország - Hungary)',
        'it' => 'Italiano (Italia)',
        'ja' => '日本語 (Japan) 日本',
        'nl' => 'Nederlands (Nederland)',
        'pt-br' => 'Português (Brasil)',
        'ro' => 'Română (România)',
        'ru' => 'Русский (Россия - Russia)',
        'se' => 'Svenska (Sverige)',
        'tr' => 'Türkçe (Türkiye)'
    ],
    'directory' => [
        'create_fail' => "Klasör oluşturulamıyor: :name"
    ],
    'file' => [
        'create_fail' => "Dosya oluşturulamıyor: :name"
    ],
    'combiner' => [
        'not_found' => "Kombine dosyası: ':name' bulunamadı."
    ],
    'system' => [
        'name' => 'Sistem',
        'menu_label' => 'Sistem',
        'categories' => [
            'cms' => 'CMS',
            'misc' => 'Çeşitli',
            'logs' => 'Kayıtlar',
            'mail' => 'E-Mail',
            'shop' => 'Mağaza',
            'team' => 'Takım',
            'users' => 'Kullanıcılar',
            'system' => 'Sistem',
            'social' => 'Sosyal',
            'events' => 'Olaylar',
            'customers' => 'Müşteriler',
            'my_settings' => 'Ayarlarım'
        ]
    ],
    'plugin' => [
        'unnamed' => 'İsimsiz eklenti',
        'name' => [
            'label' => 'Eklenti Adı',
            'help' => 'Eklenti adı eşsiz olmalıdır. Örneğin, RainLab.Blog'
        ]
    ],
    'plugins' => [
        'manage' => 'Eklentileri yönet',
        'enable_or_disable' => 'Aktifleştir veya Pasifleştir',
        'enable_or_disable_title' => 'Eklentileri Aktifleştir veya Pasifleştir',
        'remove' => 'Kaldır',
        'refresh' => 'Yenile',
        'disabled_label' => 'Pasif',
        'disabled_help' => 'Pasifleştirilmiş eklentiler, uygulama tarafından göz ardı edilir.',
        'selected_amount' => 'Seçilen eklentiler: :amount',
        'remove_confirm' => 'Emin misiniz?',
        'remove_success' => 'Eklentiler sistemden başarıyla kaldırıldı.',
        'refresh_confirm' => 'Emin misiniz?',
        'refresh_success' => 'Eklentiler başarıyla yenilendi.',
        'disable_confirm' => 'Are you sure?',
        'disable_success' => 'Eklentiler başarıyla pasifleştirildi.',
        'enable_success' => 'Eklentiler başarıyla aktifleştirildi.',
        'unknown_plugin' => 'Eklenti sistemden başarıyla kaldırıldı.'
    ],
    'project' => [
        'name' => 'Proje',
        'owner_label' => 'Proje Sahibi',
        'attach' => 'Projeyi Eşle',
        'detach' => 'Projeyi Ayır',
        'none' => 'Hiçbiri',
        'id' => [
            'label' => 'Proje ID',
            'help' => 'Proje ID\'sini nasıl bulurum?',
            'missing' => 'Lütfen kullanılacak Proje ID\'sini belirleyin.',
        ],
        'detach_confirm' => 'Bu projeyi ayırmak istediğinizden emin misiniz?',
        'unbind_success' => 'Proje ayırma işlemi tamamlandı.'
    ],
    'settings' => [
        'menu_label' => 'Ayarlar',
        'not_found' => 'Belirtilen ayarlar bulunamadı.',
        'missing_model' => 'Ayarlar sayfasında Model tanımı eksik.',
        'update_success' => ':name için ayarlar güncellendi.',
        'return' => 'Sistem ayarları sayfasına dön',
        'search' => 'Ara'
    ],
    'mail' => [
        'log_file' => 'Günlük kayıt dosyası',
        'menu_label' => 'Mail ayarları',
        'menu_description' => 'Email ayarlarını düzenle.',
        'general' => 'Genel',
        'method' => 'Mail Metodu',
        'sender_name' => 'Gönderici Adı',
        'sender_email' => 'Gönderici Email',
        'php_mail' => 'PHP mail',
        'sendmail' => 'Sendmail',
        'smtp' => 'SMTP',
        'smtp_address' => 'SMTP Adresi',
        'smtp_authorization' => 'SMTP yetkilendirmesi kullan',
        'smtp_authorization_comment' => 'SMTP sunucusu yetkilendirme gerektiriyorsa bu onay kutusunu işaretleyin.',
        'smtp_username' => 'Kullanıcı Adı',
        'smtp_password' => 'Şifre',
        'smtp_port' => 'SMTP Port',
        'smtp_ssl' => 'SSL bağlantısı kullan',
        'sendmail' => 'Sendmail',
        'sendmail_path' => 'Sendmail Yolu',
        'sendmail_path_comment' => 'Sendmail programının yolunu belirtin.',
        'mailgun' => 'Mailgun',
        'mailgun_domain' => 'Mailgun Domain',
        'mailgun_domain_comment' => 'Mailgun domain belirtin.',
        'mailgun_secret' => 'Mailgun Gizli Anahtarı',
        'mailgun_secret_comment' => 'Mailgun API anahtarını girin.'
    ],
    'mail_templates' => [
        'menu_label' => 'Mail şablonları',
        'menu_description' => 'Kullanıcılar ve yöneticiler için gönderilen e-posta şablonları düzenleyin.',
        'new_template' => 'Yeni Şablon',
        'new_layout' => 'Yeni Layout',
        'template' => 'Şablon',
        'templates' => 'Şablonlar',
        'menu_layouts_label' => 'Mail Layoutları',
        'layout' => 'Layout',
        'layouts' => 'Layoutlar',
        'name' => 'İsim',
        'name_comment' => 'Bu şablona referans için benzersiz bir isim verin',
        'code' => 'Kod',
        'code_comment' => 'Bu şablona referans için benzersiz bir kod verin',
        'subject' => 'Konu',
        'subject_comment' => 'Email mesaj konusu',
        'description' => 'Tanım',
        'content_html' => 'HTML',
        'content_css' => 'CSS',
        'content_text' => 'Düzyazı',
        'test_send' => 'Test mesajı gönder',
        'test_success' => 'Test mesajı başarılı şekilde gönderildi.',
        'return' => 'Şablon listesine geri dön'
    ],
    'install' => [
        'project_label' => 'Projeye bağla',
        'plugin_label' => 'Eklenti Yükle',
        'missing_plugin_name' => 'Yüklemek istediğiniz eklentinin adını giriniz.',
        'install_completing' => 'Kurulumu tamamla',
        'install_success' => 'Eklenti kurulumu tamamlandı.'
    ],
    'updates' => [
        'title' => 'Güncellemeleri Yönet',
        'name' => 'Sistemi Güncelle',
        'menu_label' => 'Güncellemeler',
        'menu_description' => 'Sistemi güncelleyin, temaları ve eklentileri yönetin.',
        'check_label' => 'Güncellemeleri kontrol et',
        'retry_label' => 'Tekrar dene',
        'plugin_name' => 'Adı',
        'plugin_description' => 'Açıklama',
        'plugin_version' => 'Versiyon',
        'plugin_author' => 'Yazar',
        'core_build' => 'Mevcut versiyon',
        'core_build_old' => 'Mevcut versiyon :build',
        'core_build_new' => 'Versiyon :build',
        'core_build_new_help' => 'Son versiyon kullanılabilir.',
        'core_downloading' => 'Uygulama dosyaları indiriliyor',
        'core_extracting' => 'Uygulama dosyaları çıkarılıyor',
        'plugins' => 'Modüller',
        'plugin_downloading' => 'Modül indiriliyor: :name',
        'plugin_extracting' => 'Modül dosyaları çıkarılıyor: :name',
        'plugin_version_none' => 'Yeni eklenti',
        'plugin_version_old' => 'Mevcut v:version',
        'plugin_version_new' => 'v:version',
        'theme_label' => 'Tema',
        'theme_new_install' => 'Yeni tema kur.',
        'theme_downloading' => 'Tema indiriliyor: :name',
        'theme_extracting' => 'Tema paketten çıkarılıyor: :name',
        'update_label' => 'Sistemi güncelle',
        'update_completing' => 'Güncelleme işlemi tamamlanıyor',
        'update_loading' => 'Kullanılabilir güncellemeler kontrol ediliyor...',
        'update_success' => 'Güncelleme işlemi başarıyla tamamlandı.',
        'update_failed_label' => 'Güncelleme hatası',
        'force_label' => 'Güncellemeye zorla',
        'found' => [
            'label' => 'Güncellemeler bulundu!',
            'help' => 'Sistemi güncelleye tıklayarak güncelleme işlemini başlatabilirsiniz.'
        ],
        'none' => [
            'label' => 'Güncelleme yok',
            'help' => 'Yeni güncelleme bulunamadı.'
        ]
    ],
    'server' => [
        'connect_error' => 'Sunucuyla bağlantı kurulamadı.',
        'response_not_found' => 'Güncelleme sunucusu bulunamadı.',
        'response_invalid' => 'Sunucudan hatalı cevap geldi.',
        'response_empty' => 'Sunucudan boş cevap geldi.',
        'file_error' => 'Paket teslim edilirken sunucuda hata meydana geldi.',
        'file_corrupt' => 'Sunucudaki dosya bozulmuş.'
    ],
    'behavior' => [
        'missing_property' => ':class sınıfı :behavior davranışı tarafından kullanılan $:property özelliğini tanımlamalı.'
    ],
    'config' => [
        'not_found' => ':location için tanımlanan :file adlı ayar dosyası bulunamadı.',
        'required' => ':location konumunda kullanılan :property ayarı bir değer içermelidir.'
    ],
    'zip' => [
        'extract_failed' => "':file' adlı çekirdek dosyası dosya paketinden çıkarılamadı."
    ],
    'event_log' => [
        'hint' => 'Bu kayıtlar, uygulamada ortaya çıkan potansiyel hataları, istisnaları ve hata ayıklama bilgilerini görüntüler.',
        'menu_label' => 'Olay kaydı',
        'menu_description' => 'Olay kayıtlarının zamanlarını ve detaylarını görüntüler.',
        'empty_link' => 'Olay kaydını temizle',
        'empty_loading' => 'Olay kaydı temizleniyor...',
        'empty_success' => 'Olay kaydı temizlendi.',
        'return_link' => 'Olay kayıtlarına dön',
        'id' => 'ID',
        'id_label' => 'Olay Numarası',
        'created_at' => 'Tarih & Saat',
        'message' => 'Mesaj',
        'level' => 'Seviye'
    ],
    'request_log' => [
        'hint' => 'Bu günlük dikkat edilmesi gereken tarayıcı isteklerinin bir listesini görüntüler. Örneğin, bir ziyaretçi bulunmayan bir CMS sayfasını açarsa 404 kodu ile bir kayıt oluşturulur.',
        'menu_label' => 'İstek günlüğü',
        'menu_description' => '(404) sayfası gibi kötü ya da yeniden yönlendirilmiş istekleri görüntüler.',
        'empty_link' => 'İstek günlüğünü temizle',
        'empty_loading' => 'İstek günlüğü temizleniyor...',
        'empty_success' => 'İstek günlüğü temizlendi.',
        'return_link' => 'İstek günlüğüne dön',
        'id' => 'ID',
        'id_label' => 'İstek Numarası',
        'count' => 'Sayaç',
        'referer' => 'Referer',
        'url' => 'URL',
        'status_code' => 'Durum'
    ],
    'permissions' => [
        'name' => 'Sistem',
        'manage_system_settings' => 'Sistem ayarlarını düzenleyebilsin',
        'manage_software_updates' => 'Sistem güncellemelerini yönetebilsin',
        'manage_mail_templates' => 'E-posta şablonları yönetebilsin',
        'manage_mail_settings' => 'E-posta ayarlarını yönetebilsin',
        'manage_other_administrators' => 'Diğer yöneticileri düzenleyebilsin',
        'view_the_dashboard' => 'Panoyu görüntüleyebilsin'
    ]
];