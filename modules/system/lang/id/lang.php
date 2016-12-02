<?php

return [
    'app' => [
        'name' => 'October CMS',
        'tagline' => 'Dapati kembali yang mendasar'
    ],
    'locale' => [
        'cs' => 'Czech',
        'da' => 'Danish',
        'en' => 'Inggris',
        'de' => 'Jerman',
        'es' => 'Spanyol',
        'es-ar' => 'Spanyol (Argentina)',
        'fa' => 'Persia',
        'fr' => 'Prancis',
        'hu' => 'Hungaria',
        'id' => 'Bahasa Indonesia',
        'it' => 'Italia',
        'ja' => 'Jepang',
        'nl' => 'Belanda',
        'pl' => 'Polandia',
        'pt-br' => 'Portugis (Brazil)',
        'ro' => 'Romania',
        'ru' => 'Rusia',
        'sv' => 'Swedia',
        'sk' => 'Slowakia (Slovakia)',
        'tr' => 'Turki',
        'nb-no' => 'Norwegian (Bokmål)'
    ],
    'directory' => [
        'create_fail' => 'Tidak dapat membuat direktori: :name'
    ],
    'file' => [
        'create_fail' => 'Tidak dapat membuat berkas: :name'
    ],
    'combiner' => [
        'not_found' => "Berkas penggabung ':name' tidak ditemukan."
    ],
    'system' => [
        'name' => 'Sistem',
        'menu_label' => 'Sistem',
        'categories' => [
            'cms' => 'CMS',
            'misc' => 'Lain-lain',
            'logs' => 'Pencatat',
            'mail' => 'Surat',
            'shop' => 'Toko',
            'team' => 'Tim',
            'users' => 'Pengguna',
            'system' => 'Sistem',
            'social' => 'Sosial',
            'events' => 'Peristiwa',
            'customers' => 'Pelanggan',
            'my_settings' => 'Pengaturanku'
        ]
    ],
    'plugin' => [
        'unnamed' => 'Pengaya Tak Bernama',
        'name' => [
            'label' => 'Nama Pengaya',
            'help' => 'Namai pengaya dengan kode uniknya. Contoh, RainLab.Blog'
        ]
    ],
    'plugins' => [
        'manage' => 'Kelola pengaya',
        'enable_or_disable' => 'Berdaya atau lumpuh',
        'enable_or_disable_title' => 'Berdayakan atau Lumpuhkan Pengaya',
        'remove' => 'Lepaskan',
        'refresh' => 'Segarkan',
        'disabled_label' => 'Lumpuhkan',
        'disabled_help' => 'Pengaya yang dilumpuhkan akan diabaikan aplikasi.',
        'selected_amount' => 'Pengaya terpilih: :amount',
        'remove_confirm' => 'Anda yakin akan melepaskannya?',
        'remove_success' => 'Berhasil melepaskan pengaya tersebut dari sistem.',
        'refresh_confirm' => 'Anda yakin akan menyegarkannya?',
        'refresh_success' => 'Berhasil menyegarkannya pengaya dalam sistem.',
        'disable_confirm' => 'Anda yakin akan melumpuhkannya?',
        'disable_success' => 'Berhasil melumpuhkan pengaya tersebut.',
        'enable_success' => 'Berhasil memberdayakan pengaya tersebut.',
        'unknown_plugin' => 'Pengaya telah dilepas dari sistem berkas.'
    ],
    'project' => [
        'name' => 'Proyek',
        'owner_label' => 'Pemilik',
        'attach' => 'Kaitkan Proyek',
        'detach' => 'Lepas Proyek',
        'none' => 'Tidak ada',
        'id' => [
            'label' => 'ID Proyek',
            'help' => 'Bagaimana menemukan ID Proyek Anda',
            'missing' => 'Silakan tentukan ID Proyek yang akan digunakan.'
        ],
        'detach_confirm' => 'Anda yakin akan melepaskan proyek ini?',
        'unbind_success' => 'Proyek telah berhasil dilepaskan.'
    ],
    'settings' => [
        'menu_label' => 'Pengaturan',
        'not_found' => 'Tidak dapat menemukan pengaturan yang ditentukan.',
        'missing_model' => 'Laman pengaturan kehilangan definisi Model.',
        'update_success' => 'Pengaturan untuk :name berhasil diperbarui.',
        'return' => 'Kembali ke pengaturan sistem',
        'search' => 'Pencarian'
    ],
    'mail' => [
        'log_file' => 'Berkas catatan',
        'menu_label' => 'Penyusunan surat',
        'menu_description' => 'Kelola susunan surat elektronik.',
        'general' => 'Umum',
        'method' => 'Metode Surat',
        'sender_name' => 'Nama Pengirim',
        'sender_email' => 'Surel Pengirim',
        'php_mail' => 'PHP mail',
        'smtp' => 'SMTP',
        'smtp_address' => 'Alamat SMTP',
        'smtp_authorization' => 'Otorisasi SMTP diperlukan',
        'smtp_authorization_comment' => 'Gunakan kotak cek ini jika peladen SMTP Anda memerlukan otorisasi.',
        'smtp_username' => 'Nama pengguna',
        'smtp_password' => 'Sandi lewat',
        'smtp_port' => 'Porta SMTP',
        'smtp_ssl' => 'Koneksi SSL diperlukan',
        'sendmail' => 'Sendmail',
        'sendmail_path' => 'Jalur Sendmail',
        'sendmail_path_comment' => 'Silakan tentukan jalur ke program sendmail.',
        'mailgun' => 'Mailgun',
        'mailgun_domain' => 'Ranah Mailgun',
        'mailgun_domain_comment' => 'Silakan tentukan nama ranah Mailgun.',
        'mailgun_secret' => 'Mailgun Secret',
        'mailgun_secret_comment' => 'Masukan kunci API Mailgun.',
        'mandrill' => 'Mandrill',
        'mandrill_secret' => 'Mandrill Secret',
        'mandrill_secret_comment' => 'Masukan kunci API Mandrill.'
    ],
    'mail_templates' => [
        'menu_label' => 'Acuan Surat',
        'menu_description' => 'Ubah acuan surat yang dikirim kepada pengguna dan administrator, kelola tata letak surel.',
        'new_template' => 'Acuan Baru',
        'new_layout' => 'Tata Letak Baru',
        'template' => 'Acuan',
        'templates' => 'Acuan',
        'menu_layouts_label' => 'Tata Letak Surat',
        'layout' => 'Tata Letak',
        'layouts' => 'Tata Letak',
        'name' => 'Nama',
        'name_comment' => 'Nama unik yang digunakan untuk merujuk acuan ini',
        'code' => 'Kode',
        'code_comment' => 'Kode unik yang digunakan untuk merujuk acuan ini',
        'subject' => 'Pokok Bahasan',
        'subject_comment' => 'Pokok bahasan pesan surel',
        'description' => 'Jabaran',
        'content_html' => 'HTML',
        'content_css' => 'CSS',
        'content_text' => 'Teks polos',
        'test_send' => 'Kirim pesan ujicoba',
        'test_success' => 'Pesan ujicoba berhasil dikirim.',
        'return' => 'Kembali ke senarai acuan'
    ],
    'install' => [
        'project_label' => 'Kaitkan Ke Proyek',
        'plugin_label' => 'Pasang Pengaya',
        'missing_plugin_name' => 'Silakan tentukan nama Pengaya yang akan dipasang.',
        'install_completing' => 'Menyelesaikan proses pemasangan',
        'install_success' => 'Pengaya berhasil dipasang.'
    ],
    'updates' => [
        'title' => 'Kelola Pembaruan',
        'name' => 'Pembaruan perangkat lunak',
        'menu_label' => 'Pembaruan',
        'menu_description' => 'Pembaruan sistem, pengelolaan dan pasang pengaya dan tema.',
        'check_label' => 'Periksa pembaruan',
        'retry_label' => 'Coba lagi',
        'plugin_name' => 'Nama',
        'plugin_description' => 'Jabaran',
        'plugin_version' => 'Versi',
        'plugin_author' => 'Penulis',
        'plugin_not_found' => 'Plugin not found',
        'core_current_build' => 'Binaan kini',
        'core_build' => 'Binaan :build',
        'core_build_help' => 'Tersedia binaan terbaru.',
        'core_downloading' => 'Mengunduh berkas-berkas aplikasi',
        'core_extracting' => 'Membongkar berkas aplikasi',
        'plugins' => 'Pengaya',
        'disabled' => 'Dilumpuhkan',
        'plugin_downloading' => 'Mengunduh pengaya: :name',
        'plugin_extracting' => 'Membongkar pengaya: :name',
        'plugin_version_none' => 'Pengaya baru',
        'theme_new_install' => 'Pemasangan tema baru.',
        'theme_downloading' => 'Mengunduh tema: :name',
        'theme_extracting' => 'Membuka tema: :name',
        'update_label' => 'Pembaruan perangkat lunak',
        'update_completing' => 'Menyelesaikan proses pembaruan',
        'update_loading' => 'Memuat pembaruan yang tersedia...',
        'update_success' => 'Proses pembaruan berhasil dilaksanakan.',
        'update_failed_label' => 'Pembaruan gagal',
        'force_label' => 'Paksa pembaruan',
        'found' => [
            'label' => 'Terdapat pembaruan baru!',
            'help' => 'Klik Pembaruan perangkat lunak untuk memulai proses pembaruan.'
        ],
        'none' => [
            'label' => 'Tidak ada pembaruan',
            'help' => 'Tidak ditemukan pembaruan baru.'
        ]
    ],
    'server' => [
        'connect_error' => 'Galat mengkoneksikan dengan peladen.',
        'response_not_found' => 'Peladen pembaruan tidak dapat ditemukan.',
        'response_invalid' => 'Tanggapan tidak valid dari peladen.',
        'response_empty' => 'Tanggapan kosong dari peladen.',
        'file_error' => 'Peladen gagal mengirimkan paket.',
        'file_corrupt' => 'Berkas dari peladen tidak lengkap.'
    ],
    'behavior' => [
        'missing_property' => 'Kelas :class harus menetapkan properti $:property digunakan oleh behavior :behavior.'
    ],
    'config' => [
        'not_found' => 'Tidak dapat menemukan berkas pengaturan :file ditetapkan untuk :location.',
        'required' => "Pengaturan yang digunakan pada :location harus memberikan nilai ':property'."
    ],
    'zip' => [
        'extract_failed' => "Tidak dapat membuka berkas inti ':file'."
    ],
    'event_log' => [
        'hint' => 'Catatan ini menampilkan senarai kemungkinan galat yang terjadi pada aplikasi, seperti `exception` dan informasi awakutu.',
        'menu_label' => 'Catatan Peristiwa',
        'menu_description' => 'Tampilan catatan pesan sistem dengan rekam waktu dan rinciannya.',
        'empty_link' => 'Kosongkan catatan peristiwa',
        'empty_loading' => 'Mengosongkan catatan peristiwa...',
        'empty_success' => 'Berhasil mengosongkan catatan peristiwa.',
        'return_link' => 'Kembali ke catatan peristiwa',
        'id' => 'ID',
        'id_label' => 'ID Peristiwa',
        'created_at' => 'Tanggal & Waktu',
        'message' => 'Pesan',
        'level' => 'Tingkat'
    ],
    'request_log' => [
        'hint' => 'Catatan ini menampilkan senarai permintaan dari peramban yang mungkin memerlukan perhatian. Contohnya, jika pengunjung membuka laman CMS yang tidak dapat ditemukan, rekam dibuat dengan kode status 404.',
        'menu_label' => 'Catatan permintaan',
        'menu_description' => 'Tampilan permintaan buruk atau diarahkan ulang, seperti Lama tidak ditemukan (404).',
        'empty_link' => 'Kosongkan catatan permintaan',
        'empty_loading' => 'Mengosongkan catatan permintaan...',
        'empty_success' => 'Berhasil mengosongkan catatan permintaan.',
        'return_link' => 'Kembali ke catatan permintaan',
        'id' => 'ID',
        'id_label' => 'ID Catatan',
        'count' => 'Hitungan',
        'referer' => 'Perujuk',
        'url' => 'URL',
        'status_code' => 'Status'
    ],
    'permissions' => [
        'name' => 'Sistem',
        'manage_system_settings' => 'Kelola pengaturan sistem',
        'manage_software_updates' => 'Kelola pembaruan perangkat lunak',
        'manage_mail_templates' => 'Kelola acuan surat',
        'manage_mail_settings' => 'Kelola pengaturan surat',
        'manage_other_administrators' => 'Kelola administrator lainnya',
        'view_the_dashboard' => 'Tampilan dasbor'
    ]
];
