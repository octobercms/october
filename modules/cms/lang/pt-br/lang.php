<?php

return [
    'cms_object' => [
        'invalid_file' => 'Nome de arquivo inválido: :name. Os nomes de arquivos podem conter apenas símbolos alfanuméricos, sublinhados, traços e pontos. Alguns exemplos de nomes de arquivos corretos: page.htm, página subdiretório/página',
        'invalid_property' => 'A propriedade ":nome" não pode ser definido',
        'file_already_exists' => 'Arquivo ":name" já existe.',
        'error_saving' => 'Erro ao salvar o arquivo ":name".',
        'error_creating_directory' => 'Erro ao criar o diretório :name',
        'invalid_file_extension'=>'Extenção de arquivo inválido: :invalid. Extenções válidas: :allowed.',
        'error_deleting' => 'Erro ao excluir o arquivo de modelo ":name".',
        'delete_success' => 'Modelos apagados com sucesso: :count.',
        'file_name_required' => 'O campo Nome do Arquivo é necessária.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "O tema ativo não está definido.",
        ],
        'edit' => [
            'not_set' => "O tema de edição não está definido.",
            'not_found' => "O tema de edição não foi encontrado.",
            'not_match' => "O objeto que você está tentando acessar não pertence ao tema que está sendo editado. Por favor, recarregue a página."
        ]
    ],
    'page' => [
        'not_found' => [
            'label' => "Página não encontrada",
            'help' => "A página solicitada não pode ser encontrada.",
        ],
        'custom_error' => [
            'label' => "Erro na página",
            'help' => "Lamentamos, mas algo deu errado e que a página não pode ser exibida.",
        ],
        'menu_label' => 'Páginas',
        'no_list_records' => 'Nenhuma página foi encontradas',
        'invalid_url' => 'Formato de URL inválido. O URL deve começar com o símbolo de barra e pode conter dígitos, letras latinas e os seguintes símbolos: _-[]:?|/+*',
        'delete_confirm_multiple' => 'Você realmente quer apagar páginas selecionadas?',
        'delete_confirm_single' => 'Você realmente quer apagar esta página?',
        'no_layout' => '-- sem layout --'
    ],
    'layout' => [
        'not_found' => "O layout ':name' não foi encontrado",
        'menu_label' => 'Layouts',
        'no_list_records' => 'Nenhum layout foi encontrado',
        'new' => 'Novo layout',
        'delete_confirm_multiple' => 'Você realmente deseja excluir layouts selecionados?',
        'delete_confirm_single' => 'Você realmente quer apagar este layout?'
    ],
    'partial' => [
        'invalid_name' => "Nome parcial inválido: :name.",
        'not_found' => "O parcial ':name' não foi encontrado.",
        'menu_label' => 'Parciais',
        'no_list_records' => 'Nenhum parcial foi encontrado',
        'delete_confirm_multiple' => 'Você realmente quer apagar os parciais selecionados?',
        'delete_confirm_single' => 'Você realmente quer apagar este parcial?',
        'new' => 'Novo parcial'
    ],
    'content' => [
        'not_found' => "O arquivo de conteúdo ':name' não foi encontrado.",
        'menu_label' => 'Conteúdo',
        'no_list_records' => 'Nenhum arquivo de conteúdo foi encontrado',
        'delete_confirm_multiple' => 'Você realmente quer apagar arquivos de conteúdo selecionados ou diretórios?',
        'delete_confirm_single' => 'Você realmente quer apagar este arquivo de conteúdo?',
        'new' => 'Novo arquivo de conteúdo'
    ],
    'ajax_handler' => [
        'invalid_name' => "Nome inválido de manipulador AJAX: :name.",
        'not_found' => "Manipulador AJAX ':name' não foi encontrado.",
    ],
    'combiner' => [
        'not_found' => "O arquivo combinador ':name' não foi encontrado.",
    ],
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Adicionar',
        'search' => 'Pesquisar...'
    ],
    'editor' => [
        'settings' => 'Configurações',
        'title' => 'Título',
        'new_title' => 'Título da nova página',
        'url' => 'URL',
        'filename' => 'Nome do Arquivo',
        'layout' => 'Layout',
        'description' => 'Descrição',
        'preview' => 'Pré-visualização',
        'meta' => 'Meta',
        'meta_title' => 'Meta Título',
        'meta_description' => 'Meta Descrição',
        'markup' => 'Remarcação',
        'code' => 'Código',
        'content' => 'Conteúdo',
    ],
    'asset' => [
        'menu_label' => "Arquivos",
        'drop_down_add_title' => 'Adicionar...',
        'drop_down_operation_title' => 'Ação...',
        'upload_files' => 'Enviar arquivo(s)',
        'create_file' => 'Criar arquivo',
        'create_directory' => 'Criar diretório',
        'rename' => 'Renomear',
        'delete' => 'Remover',
        'move' => 'Mover',
        'new' => 'Novo arquivo',
        'rename_popup_title' => 'Renomear',
        'rename_new_name' => 'Novo nome',
        'invalid_path' => 'O caminho pode conter apenas dígitos, letras latinas, espaços e os seguintes símbolos: ._-/',
        'error_deleting_file' => 'Erro ao excluir do arquivo :name.',
        'error_deleting_dir_not_empty' => 'Erro ao excluir diretório :name. Diretório não está vazio.',
        'error_deleting_dir' => 'Erro ao excluir arquivo :name.',
        'invalid_name' => 'O nome pode conter apenas dígitos, letras latinas, espaços e os seguintes símbolos: ._-',
        'original_not_found' => 'O arquivo original ou diretório não foi encontrado',
        'already_exists' => 'Arquivo ou diretório com este nome já existe',
        'error_renaming' => 'Erro ao renomear o arquivo ou diretório',
        'name_cant_be_empty' => 'O nome não pode ser vazio',
        'too_large' => 'O arquivo enviado é muito grande. O tamanho de arquivo máximo permitido é :max_size',
        'type_not_allowed' => 'Apenas os seguintes tipos de arquivos são permitidos: :allowed_types',
        'file_not_valid' => 'O arquivo não é válido',
        'error_uploading_file' => 'Erro ao enviar arquivo ":name": :error',
        'move_please_select' => 'por favor, selecione',
        'move_destination' => 'Diretório de destino',
        'move_popup_title' => 'Mover arquivo',
        'move_button' => 'Mover',
        'selected_files_not_found' => 'Os arquivos selecionados não foram encontrados',
        'select_destination_dir' => 'Por favor, selecione um diretório de destino',
        'destination_not_found' => 'Diretório de destino não foi encontrado',
        'error_moving_file' => 'Erro ao mover arquivo :file',
        'error_moving_directory' => 'Erro ao mover diretório :dir',
        'error_deleting_directory' => 'Erro ao excluir o diretório original :dir',
        'path' => 'Caminho'
    ],
    'component' => [
        'menu_label' => "Componentes",
        'unnamed' => "Não nomeado",
        'no_description' => "Sem descrição fornecida",
        'alias' => "Pseudônimo",
        'alias_description' => "Um nome exclusivo dado a este componente quando usá-lo na página ou layout de código.",
        'validation_message' => "Aliases de componentes são necessários e podem conter apenas símbolos latinos, dígitos e sublinhados. Os aliases deve começar com um símbolo Latina.",
        'invalid_request' => "O modelo não pode ser salvo por causa de dados dos componentes inválidos.",
        'no_records' => 'Nenhum dos componentes foi encontrado',
        'not_found' => "O componente ':name' não foi encontrado.",
        'method_not_found' => "o componente ':name' não contém um método ':method'.",
    ],
    'template' => [
        'invalid_type' => "Tipo de modelo desconhecido.",
        'not_found' => "O modelo solicitado não foi encontrado.",
        'saved'=> "O modelo foi salvo com sucesso."
    ]
];