<?php return [
  'app' => [
    'name' => 'October CMS',
    'tagline' => 'Getting back to basics',
  ],
  'directory' => [
    'create_fail' => 'No se puede crear el directorio: :name',
  ],
  'file' => [
    'create_fail' => 'No se puede crear el archivo: :name',
  ],
  'combiner' => [
    'not_found' => 'El archivo combinado \':name\' no se encuentra.',
  ],
  'system' => [
    'name' => 'Sistema',
    'menu_label' => 'Sistema',
    'categories' => [
      'cms' => 'CMS',
      'misc' => 'Miscelánea',
      'logs' => 'Registros',
      'mail' => 'Correo',
      'shop' => 'Comprar',
      'team' => 'Equipo',
      'users' => 'Usuarios',
      'system' => 'Sistema',
      'social' => 'Social',
      'events' => 'Eventos',
      'customers' => 'Clientes',
      'my_settings' => 'Mis configuraciones',
    ],
  ],
  'plugin' => [
    'unnamed' => 'Plugin sin nombre',
    'name' => [
      'label' => 'Nombre del plugin',
      'help' => 'Buscar el plugin por su nombre de codigo unico. Por ejemplo: RainLab.Blog',
    ],
  ],
  'plugins' => [
    'enable_or_disable' => 'Activar o desactivar',
    'enable_or_disable_title' => 'Activar o desactivar plugins',
    'remove' => 'Eliminar',
    'refresh' => 'Actualizar',
    'disabled_label' => 'Desactivado',
    'disabled_help' => 'Los Plugins desactivados son ignorados por la aplicación.',
    'selected_amount' => 'Plugins seleccionados: :amount',
    'remove_confirm' => '¿Está usted seguro?',
    'remove_success' => 'Se eliminaron exitosamente los plugins del sistema.',
    'refresh_confirm' => '¿Está usted seguro?',
    'refresh_success' => 'Se actualizaron exitosamente los plugins del sistema.',
    'disable_confirm' => '¿Está usted seguro?',
    'disable_success' => 'Se desactivaron exitosamente los plugins.',
    'enable_success' => 'Se activaron exitosamente los plugins.',
    'unknown_plugin' => 'Se eliminó el plugin del sistema de archivos.',
  ],
  'project' => [
    'attach' => 'Adjuntar Proyecto',
    'detach' => 'Separar Proyect',
    'none' => 'Ningun',
    'id' => [
      'missing' => 'Por favor, especifique un ID del proyecto para usar.',
    ],
    'detach_confirm' => '¿Seguro que quieres separar este proyecto?',
    'unbind_success' => 'El proyecto ha sido separado con éxito.',
  ],
  'settings' => [
    'search' => 'Buscar',
  ],
  'mail' => [
    'smtp_ssl' => 'Conexión SSL requerida',
  ],
  'mail_templates' => [
    'name_comment' => 'Nombre único utilizado para referirse a esta plantilla',
    'test_send' => 'Enviar mensaje de prueba',
    'return' => 'Volver a la lista de plantilla',
  ],
  'install' => [
    'plugin_label' => 'Instalar Plugin',
  ],
  'updates' => [
    'plugin_author' => 'Autor',
    'plugin_not_found' => 'Plugin not found',
    'core_build' => 'Versión :build',
    'core_build_help' => 'Última versión está disponible.',
    'plugin_version_none' => 'Nuevo plugin',
    'theme_new_install' => 'Intalación de nuevo tema.',
    'theme_extracting' => 'Descomprimiendo tema: :name',
    'update_label' => 'Actualizando software',
    'update_loading' => 'Cargando actualizaciones disponibles...',
    'force_label' => 'Forzar actualización',
    'found' => [
      'label' => 'Se encontraron nuevas actualizaciones!',
      'help' => 'Click Actualizar software para comenzar con el proceso de actualización.',
    ],
    'none' => [
      'label' => 'No hay actualizaciones',
      'help' => 'No se encontraron nuevas actualizaciones disponibles.',
    ],
  ],
  'server' => [
    'connect_error' => 'Error al conectar con el servidor.',
    'response_not_found' => 'El servidor de actualización no se pudo encontrar.',
    'response_invalid' => 'Respuesta no válida del servidor.',
    'response_empty' => 'Respuesta vacía desde el servidor.',
    'file_error' => 'El servidor no pudo entregar el paquete.',
    'file_corrupt' => 'El archivo se encuentra dañado.',
  ],
  'behavior' => [
    'missing_property' => 'Clase :class debe definir la propiedad $:property utilizada por :behavior comportamiento.',
  ],
  'config' => [
    'not_found' => 'No se puede encontrar el archivo de configuración :file definido por :location.',
    'required' => 'Configuración utilizada en :location debe proporcionar un valor. \':property\'.',
  ],
  'zip' => [
    'extract_failed' => 'No se puede extraer el archivo \':file\'.',
  ],
  'event_log' => [],
  'request_log' => [
    'empty_link' => 'El registro de accesos se encuentra vacío',
    'empty_loading' => 'Borrando los logs...',
    'empty_success' => 'Los logs fueron borrados...',
    'return_link' => 'Regresar al registro de accesso',
    'id' => 'ID',
  ],
  'permissions' => [
    'manage_system_settings' => 'Gestionar la configuración del sistema',
    'manage_software_updates' => 'Gestionar actualización de software',
    'manage_mail_templates' => 'Gestionar plantillas de correo',
    'manage_other_administrators' => 'Gestionar otros administradores',
  ],
];
