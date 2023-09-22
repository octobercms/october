<?php return [
  'app' => [
    'name' => 'October CMS',
    'tagline' => 'Intoarcerea la elementele de baza',
  ],
  'directory' => [
    'create_fail' => 'Nu se poate crea directorul: :name',
  ],
  'file' => [
    'create_fail' => 'Nu se poate crea fisierul: :name',
  ],
  'combiner' => [
    'not_found' => 'Fisierul compus \':name\' nu a fost gasit.',
  ],
  'system' => [
    'name' => 'Sistem',
    'menu_label' => 'Sistem',
    'categories' => [
      'cms' => 'CMS',
      'misc' => 'Altele',
      'logs' => 'Jurnal',
      'mail' => 'Mail',
      'shop' => 'Magazin',
      'team' => 'Echipa',
      'users' => 'Utilizatori',
      'system' => 'Sistem',
      'social' => 'Social',
      'events' => 'Evenimente',
      'customers' => 'Clienti',
      'my_settings' => 'Setarile mele',
    ],
  ],
  'plugin' => [
    'unnamed' => 'Plugin fara nume',
    'name' => [
      'label' => 'Nume Plugin',
      'help' => 'Denumiti plugin-ul dupa codul sau unic. De exemplu, RainLab.Blog',
    ],
  ],
  'plugins' => [
    'enable_or_disable' => 'Activare sau dezactivare',
    'enable_or_disable_title' => 'Activare sau dezactivare plugin-uri',
    'remove' => 'Inlaturare',
    'refresh' => 'Reimprospatare',
    'disabled_label' => 'Dezactivat',
    'disabled_help' => 'Plugin-urile care sunt dezactivate sunt ignorate de catre aplicatie.',
    'selected_amount' => 'Plugin-uri selectate: :amount',
    'remove_success' => 'Plugin-urile respective au fost inlaturate cu succes din sistem.',
    'refresh_success' => 'Plugin-urile respective au fost actualizate cu succes.',
    'disable_success' => 'Plugin-urile respective au fost dezactivate cu succes.',
    'enable_success' => 'Plugin-urile respective au fost activate cu succes.',
    'unknown_plugin' => 'Plugin-ul a fost inlaturat din sistemul de fisiere.',
  ],
  'project' => [
    'attach' => 'Atasare Proiect',
    'detach' => 'Detasare Proiect',
    'none' => 'Niciunul',
    'id' => [
      'missing' => 'Va rugam sa specificati un ID de Proiect.',
    ],
    'detach_confirm' => 'Sunteti sigur(a) ca doriti sa detasati acest proiect?',
    'unbind_success' => 'Proiectul a fost detasat cu succes.',
  ],
  'settings' => [
    'search' => 'Cautare',
  ],
  'mail' => [
    'smtp_ssl' => 'Conexiune SSL necesara',
  ],
  'mail_templates' => [
    'name_comment' => 'Nume unic folosit ca referinta la acest sablon',
    'test_send' => 'Trimitere mesaj de test',
    'return' => 'Intoarcere la lista de sabloane',
  ],
  'install' => [
    'plugin_label' => 'Instalare Plugin',
  ],
  'updates' => [
    'plugin_author' => 'Autor',
    'plugin_not_found' => 'Plugin not found',
    'core_build' => 'Versiune :build',
    'core_build_help' => 'Ultima versiune este disponibila.',
    'plugin_version_none' => 'Plugin nou',
    'theme_new_install' => 'Instalare tema noua.',
    'theme_extracting' => 'Se dezarhiveaza tema: :name',
    'update_label' => 'Actualizare software',
    'update_loading' => 'Se incarca actualizarile disponibile...',
    'force_label' => 'Forteaza actualizarea',
    'found' => [
      'label' => 'Au fost gasite noi actualizari!',
      'help' => 'Apasati pe "Actualizare software" pentru a incepe procesul de actualizare.',
    ],
    'none' => [
      'label' => 'Nu exista actualizari',
      'help' => 'Nu au fost gasite actualizari disponibile.',
    ],
  ],
  'server' => [
    'connect_error' => 'Eroare la conectarea la server.',
    'response_not_found' => 'Serverul de actualizari nu a putut fi contactat.',
    'response_invalid' => 'Raspuns invalid de la server.',
    'response_empty' => 'Raspuns gol de la server.',
    'file_error' => 'Serverul a esuat sa livreze pachetul software.',
    'file_corrupt' => 'Fisierul de pe server este corupt.',
  ],
  'behavior' => [
    'missing_property' => 'Clasa :class trebuie sa defineasca proprietatea $:property folosita pentru caracteristica :behavior.',
  ],
  'config' => [
    'not_found' => 'Nu a fost gasit fisierul de configurare :file definit pentru :location.',
    'required' => 'Configuratia folosita in :location trebuie sa furnizeze o valoare \':property\'.',
  ],
  'zip' => [
    'extract_failed' => 'Nu s-a putut extrage fisierul de baza \':file\'.',
  ],
  'event_log' => [],
  'request_log' => [
    'empty_link' => 'Golire jurnal de cereri',
    'empty_loading' => 'Se goleste jurnalul de cereri...',
    'empty_success' => 'Jurnalul cu cereri a fost golit cu succes.',
    'return_link' => 'Intoarcere la jurnal de cereri',
    'id' => 'ID',
  ],
  'permissions' => [
    'manage_system_settings' => 'Gestioneaza setarile sistemului',
    'manage_software_updates' => 'Gestioneaza actualizarile software',
    'manage_mail_templates' => 'Gestioneaza sabloanele de email',
    'manage_other_administrators' => 'Gestioneaza alti administratori',
  ],
];
