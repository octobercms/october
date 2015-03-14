<?php

return [
    'cms_object' => [
        'invalid_file' => 'Nama berkas: :name tidak valid. Nama berkas hanya dapat memuat angka, huruf, garis bawah, strip, dan titik. Contoh penamaan berkas yang benar: laman.htm, laman, subdirektori/laman',
        'invalid_property' => "Properti ':name' tidak dapat diatur",
        'file_already_exists' => "Berkas ':name' sudah ada.",
        'error_saving' => "Galat menyimpan berkas ':name'. Silakan periksa izin tulis.",
        'error_creating_directory' => 'Galat membuat direktori :name. Silakan periksa izin tulis.',
        'invalid_file_extension'=>'Ekstensi berkas: :invalid tidak valid. Ekstensi yang diperbolehkan: :allowed.',
        'error_deleting' => "Galat menghapus berkas acuan ':name'. Silakan periksa izin tulis.",
        'delete_success' => 'Acuan: :count berhasil dihapus.',
        'file_name_required' => 'Bidang nama berkas diperlukan.'
    ],
    'theme' => [
        'active' => [
            'not_set' => 'Tema aktif tidak diatur.',
            'not_found' => 'Tema aktif tidak ditemukan.'
        ],
        'edit' => [
            'not_set' => 'Tema tersunting tidak diatur.',
            'not_found' => 'Tema tersunting tidak ditemukan.',
            'not_match' => "Objek yang Anda coba akses tidak dimiliki oleh tema yang akan disunting. Silakan muat ulang laman."
        ],
        'settings_menu' => 'Tema front-end',
        'settings_menu_description' => 'Tinjau senarai tema terpasang dan pilih tema aktif.',
        'find_more_themes' => 'Temukan lebih banyak tema pada Toko Tema OctoberCMS.',
        'activate_button' => 'Aktifkan',
        'active_button' => 'Aktif',
        'customize_button' => 'Ubah suai'
    ],
    'maintenance' => [
        'settings_menu' => 'Mode perbaikan',
        'settings_menu_description' => 'Penyusunan laman mode perbaikan dan tukar pengaturan.',
        'is_enabled' => 'Berdayakan mode perbaikan',
        'is_enabled_comment' => 'Bila diaktifkan, pengunjung website akan melihat laman terpilih berikut.'
    ],
    'page' => [
        'not_found' => [
            'label' => 'Laman tidak ditemukan',
            'help' => 'Laman yang diminta tidak dapat ditemukan.'
        ],
        'custom_error' => [
            'label' => 'Lamat galat',
            'help' => "Mohon maaf, ada sesuatu yang salah dan laman tidak dapat ditampilkan."
        ],
        'menu_label' => 'Laman',
        'unsaved_label' => 'Laman tak tersimpan',
        'no_list_records' => 'Tidak ada laman ditemukan',
        'new' => 'Laman baru',
        'invalid_url' => 'Format URL tidak valid. URL harus diawali dengan garis miring terbalik dan memuat huruf latin, angka dan simbol-simbol ini: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Anda yakin akan menghapus laman terpilih?',
        'delete_confirm_single' => 'Anda yakin akan menghapus laman ini?',
        'no_layout' => '-- tanpa tata letak --'
    ],
    'layout' => [
        'not_found' => "Tata letak ':name' tidak ditemukan",
        'menu_label' => 'Tata letak',
        'unsaved_label' => 'Tata letak tak tersimpan',
        'no_list_records' => 'Tidak ada tata letak ditemukan',
        'new' => 'Tata letak baru',
        'delete_confirm_multiple' => 'Anda yakin akan menghapus tata letak terpilih?',
        'delete_confirm_single' => 'Anda yakin akan menghapus tata letak ini?'
    ],
    'partial' => [
        'invalid_name' => 'Nama bagian: :name tidak valid.',
        'not_found' => "Bagian ':name' tidak ditemukan.",
        'menu_label' => 'Bagian',
        'unsaved_label' => 'Bagian tak tersimpan',
        'no_list_records' => 'Tidak ada bagian ditemukan',
        'delete_confirm_multiple' => 'Anda yakin akan menghapus bagian terpilih?',
        'delete_confirm_single' => 'Anda yakin akan menghapus bagian ini?',
        'new' => 'Bagian baru'
    ],
    'content' => [
        'not_found' => "Berkas muatan ':name' tidak ditemukan.",
        'menu_label' => 'Muatan',
        'unsaved_label' => 'Muatan tak tersimpan',
        'no_list_records' => 'Tidak ada muatan ditemukan',
        'delete_confirm_multiple' => 'Anda yakin akan menghapus berkas atau direktori muatan terpilih?',
        'delete_confirm_single' => 'Anda yakin akan menghapus berkas muatan ini?',
        'new' => 'Berkas muatan baru'
    ],
    'ajax_handler' => [
        'invalid_name' => 'Nama AJAX handler: :name tidak valid.',
        'not_found' => "AJAX handler ':name' tidak ditemukan."
    ],
    'cms' => [
        'menu_label' => 'CMS'
    ],
    'sidebar' => [
        'add' => 'Tambah',
        'search' => 'Pencarian...'
    ],
    'editor' => [
        'settings' => 'Pengaturan',
        'title' => 'Judul',
        'new_title' => 'Judul laman baru',
        'url' => 'URL',
        'filename' => 'Nama berkas',
        'layout' => 'Tata letak',
        'description' => 'Jabaran',
        'preview' => 'Tinjau',
        'meta' => 'Meta',
        'meta_title' => 'Judul Meta',
        'meta_description' => 'Jabaran Meta',
        'markup' => 'Markup',
        'code' => 'Kode',
        'content' => 'Muatan',
        'hidden' => 'Tersembunyi',
        'hidden_comment' => 'Laman tersembunyi hanya dapat diakses oleh pengguna back-end yang telah catat masuk.',
        'enter_fullscreen' => 'Masuk mode layar penuh',
        'exit_fullscreen' => 'Keluar mode layar penuh'
    ],
    'asset' => [
        'menu_label' => 'Aset',
        'unsaved_label' => 'Aset tak tersimpan',
        'drop_down_add_title' => 'Tambah...',
        'drop_down_operation_title' => 'Aksi...',
        'upload_files' => 'Unggah berkas',
        'create_file' => 'Buat berkas',
        'create_directory' => 'Buat direktori',
        'directory_popup_title' => 'Direktori baru',
        'directory_name' => 'Nama direktori',
        'rename' => 'Ganti nama',
        'delete' => 'Hapus',
        'move' => 'Pindah',
        'select' => 'Pilih',
        'new' => 'Berkas baru',
        'rename_popup_title' => 'Ganti nama',
        'rename_new_name' => 'Nama baru',
        'invalid_path' => 'Jalur hanya dapat memuat angka, huruf Latin, spasi dan simbol-simbol ini: ._-/',
        'error_deleting_file' => 'Galat menghapus berkas :name.',
        'error_deleting_dir_not_empty' => 'Galat menghapus direktori :name. Direktori tersebut berisi.',
        'error_deleting_dir' => 'Galat menghapus berkas :name.',
        'invalid_name' => 'Nama hanya dapat memuat angka, huruf Latin, spasi dan simbol-simbol ini: ._-',
        'original_not_found' => 'Berkas atau direktori asal tidak ditemukan',
        'already_exists' => 'Sudah ada berkas atau direktori dengan nama ini',
        'error_renaming' => 'Galat ganti nama berkas atau direktori',
        'name_cant_be_empty' => 'Nama tidak boleh kosong',
        'too_large' => 'Berkas unggahan terlalu besar. Ukuran maksimal yang diperbolahkan adalah :max_size',
        'type_not_allowed' => 'Hanya jenis-jenis berkas berikut yang diperbolahkan: :allowed_types',
        'file_not_valid' => 'Berkas tidak valid',
        'error_uploading_file' => "Galat mengunggah berkas ':name': :error",
        'move_please_select' => 'silakan pilih',
        'move_destination' => 'Direktori tujuan',
        'move_popup_title' => 'Pindahkan aset',
        'move_button' => 'Pindahkan',
        'selected_files_not_found' => 'Berkas terpilih tidak ditemukan',
        'select_destination_dir' => 'Silakan pilih direktori tujuan',
        'destination_not_found' => 'Direktori tujuan tidak ditemukan',
        'error_moving_file' => 'Galat memindahkan berkas :file',
        'error_moving_directory' => 'Galat memindahkan direktori :dir',
        'error_deleting_directory' => 'Galat menghapus direktori asal :dir',
        'path' => 'Jalur'
    ],
    'component' => [
        'menu_label' => 'Komponen',
        'unnamed' => 'Tak bernama',
        'no_description' => 'Tidak ada jabaran',
        'alias' => 'Alias',
        'alias_description' => 'Nama unik untuk komponen ini saat digunakan di dalam kode laman atau tata letak.',
        'validation_message' => 'Alias komponen diperlukan dan hanya dapat memuat simbol Latin, angka, dan garis bawah. Alias harus diawali dengan simbol Latin.',
        'invalid_request' => 'Acuan tidak dapat disimpan dikarenakan data komponen tidak valid.',
        'no_records' => 'Tidak ada komponen ditemukan',
        'not_found' => "Komponen ':name' tidak ditemukan.",
        'method_not_found' => "Komponen ':name' tidak berisi metode ':method'."
    ],
    'template' => [
        'invalid_type' => 'Jenis acuan tidak diketahui.',
        'not_found' => 'Acuan yang diminta tidak ditemukan.',
        'saved'=> 'Acuan berhasil disimpan.'
    ],
    'permissions' => [
        'name' => 'Cms',
        'manage_content' => 'Kelola muatan',
        'manage_assets' => 'Kelola aset',
        'manage_pages' => 'Kelola laman',
        'manage_layouts' => 'Kelola tata letak',
        'manage_partials' => 'Kelola bagian',
        'manage_themes' => 'Kelola tema'
    ]
];
