<?php

return [
    'auth' => [
        'title' => 'Area Administrasi'
    ],
    'aria-label' => [
        'footer'        => 'menu footer',
        'side_panel'    => 'panel samping',
        'breadcrumb'    => 'remah roti',
        'main_content'  => 'area utama',
        'tabs'          => 'tab',
        'sidebar_menu'  => 'Menu bilah samping'
    ],
    'field' => [
        'invalid_type' => 'Jenis medan tidak valid digunakan :type.',
        'options_method_not_exists' => "Kelas model :model harus menentukan metode :method() yang mengembalikan opsi untuk borang medan ':field'."
    ],
    'widget' => [
        'not_registered' => "Kelas gawit bernama ':name' belum terdaftar",
        'not_bound' => "Gawit dengan kelas bernama ':name' belum terikat pada controller"
    ],
    'page' => [
        'untitled' => 'Tak Berjudul',
        'access_denied' => [
            'label' => 'Akses ditolak',
            'help' => "Anda tidak memiliki izin untuk melihat laman ini.",
            'cms_link' => 'Kembali ke back-end'
        ]
    ],
    'partial' => [
        'not_found' => "Potongan ':name' tidak ditemukan."
    ],
    'account' => [
        'sign_out' => 'Keluar',
        'login' => 'Catat Masuk',
        'reset' => 'Atur Ulang',
        'restore' => 'Pulihkan',
        'login_placeholder' => 'Nama Pengguna',
        'password_placeholder' => 'Sandi Lewat',
        'forgot_password' => 'Lupa sandi lewat Anda?',
        'enter_email' => 'Masukan surel Anda',
        'enter_login' => 'Masukan nama pengguna Anda',
        'email_placeholder' => 'Surel',
        'enter_new_password' => 'Masukan sandi lewat baru',
        'password_reset' => 'Atur Ulang Sandi Lewat',
        'restore_success' => 'Sebuah surat berisi petunjuk pemulihan telah dikirim ke alamat surat elektronik Anda.',
        'restore_error' => "Pengguna dengan nama pengguna ':login' tidak ditemukan",
        'reset_success' => 'Sandi lewat Anda telah diatur ulang. Anda dapat catat masuk sekarang.',
        'reset_error' => 'Data atur ulang sandi lewat yang diberikan tidak valid. Silakan ulangi lagi!',
        'reset_fail' => 'Tidak dapat mengatur ulang sandi lewat Anda!',
        'apply' => 'Terapkan',
        'cancel' => 'Urung',
        'delete' => 'Hapus',
        'ok' => 'OK'
    ],
    'dashboard' => [
        'menu_label' => 'Dasbor',
        'widget_label' => 'Gawit',
        'widget_width' => 'Lebar',
        'full_width' => 'lebar penuh',
        'add_widget' => 'Tambah gawit',
        'widget_inspector_title' => 'Penyusunan gawit',
        'widget_inspector_description' => 'Susun gawit laporan',
        'widget_columns_label' => 'Lebar :columns',
        'widget_columns_description' => 'Lebar gawit, angka antara 1 sampai 10.',
        'widget_columns_error' => 'Silakan masukan angka lebar gawit antara 1 sampai 10.',
        'columns' => '{1} kolom|[2,Inf] kolom',
        'widget_new_row_label' => 'Paksa baris baru',
        'widget_new_row_description' => 'Letakkan gawit pada baris baru.',
        'widget_title_label' => 'Tajuk gawit',
        'widget_title_error' => 'Tajuk gawit diperlukan.',
        'status' => [
            'widget_title_default' => 'Status sistem',
            'update_available' => '{0} pembaruan tersedia!|{1} pembaruan tersedia!|[2,Inf] pembaruan tersedia!'
        ]
    ],
    'user' => [
        'name' => 'Administrator',
        'menu_label' => 'Administrator',
        'menu_description' => 'Kelola pengguna adminstrator back-end, grup, dan perizinan.',
        'list_title' => 'Kelola Administrator',
        'new' => 'Administrator Baru',
        'login' => 'Nama Pengguna',
        'first_name' => 'Name Depan',
        'last_name' => 'Name Belakang',
        'full_name' => 'Nama Lengkap',
        'email' => 'Surel',
        'groups' => 'Grup',
        'groups_comment' => 'Tentukan grup yang dimiliki pengguna ini.',
        'avatar' => 'Avatar',
        'password' => 'Sandi lewat',
        'password_confirmation' => 'Tegaskan sandi lewat',
        'permissions' => 'Izin',
        'superuser' => 'Pengguna Super',
        'superuser_comment' => 'Centang kotak ini untuk memperkenankan pengguna ini mengakses semua area.',
        'send_invite' => 'Kirim undangan dengan surel',
        'send_invite_comment' => 'Gunakan kotak cek ini untuk mengirimi pengguna undangan surel',
        'delete_confirm' => 'Anda yakin akan menghapus administrator ini?',
        'return' => 'Kembali ke senarai administrator',
        'allow' => 'Boleh',
        'inherit' => 'Mewarisi',
        'deny' => 'Tolak',
        'group' => [
            'name' => 'Grup',
            'name_field' => 'Nama',
            'description_field' => 'Jabaran',
            'is_new_user_default_field' => 'Tambahkan administrator baru pada grup ini secara asali',
            'code_field' => 'Kode',
            'code_comment' => 'Masukkan kode unik jika Anda ingin mengakses ini dengan API.',
            'menu_label' => 'Grup',
            'list_title' => 'Kelola Grup',
            'new' => 'Grup Administrator Baru',
            'delete_confirm' => 'Anda yakin akan menghapus grup administrator ini?',
            'return' => 'Kembali ke senarai grup',
        ],
        'preferences' => [
            'not_authenticated' => 'Tidak ada pengguna berotentikasi untuk memuat atau menyimpan pengaturan.'
        ]
    ],
    'list' => [
        'default_title' => 'Senarai',
        'search_prompt' => 'Pencarian...',
        'no_records' => 'Tidak ada rekam dalam tampilan ini.',
        'missing_model' => 'Behavior Senarai yang digunakan dalam :class tidak memiliki tetapan model.',
        'missing_column' => 'Tidak ada tetapan untuk kolom :columns.',
        'missing_columns' => 'Senarai yang digunakan dalam :class tidak memiliki tetapan kolom senarai.',
        'missing_definition' => "Behavior Senarai tidak berisi kolom untuk ':field'.",
        'behavior_not_ready' => 'Behavior Senarai belum diinisialisasi, periksa apakah Anda telah memanggil makeLists() pada controller Anda.',
        'invalid_column_datetime' => "Nilai kolom ':column' bukan objek DateTime, apakah Anda lupa merujukkan \$dates dalam Model?",
        'pagination' => 'Menampilkan rekam: :from s/d :to dari :total',
        'prev_page' => 'Sebelumnya',
        'next_page' => 'Berikutnya',
        'loading' => 'Memuat...',
        'setup_title' => 'Pengaturan Senarai',
        'setup_help' => 'Gunakan kotak cek untuk memilih kolom yang ingin ditampilkan pada senarai. Anda dapat mengubah posisi kolom dengan menyeretnya naik atau turun.',
        'records_per_page' => 'Rekam per laman',
        'records_per_page_help' => 'Pilih jumlah rekam per laman untuk ditampilkan. Mohon diingat, jumlah rekam yang banyak dalam satu halaman dapat menurunkan kinerja.',
        'delete_selected' => 'Hapus yang terpilih',
        'delete_selected_empty' => 'Tidak ada rekam terpilih untuk dihapus.',
        'delete_selected_confirm' => 'Hapus rekam terpilih?',
        'delete_selected_success' => 'Berhasil menghapus rekam terpilih.',
    ],
    'fileupload' => [
        'attachment' => 'Lampiran',
        'help' => 'Tambah judul dan jabaran untuk lampiran ini.',
        'title_label' => 'Judul',
        'description_label' => 'Jabaran'
    ],
    'form' => [
        'create_title' => ':name Baru',
        'update_title' => 'Sunting :name',
        'preview_title' => 'Tinjau :name',
        'create_success' => ':name berhasil dibuat',
        'update_success' => ':name berhasil diperbarui',
        'delete_success' => ':name berhasil dihapus',
        'missing_id' => 'Borang ID rekam belum ditentukan.',
        'missing_model' => 'Behavior borang yang digunakan dalam :class tidak memiliki ketentuan model.',
        'missing_definition' => "Behavior borang tidak berisi medan untuk ':field'.",
        'not_found' => 'Borang untuk rekam dengan ID :id tidak ditemukan.',
        'action_confirm' => 'Anda yakin?',
        'create' => 'Buat',
        'create_and_close' => 'Buat dan tutup',
        'creating' => 'Membuat...',
        'creating_name' => 'Membuat :name...',
        'save' => 'Simpan',
        'save_and_close' => 'Simpan dan tutup',
        'saving' => 'Menyimpan...',
        'saving_name' => 'Menyimpan :name...',
        'delete' => 'Menghapus',
        'deleting' => 'Menghapus...',
        'deleting_name' => 'Menghapus :name...',
        'reset_default' => 'Atur ulang ke asali',
        'resetting' => 'Pengaturan ulang',
        'resetting_name' => 'Pengaturan ulang :name',
        'undefined_tab' => 'Lain-lain',
        'field_off' => 'Off',
        'field_on' => 'On',
        'add' => 'Tambah',
        'apply' => 'Terapkan',
        'cancel' => 'Urung',
        'close' => 'Tutup',
        'confirm' => 'Tetapkan',
        'reload' => 'Muat ulang',
        'ok' => 'OK',
        'or' => 'atau',
        'confirm_tab_close' => 'Anda yakin akan menutup tab? Perubahan belum tersimpan akan hilang.',
        'behavior_not_ready' => 'Behavior borang belum diinisialisasi, periksa apakah Anda telah memanggil initForm() pada controller Anda.',
        'preview_no_files_message' => 'Berkas tidak terunggah',
        'select' => 'Pilih',
        'select_all' => 'semua',
        'select_none' => 'tiada',
        'select_placeholder' => 'silakan pilih',
        'insert_row' => 'Sisipkan Baris',
        'delete_row' => 'Hapus Baris',
        'concurrency_file_changed_title' => 'Berkas telah diubah',
        'concurrency_file_changed_description' => "Berkas yang Anda sunting telah diubah pada diska oleh pengguna lain. Anda dapat memuat ulang berkas dan kehilangan perubahan yang telah Anda buat atau menimpa berkas pada diska."
    ],
    'relation' => [
        'missing_config' => "Behavior hubungan tidak memiliki pengaturan untuk ':config'.",
        'missing_definition' => "Behavior hubungan tidak berisi tentuan untuk ':field'.",
        'missing_model' => "Behavior hubungan yang digunakan dalam :class tidak memiliki ketentuan model.",
        'invalid_action_single' => "Aksi ini tidak dapat dilaksanakan di dalam perhubungan tungal.",
        'invalid_action_multi' => "Aksi ini tidak dapat dilaksanakan di dalam perhubungan banyak.",
        'help' => "Klik pada butir untuk menambah",
        'related_data' => "Terhubung data :name",
        'add' => "Tambah",
        'add_selected' => "Tambah terpilih",
        'add_a_new' => "Tambah :name baru",
        'link_selected' => "Taut terpilih",
        'link_a_new' => "Taut :name baru",
        'cancel' => "Urung",
        'close' => "Tutup",
        'add_name' => "Tambah :name",
        'create' => "Buat",
        'create_name' => "Buat :name",
        'update' => "Perbarui",
        'update_name' => "Perbarui :name",
        'preview' => "Tinjau",
        'preview_name' => "Tinjau :name",
        'remove' => "Lepas",
        'remove_name' => "Lepas :name",
        'delete' => "Hapus",
        'delete_name' => "Hapus :name",
        'delete_confirm' => "Anda yakin?",
        'link' => "Taut",
        'link_name' => "Taut :name",
        'unlink' => "Buka Taut",
        'unlink_name' => "Buka Taut :name",
        'unlink_confirm' => "Anda yakin?",
    ],
    'model' => [
        'name' => 'Model',
        'not_found' => "Model ':class' dengan ID :id tidak dapat ditemukan",
        'missing_id' => 'Tidak ada ID ditentukan untuk mencari rekam model.',
        'missing_relation' => "Model ':class' tidak berisi tentuan untuk ':relation'.",
        'missing_method' => "Model ':class' tidak berisi metode ':method'.",
        'invalid_class' => "Model :model yang digunakan pada :class tidak valid, model harus turunan kelas \Model.",
        'mass_assignment_failed' => "Penetapan masal gagal untuk atribut Model ':attribute'."
    ],
    'warnings' => [
        'tips' => 'Kiat pengaturan sistem',
        'tips_description' => 'Ada masalah yang perlu Anda perhatikan untuk mengatur sistem dengan tepat.',
        'permissions'  => 'Direktori :name atau direktori di bawahnya tidak dapat ditulis oleh PHP. Silakan atur hak akses webserver yang sesuai pada direktori ini.',
        'extension' => 'Ekstensi PHP :name tidak terpasang. Silakan pasang pustaka ini dan aktifkan ekstensi.'
    ],
    'editor' => [
        'menu_label' => 'Penyesuaian Penyunting Kode',
        'menu_description' => 'Penyesuaian penyunting kode dengan keinginan Andan, seperti ukuran fonta dan skema warna.',
        'font_size' => 'Ukuran fonta',
        'tab_size' => 'Ukuran tab',
        'use_hard_tabs' => 'Inden dengan tabs',
        'code_folding' => 'Pelipat kode',
        'word_wrap' => 'Bungkus kata',
        'highlight_active_line' => 'Sorot baris aktif',
        'show_invisibles' => 'Tampilkan karakter tak terlihat',
        'show_gutter' => 'Tampilkan parit',
        'theme' => 'Skema warna'
    ],
    'tooltips' => [
        'preview_website' => 'Tinjau website'
    ],
    'mysettings' => [
        'menu_label' => 'Pengaturanku',
        'menu_description' => 'Pengaturan yang berkaitan dengan akun administrasi Anda'
    ],
    'myaccount' => [
        'menu_label' => 'Akunku',
        'menu_description' => 'Perbarui rincian akun Anda seperti nama, alamat surel dan sandi lewat.',
        'menu_keywords' => 'security login'
    ],
    'branding' => [
        'menu_label' => 'Penyesuaian back-end',
        'menu_description' => 'Penyesuaian area administrasi seperti nama, warna dan logo.',
        'brand' => 'Brand',
        'logo' => 'Logo',
        'logo_description' => 'Unggah logo ubah suai untuk digunakan pada back-end.',
        'app_name' => 'Nama Apl',
        'app_name_description' => 'Nama ini ditampilkan pada area judul back-end.',
        'app_tagline' => 'Slogan Apl',
        'app_tagline_description' => 'Nama ini akan ditampilkan pada layar masuk back-end.',
        'colors' => 'Warna',
        'primary_color' => 'Primer color',
        'secondary_color' => 'Sekunder color',
        'accent_color' => 'Accent color',
        'styles' => 'Gaya',
        'custom_stylesheet' => 'Lembar gaya ubah suai'
    ],
    'backend_preferences' => [
        'menu_label' => 'Penyesuaian Back-end',
        'menu_description' => 'Kelola penyesuaian akun Anda seperti bahasa yang diinginkan.',
        'locale' => 'Bahasa',
        'locale_comment' => 'Pilih bahasa lokal yang ingin digunakan.'
    ],
    'access_log' => [
        'hint' => 'Catatan ini menampilkan senarai percobaan masuk yang berhasil oleh administrator. Rekam akan disimpan selama :days hari.',
        'menu_label' => 'Catatan akses',
        'menu_description' => 'Tampilan senarai pengguna back-end yang berhasil masuk.',
        'created_at' => 'Tanggal & Waktu',
        'login' => 'Nama Pengguna',
        'ip_address' => 'Alamat IP',
        'first_name' => 'Nama depan',
        'last_name' => 'Nama belakang',
        'email' => 'Surel'
    ],
    'filter' => [
      'all' => 'semua'
    ]
];