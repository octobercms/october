<?php

return [
    'app' => [
        'name' => 'October CMS',
        'motto' => 'Getting back to basics',
    ],
    'directory' => [
        'create_fail' => "Klasör oluşturulamıyor: :name",
    ],
    'file' => [
        'create_fail' => "Dosya oluşturulamıyor: :name",
    ],
    'system' => [
        'name' => 'Sistem',
        'menu_label' => 'Sistem',
    ],
    'plugin' => [
        'unnamed' => 'İsimsiz eklenti',
        'name' => [
            'label' => 'Eklenti Adı',
            'help' => 'Eklenti adı eşsiz olmalıdır. Örneğin, RainLab.Blog',
        ],
    ],
    'project' => [
        'name' => 'Proje',
        'owner_label' => 'Sahibi',
        'id' => [
            'label' => 'Proje ID',
            'help' => 'Proje ID\'sini nasıl bulurum?',
            'missing' => 'Lütfen kullanılacak Proje ID\'sini belirleyin.',
        ],
        'unbind_success' => 'Project has been detached successfully.',
    ],
    'settings' => [
        'menu_label' => 'Ayarlar',
        'missing_model' => 'The settings page is missing a Model definition.',
        'update_success' => 'Settings for :name have been updated successfully.',
    ],
    'install' => [
        'project_label' => 'Projeye bağla',
        'plugin_label' => 'Eklenti Yükle',
        'missing_plugin_name' => 'Yüklemek istediğiniz eklentinin adını girin.',
        'install_completing' => 'Finishing installation process',
        'install_success' => 'The plugin has been installed successfully.',
    ],
    'updates' => [
        'name' => 'Yazılım Güncelleme',
        'menu_label' => 'Güncellemeler',
        'check_label' => 'Güncellemeleri kontrol et',
        'retry_label' => 'Tekrar dene',
        'core_build' => 'Mevcut versiyon',
        'core_build_old' => 'Mevcut versiyon :build',
        'core_build_new' => 'Versiyon :build',
        'core_build_new_help' => 'Son versiyon kullanılabilir.',
        'core_downloading' => 'Uygulama dosyaları indiriliyor',
        'core_extracting' => 'Uygulama dosyaları çıkarılıyor',
        'plugin_downloading' => 'Eklenti indiriliyor: :name',
        'plugin_extracting' => 'Eklenti dosyaları çıkarılıyor: :name',
        'plugin_version_none' => 'Yeni eklenti',
        'plugin_version_old' => 'Mevcut v:version',
        'plugin_version_new' => 'v:version',
        'update_label' => 'Yazılım güncelle',
        'update_completing' => 'Güncelleme işlemi bitiyor',
        'update_loading' => 'Kullanılabilir güncellemeler yükleniyor...',
        'update_success' => 'Güncelleme işlemi başarıyla sonuçlandı.',
        'update_failed_label' => 'Güncelleme hatası',
        'force_label' => 'Güncellemeye zorla',
        'found' => [
            'label' => 'Güncellemeler bulundu!',
            'help' => 'Yazılım güncelleye tıklayarak güncelleme işlemini başlatabilirsiniz.',
        ],
        'none' => [
            'label' => 'Güncelleme yok',
            'help' => 'Yenü güncelleme bulunamadı.',
        ],
    ],
    'server' => [
        'connect_error' => 'Sunucuyla bağlantı kurulamadı.',
        'response_not_found' => 'Güncelleme sunucusu bulunamadı.',
        'response_invalid' => 'Sunucudan hatalı cevap geldi.',
        'response_empty' => 'Sunucudan boş cevap geldi.',
        'file_error' => 'Paket teslim edilirken sunucuda hata meydana geldi.',
        'file_corrupt' => 'Sunucudaki dosya bozulmuş.',
    ],
    'behavior' => [
        'missing_property' => 'Class :class must define property $:property used by :behavior behavior.',
    ],
    'config' => [
        'not_found' => 'Unable to find configuration file :file defined for :location.',
        'required' => 'Configuration used in :location must supply a value :property.',
    ],
    'zip' => [
        'extract_failed' => "Unable to extract core file ':file'.",
    ],
];