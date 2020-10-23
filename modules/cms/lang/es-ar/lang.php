<?php

return [
    'cms_object' => [
        'invalid_file' => 'Nombre inválido del archivo: :name. El nombre del archivo debe contener solamente caracteres alfanuméricos, guiones bajos, barras y puntos. Algunos ejemplos de nombres correctos son: archivo.htm, archivo, subdirectorio/archivo',
        'invalid_property' => 'La propiedad ":name" no puede establecerse',
        'file_already_exists' => 'Archivo ":name" ya existe.',
        'error_saving' => 'Error guardando archivo ":name". Por favor revisar los permisos de escritura.',
        'error_creating_directory' => 'Error creando el directorio :name. Por favor revisar los permisos de escritura.',
        'invalid_file_extension'=>'Extensión de archivo inválida: :invalid. Las extensiones permitidas son: :allowed.',
        'error_deleting' => 'Error borrando el archivo template ":name". Por favor revisar los permisos de escritura.',
        'delete_success' => 'Los templates fueron borrados exitosamente: :count.',
        'file_name_required' => 'Falta el nombre del campo del archivo.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "El tema activo no se ha establecido.",
            'not_found' => "El tema activo no se encuentra.",
        ],
        'edit' => [
            'not_set' => "El tema de edición no se ha establecido.",
            'not_found' => "El tema de edición no se encuentra.",
            'not_match' => "El objeto que está intentando acceder no pertenece al tema que se está editando. Vuelve a cargar la página."
        ],
        'settings_menu' => 'Plantilla',
        'settings_menu_description' => 'Vista previa de la lista de las plantillas instaladas.',
        'find_more_themes' => 'Busque más Plantillas',
        'activate_button' => 'Activar',
        'active_button' => 'Activar',
    ],
    'page' => [
        'not_found' => [
            'label' => "Página no encontrada",
            'help' => "La página solicitada no se puede encontrar.",
        ],
        'custom_error' => [
            'label' => "Error de página",
            'help' => "Lo sentimos, ha ocurrido un error y la página no se puede mostrar.",
        ],
        'menu_label' => 'Páginas',
        'no_list_records' => 'No se encontraron páginas',
        'new' => 'Nueva página',
        'invalid_url' => 'Formato de URL inválido. El URL debe comenzar con el símbolo de barra diagonal y puede contener dígitos, letras latinas y los siguientes símbolos: _-[]:?|/+*^$',
        'delete_confirm_multiple' => '¿Realmente quiere eliminar las páginas seleccionadas?',
        'delete_confirm_single' => '¿Realmente quieres eliminar esta página?',
        'no_layout' => '-- ninguna disposición --'
    ],
    'layout' => [
        'not_found_name' => "El diseño ':name' no se encuentra",
        'menu_label' => 'Diseños',
        'no_list_records' => 'No se ecnontraron diseños',
        'new' => 'Nuevo diseño',
        'delete_confirm_multiple' => 'Realmente quiere borrar los diseños seleccionados?',
        'delete_confirm_single' => 'Realmente quiere borrar este diseño?'
    ],
    'partial' => [
        'not_found_name' => "El nombre parcial ':name' no se encuentra.",
        'invalid_name' => "Nombre parcial inválido: :name.",
        'menu_label' => 'Parciales',
        'no_list_records' => 'No se encontraron parciales',
        'delete_confirm_multiple' => 'Realmente quiere borrar los parciales seleccionados?',
        'delete_confirm_single' => 'Realmente quiere borrar este parcial?',
        'new' => 'Nuevo parcial'
    ],
    'content' => [
        'not_found_name' => "El contenido del archivo ':name' no se encuentra.",
        'menu_label' => 'Contenido',
        'no_list_records' => 'No se encuentra el conteinod de los archivos',
        'delete_confirm_multiple' => 'Realmente desea borrar los contenidos seleccionados de los archivos o directorios?',
        'delete_confirm_single' => 'Realmente desea borrar el contenido de este archivo?',
        'new' => 'Nuevo contenido de archivo'
    ],
    'ajax_handler' => [
        'invalid_name' => "Manejador de AJAX inválido: :name.",
        'not_found' => "El manejador de AJAX ':name' no se encuentra.",
    ],
    'cms' => [
        'menu_label' => "Gestión"
    ],
    'sidebar' => [
        'add' => 'Agregar',
        'search' => 'Buscar...'
    ],
    'editor' => [
        'settings' => 'Configuración',
        'title' => 'Título',
        'new_title' => 'Nuevo título de la página',
        'url' => 'URL',
        'filename' => 'Nombre del archivo',
        'layout' => 'Disposición',
        'description' => 'Descripción',
        'preview' => 'Vista previa',
        'meta' => 'Meta',
        'meta_title' => 'Meta Título',
        'meta_description' => 'Meta Descripción',
        'markup' => 'Marcado',
        'code' => 'Código',
        'content' => 'Contenido',
        'hidden' => 'Oculto',
        'hidden_comment' => 'A las páginas ocultas solamente pueden acceder los usuarios del back-end que se encuentren logueados.',
        'enter_fullscreen' => 'Ingresar en el modo pantalla completa',
        'exit_fullscreen' => 'Salir de pantalla completa'
    ],
    'asset' => [
        'menu_label' => "Assets",
        'drop_down_add_title' => 'Add...',
        'drop_down_operation_title' => 'Action...',
        'upload_files' => 'Upload file(s)',
        'create_file' => 'Create file',
        'create_directory' => 'Create directory',
        'directory_popup_title' => 'Nuevo directorio',
        'directory_name' => 'Nombre del directorio',
        'rename' => 'Renombrar',
        'delete' => 'Borrar',
        'move' => 'Mover',
        'select' => 'Seleccionar',
        'new' => 'Nuevo archivo',
        'rename_popup_title' => 'Renombrar',
        'rename_new_name' => 'Nuevo nombre',
        'invalid_path' => 'El path solamente puede contener dígitos, letras, espacios y los símbolos siguientes: ._-/',
        'error_deleting_file' => 'Error al borrar el archivo :name.',
        'error_deleting_dir_not_empty' => 'Error borrando el directorio :name. El directorio no está vacío.',
        'error_deleting_dir' => 'Error borrando el archivo :name.',
        'invalid_name' => 'El nombre solamente puede contener dígitos, letras, espacios y los símbolos siguientes: ._-',
        'original_not_found' => 'El archivo o directorio original no se encuentra',
        'already_exists' => 'Un archivo o directorio con este nombre ya existe',
        'error_renaming' => 'Error renombrando el archivo o directorio',
        'name_cant_be_empty' => 'El nombre no puede estar vacío',
        'too_large' => 'El archivo subido es demasiado pesado. El tamaño máximo permitido es :max_size',
        'type_not_allowed' => 'Solamente los siguientes tipos de archivos están permitidos: :allowed_types',
        'file_not_valid' => 'El archivo no es válido',
        'error_uploading_file' => 'Error subiendo el archivo ":name": :error',
        'move_please_select' => 'por favor seleccionar',
        'move_destination' => 'Directorio destino',
        'move_popup_title' => 'Mover los títulos emergentes',
        'move_button' => 'Mover',
        'selected_files_not_found' => 'Los archivos seleccionados no se encuentran',
        'select_destination_dir' => 'Por favor seleccione un directorio destino',
        'destination_not_found' => 'El directorio destino no se encuentra',
        'error_moving_file' => 'Error moviendo archivo :file',
        'error_moving_directory' => 'Error moviendo el directorio :dir',
        'error_deleting_directory' => 'Error borrando el directorio original :dir',
        'path' => 'Path'
    ],
    'component' => [
        'menu_label' => "Componentes",
        'unnamed' => "Sin nombre",
        'no_description' => "No se proporciona descripción",
        'alias' => "Alias",
        'alias_description' => "Se le ha asignado un nombre único a este componente cuando se lo utilizaba en la página o en el código de disposición.",
        'validation_message' => "El componente alias es requerido y puede contener solamente letras, números y guión bajo. El alias debe empezar con una letra.",
        'invalid_request' => "La plantilla no puede ser guardada porque tiene datos inválidos.",
        'no_records' => 'No se encontraron componentes',
        'not_found' => "El componente ':name' no se encuentra.",
        'method_not_found' => "El componente ':name' no contiene un método ':method'.",
    ],
    'template' => [
        'invalid_type' => "Tipo de plantilla Desconocido.",
        'not_found' => "No se encontró la plantilla solicitada.",
        'saved'=> "La plantilla se ha guardado correctamente."
    ],
    'permissions' => [
        'manage_content' => 'Gestionar contenido',
        'manage_assets' => 'Gestionar archivos',
        'manage_pages' => 'Gestionar páginas',
        'manage_layouts' => 'Gestionar diseños',
        'manage_partials' => 'Gestionar parciales',
        'manage_themes' => 'Gestionar plantilla'
    ]
];
