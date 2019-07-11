<?php

return [
    'auth' => [
        'title' => 'Área Administrativa',
        'invalid_login' => 'Os dados digitados não correspondem aos nossos registros. Por favor, verifique e tente novamente.'
    ],
    'aria-label' => [
        'footer'        => 'Menu de Rodapé',
        'side_panel'    => 'painel lateral',
        'breadcrumb'    => 'trilha de migalhas',
        'main_content'  => 'área principal',
        'tabs'          => 'guias',
    ],	
    'field' => [
        'invalid_type' => 'Tipo de campo inválido :type.',
        'options_method_not_exists' => 'A classe :model deve definir um método :method() retornando opções para o campo ":field".',
    ],
    'widget' => [
        'not_registered' => 'Uma classe de widget com o nome ":name" não foi definida',
        'not_bound' => 'Um widget da classe ":name" não foi ligado ao controlador',
    ],
    'page' => [
        'untitled' => 'Sem Título',
        'access_denied' => [
            'label' => 'Acesso negado',
            'help' => 'Você não tem as permissões necessárias para visualizar esta página.',
            'cms_link' => 'Retornar à área administrativa',
        ],
        'invalid_token' => [
            'label' => 'Token de segurança inválido'
        ]
    ],
    'partial' => [
        'not_found_name' => 'O bloco ":name" não foi encontrado.',
    ],
    'account' => [
        'sign_out' => 'Sair',
        'login' => 'Entrar',
        'reset' => 'Redefinir',
        'restore' => 'Restaurar',
        'login_placeholder' => 'Usuário',
        'password_placeholder' => 'Senha',
        'forgot_password' => 'Esqueceu sua senha?',
        'enter_email' => 'Entre com seu email',
        'enter_login' => 'Entre com seu nome de usuário',
        'email_placeholder' => 'E-mail',
        'enter_new_password' => 'Entre com uma nova senha',
        'password_reset' => 'Redefinir sua senha',
        'restore_success' => 'Um e-mail com instruções para redefinir sua senha foi enviado ao seu endereço de e-mail.',
        'restore_error' => 'O usuário ":login" não foi encontrado',
        'reset_success' => 'Sua senha foi redefinida com sucesso. Você já pode entrar novamente.',
        'reset_error' => 'A senha redefinida é inválida. Por favor, tente de novo!',
        'reset_fail' => 'Falha ao redefinir sua senha!',
        'apply' => 'Aplicar',
        'cancel' => 'Cancelar',
        'delete' => 'Excluir',
        'ok' => 'Ok',
    ],
    'dashboard' => [
        'menu_label' => 'Painel',
        'widget_label' => 'Widget',
        'widget_width' => 'Largura',
        'full_width' => 'Largura total',
        'manage_widgets' => 'Gerenciar widget',
        'add_widget' => 'Adicionar widget',
        'widget_inspector_title' => 'Configurações do widget',
        'widget_inspector_description' => 'Configurar widget de relatório',
        'widget_columns_label' => 'Largura :columns',
        'widget_columns_description' => 'Largura do widget, um número entre 1 e 10.',
        'widget_columns_error' => 'Por favor, entre com a largura do widget. Deve ser um número entre 1 e 10.',
        'columns' => '{1} coluna|[2,Inf] colunas',
        'widget_new_row_label' => 'Forçar uma nova linha',
        'widget_new_row_description' => 'Colocar o widget em uma nova linha.',
        'widget_title_label' => 'Título do widget',
        'widget_title_error' => 'O título do widget é necessário.',
        'reset_layout' => 'Reiniciar painel',
        'reset_layout_confirm' => 'Reiniciar o painel para a configuração padrão?',
        'reset_layout_success' => 'Painel foi reinicializado',
        'make_default' => 'Definir como padrão',
        'make_default_confirm' => 'Definir o painel atual como padrão?',
        'make_default_success' => 'Painel atual agora é o padrão',
        'status' => [
            'widget_title_default' => 'Status do Sistema',
            'update_available' => '{0} atualizações disponíveis!|{1} atualização disponível!|[2,Inf] atualizações disponíveis!',
            'updates_pending' => 'Atualizações de softwares pendentes',
            'updates_nil' => 'Software já está atualizado',
            'updates_link' => 'Atualizar',
            'warnings_pending' => 'Algumas questões precisam de atenção',
            'warnings_nil' => 'Nenhuma advertência para exibir',
            'warnings_link' => 'Visualizar',
            'core_build' => 'Versão do sistema',
            'event_log' => 'Registro de eventos',
            'request_log' => 'Registro de requisições',
            'app_birthday' => 'No ar desde',
        ],
        'welcome' => [
            'widget_title_default' => 'Seja bem-vindo',
            'welcome_back_name' => 'Seja bem-vindo no seu retorno ao :app, :name.',
            'welcome_to_name' => 'Seja bem-vindo ao :app, :name.',
            'first_sign_in' => 'Esta é a primeira vez que você acessa a área administrativa.',
            'last_sign_in' => 'Seu último acesso foi em',
            'view_access_logs' => 'Visualizar registros de acesso',
            'nice_message' => 'Tenha um excelente dia!',
        ]
    ],
    'user' => [
        'name' => 'Administrador',
        'menu_label' => 'Administradores',
        'menu_description' => 'Gerenciar administradores, grupos e permissões.',
        'list_title' => 'Gerenciar administradores',
        'new' => 'Novo administrador',
        'login' => 'Usuário',
        'first_name' => 'Nome',
        'last_name' => 'Sobrenome',
        'full_name' => 'Nome Completo',
        'email' => 'E-mail',
        'groups' => 'Grupos',
        'groups_comment' => 'Defina a quais grupos essa pessoa pertence.',
        'avatar' => 'Foto',
        'password' => 'Senha',
        'password_confirmation' => 'Confirme a senha',
        'permissions' => 'Permissões',
        'account' => 'Conta',
        'superuser' => 'Super Usuário',
        'superuser_comment' => 'Marque para liberar o acesso irrestrito para este usuário.',
        'send_invite' => 'Enviar convite por e-mail',
        'send_invite_comment' => 'Marque para enviar um convite por e-mail',
        'delete_confirm' => 'Você realmente deseja apagar este administrador?',
        'return' => 'Retornar à lista de administradores',
        'allow' => 'Permitir',
        'inherit' => 'Herdar',
        'deny' => 'Negar',
        'group' => [
            'name' => 'Grupo',
            'name_comment' => 'O nome é exibido na lista de grupos ao se criar/alterar um administrador.',
            'name_field' => 'Nome',
            'description_field' => 'Descrição',
            'is_new_user_default_field_label' => 'Grupo padrão',
            'is_new_user_default_field_comment' => 'Adicionar novos administradores a este grupo por padrão',
            'code_field' => 'Código',
            'code_comment' => 'Insira um código exclusivo se você quiser acessá-lo com a API.',
            'menu_label' => 'Grupos',
            'list_title' => 'Gerenciar grupos',
            'new' => 'Novo grupo administrador',
            'delete_confirm' => 'Você realmente deseja excluir este grupo?',
            'return' => 'Voltar para a lista de grupos',
            'users_count' => 'Usuários'
        ],
        'preferences' => [
            'not_authenticated' => 'Nenhum usuário autenticado para carregar as preferências.',
        ],
    ],
    'list' => [
        'default_title' => 'Lista',
        'search_prompt' => 'Buscar...',
        'no_records' => 'Nenhum registro encontrado.',
        'missing_model' => 'Lista usada em :class não tem um model definido.',
        'missing_column' => 'Não existe definição de coluna para :columns.',
        'missing_columns' => 'Lista utilizada em :class não possui colunas de lista definidas.',
        'missing_parent_definition' => "Comportamento de lista não possui uma definição para ':definition'.",
        'missing_definition' => 'Lista não possui uma coluna para ":field".',
        'behavior_not_ready' => 'Lista não foi inicializada. Confira se você chamou makeLists() no controller.',
        'invalid_column_datetime' => 'Valor da coluna ":column" não é um objeto DateTime, você esqueceu registrar \$dates no Model?',
        'pagination' => 'Registros exibidos: :from-:to de :total',
        'prev_page' => 'Anterior',
        'next_page' => 'Próxima',
        'refresh' => 'Atualizar',
        'updating' => 'Atualizando...',
        'loading' => 'Carregando...',
        'setup_title' => 'Configuração da Lista',
        'setup_help' => 'Selecione as colunas que deseja ver na lista. Você pode alterar as posições das colunas arrastando-as para cima ou para baixo.',
        'records_per_page' => 'Registros por página',
        'check' => 'Marcar',
        'records_per_page_help' => 'Selecione o número de registros a serem exibidos por página. Note que um número grande pode prejudicar a performance.',
        'delete_selected' => 'Excluir selecionado',
        'delete_selected_empty' => 'Não há registros selecionados para excluir.',
        'delete_selected_confirm' => 'Excluir os registros selecionados?',
        'delete_selected_success' => 'Registros selecionados excluídos com sucesso.',
        'column_switch_true' => 'Sim',
        'column_switch_false' => 'Não'
    ],
    'fileupload' => [
        'attachment' => 'Anexo',
        'help' => 'Adicione um título e descrição a este anexo.',
        'title_label' => 'Título',
        'description_label' => 'Descrição',
        'default_prompt' => 'Clique em %s ou arraste um arquivo para cá para enviar',
        'attachment_url' => 'Anexar URL',
        'upload_file' => 'Enviar arquivo',
        'upload_error' => 'Erro ao enviar',
        'remove_confirm' => 'Você tem certeza?',
        'remove_file' => 'Remover arquivo'
    ],
    'form' => [
        'create_title' => 'Novo :name',
        'update_title' => 'Editar :name',
        'preview_title' => 'Visualizar :name',
        'create_success' => ':name foi criado com sucesso',
        'update_success' => ':name foi atualizado com sucesso',
        'delete_success' => ':name foi apagado com sucesso',
        'reset_success' => 'Reinicialização completada',
        'missing_id' => 'O ID do registro não foi fornecido',
        'missing_model' => 'Formulário utilizado na classe :class não tem um model definido.',
        'missing_definition' => 'Formulário não contém um campo ":field".',
        'not_found' => 'Nenhum registro encontrado com o ID :id',
        'action_confirm' => 'Você tem certeza?',
        'create' => 'Criar',
        'create_and_close' => 'Criar e sair',
        'creating' => 'Criando...',
        'creating_name' => 'Criando :name...',
        'save' => 'Salvar',
        'save_and_close' => 'Salvar e fechar',
        'saving' => 'Salvando...',
        'saving_name' => 'Salvando :name...',
        'delete' => 'Apagar',
        'deleting' => 'Apagando...',
        'confirm_delete' => 'Você realmente deseja apagar este registro?',
        'confirm_delete_multiple' => 'Você realmente deseja apagar os registros selecionados?',
        'deleting_name' => 'Apagando :name...',
        'reset_default' => 'Redefinir para o padrão',
        'resetting' => 'Redefinindo',
        'resetting_name' => 'Redefinindo :name',
        'undefined_tab' => 'Outros',
        'field_off' => 'Desl',
        'field_on' => 'Lig',
        'add' => 'Adicionar',
        'apply' => 'Aplicar',
        'cancel' => 'Cancelar',
        'close' => 'Fechar',
        'confirm' => 'Confirmar',
        'reload' => 'Recarregar',
        'complete' => 'Concluído',
        'ok' => 'Ok',
        'or' => 'ou',
        'confirm_tab_close' => 'Tem certeza que deseja fechar essa aba? As alterações que não foram salvas serão perdidas',
        'behavior_not_ready' => 'O formulário não foi inicializado. Confira se você chamou initForm() no controller.',
        'preview_no_files_message' => 'Os arquivos não foram carregados',
        'preview_no_record_message' => 'Nenhum registro selecionado.',
        'select' => 'Selecionar',
        'select_all' => 'todos',
        'select_none' => 'nenhum',
        'select_placeholder' => 'por favor, selecione',
        'insert_row' => 'Inserir linha',
        'insert_row_below' => 'Inserir linha abaixo',
        'delete_row' => 'Excluir linha',
        'concurrency_file_changed_title' => 'O arquivo foi alterado',
        'concurrency_file_changed_description' => 'O arquivo que você está editando foi alterado em disco. Você pode recarregá-lo e perder suas alterações ou sobrescrever o arquivo do disco.',
        'return_to_list' => 'Retornar à lista',
    ],
    'recordfinder' => [
        'find_record' => 'Localizar Registro'
    ],
    'relation' => [
        'missing_config' => 'Comportamento relation não tem uma configuração para ":config".',
        'missing_definition' => 'Comportamento relation não contém uma definição para ":field".',
        'missing_model' => 'Comportamento relation utilizado na classe :class não possui um model definido.',
        'invalid_action_single' => 'Essa ação não pode ser realizada num relacionamento singular.',
        'invalid_action_multi' => 'Essa ação não pode ser realizada num relacionamento múltiplo.',
        'help' => 'Clique em um item para adicionar',
        'related_data' => 'Dados de :name relacionado',
        'add' => 'Adicionar',
        'add_selected' => 'Adicionar seleção',
        'add_a_new' => 'Adicionar um(a) novo(a) :name',
        'link_selected' => 'Vincular selecionado',
        'link_a_new' => 'Vincular um novo :name',
        'cancel' => 'Cancelar',
        'close' => 'Fechar',
        'add_name' => 'Adicionar :name',
        'create' => 'Criar',
        'create_name' => 'Criar :name',
        'update' => 'Atualizar',
        'update_name' => 'Atualizar :name',
        'preview' => 'Visualizar',
        'preview_name' => 'Visualizar :name',
        'remove' => 'Remover',
        'remove_name' => 'Remover :name',
        'delete' => 'Excluir',
        'delete_name' => 'Excluir :name',
        'delete_confirm' => 'Você tem certeza?',
        'link' => 'Vincular',
        'link_name' => 'Vincular :name',
        'unlink' => 'Desvincular',
        'unlink_name' => 'Desvincular :name',
        'unlink_confirm' => 'Você tem certeza?',
    ],
    'reorder' => [
        'default_title' => 'Reordenar registros',
        'no_records' => 'Não há registros disponíveis para ordenar.',
    ],
    'model' => [
        'name' => 'Model',
        'not_found' => 'Model ":class" com ID :id não foi encontrado',
        'missing_id' => 'ID do registro não especificado.',
        'missing_relation' => 'Model ":class" não contém uma definição para o relacionamento ":relation".',
        'missing_method' => 'Model ":class" não contém o método ":method".',
        'invalid_class' => 'Model :model utilizado na classe :class não é válido. É necessário herdar a classe \Model.',
        'mass_assignment_failed' => 'Falha na atribuição em massa do atributo ":attribute" do Model.',
    ],
    'warnings' => [
        'tips' => 'Dicas de configuração do sistema',
        'tips_description' => 'Há itens que demandam atenção para configurar o sistema corretamente.',
        'permissions'  => 'Diretório :name ou seus subdiretórios não são graváveis pelo PHP. Por favor, defina permissões de escrita para o servidor neste diretório.',
        'extension' => 'A extensão PHP :name não está instalada. Por favor, instale esta biblioteca para ativar a extensão.',
    ],
    'editor' => [
        'menu_label' => 'Definições do Editor',
        'menu_description' => 'Gerenciar configurações do editor.',
        'font_size' => 'Tamanho da fonte',
        'tab_size' => 'Tamanho do espaçamento',
        'use_hard_tabs' => 'Recuo usando guias',
        'code_folding_begin' => 'Marca de início',
        'code_folding_begin_end' => 'Marca de início e fim',
        'autocompletion' => 'Autocompletar',
        'code_folding' => 'Código flexível',
        'word_wrap' => 'Quebra de linha',
        'highlight_active_line' => 'Destaque na linha ativa',
        'auto_closing' => 'Auto completar tags e caracteres especiais',
        'show_invisibles' => 'Mostrar caracteres invisíveis',
        'basic_autocompletion'=> 'Autocompletar básico (Ctrl + Espaço)',
        'live_autocompletion'=> 'Autocompletar em tempo real',
        'enable_snippets'=> 'Habilitar trechos de códigos (Tab)',
        'display_indent_guides'=> 'Exibir guias de indentação',
        'show_print_margin'=> 'Exibir margem de impressão',
        'mode_off' => 'Desligado',
        'mode_fluid' => 'Fluido',
        '40_characters' => '40 caracteres',
        '80_characters' => '80 caracteres',
        'show_gutter' => 'Mostrar numeração de linhas',
        'markup_styles' => 'Estilos de marcação',
        'custom_styles' => 'Folha de estilo personalizada',
        'custom styles_comment' => 'Estilos personalizados para incluir no editor HTML.',
        'markup_classes' => 'Classes de marcação',
        'paragraph' => 'Parágrafo',
        'link' => 'Link',
        'table' => 'Tabela',
        'table_cell' => 'Célula de tabela',
        'image' => 'Imagem',
        'label' => 'Rótulo',
        'class_name' => 'Nome da classe',
        'markup_tags' => 'Etiquetas de marcação',
        'allowed_empty_tags' => 'Permitir etiquetas vazias',
        'allowed_empty_tags_comment' => 'A lista de etiquetas não é removida quando não há conteúdo.',
        'allowed_tags' => 'Etiquetas permitidas',
        'allowed_tags_comment' => 'Lista de etiquetas permitidas.',
        'no_wrap' => 'Não agrupe as etiquetas',
        'no_wrap_comment' => 'Lista de etiquetas que não devem ser agrupadas.',
        'remove_tags' => 'Excluir etiqueta',
        'remove_tags_comment' => 'Lista de etiquetas que serão exclídas juntas com seu conteúdo.',
        'theme' => 'Esquema de cores',
    ],
    'tooltips' => [
        'preview_website' => 'Visualizar a página'
    ],
    'mysettings' => [
        'menu_label' => 'Minhas Configurações',
        'menu_description' => 'Configurações relacionadas à sua conta de administrador',
    ],
    'myaccount' => [
        'menu_label' => 'Minha Conta',
        'menu_description' => 'Atualizar detalhes da sua conta, como nome, e-mail e senha.',
        'menu_keywords' => 'login de segurança'
    ],
    'branding' => [
        'menu_label' => 'Personalização',
        'menu_description' => 'Personalizar detalhes da área administrativa, tais como título, cores e logo.',
        'brand' => 'Marca',
        'logo' => 'Logo',
        'logo_description' => 'Fazer upload de uma logo para usar na área administrativa.',
        'app_name' => 'Nome do Aplicativo',
        'app_name_description' => 'Este nome é mostrado no título da área administrativa.',
        'app_tagline' => 'Slogan do Aplicativo',
        'app_tagline_description' => 'Esta frase é mostrada na tela de login administrativo.',
        'colors' => 'Cores',
        'primary_color' => 'Cor primária',
        'secondary_color' => 'Cor secundária',
        'accent_color' => 'Accent color',
        'styles' => 'Estilos',
        'custom_stylesheet' => 'CSS customizado',
        'navigation' => 'Navegação',
        'menu_mode' => 'Estilo de menu',
        'menu_mode_inline' => 'Em linha',
        'menu_mode_tile' => 'Blocos',
        'menu_mode_collapsed' => 'Colapsados'
    ],
    'backend_preferences' => [
        'menu_label' => 'Preferências da Administração',
        'menu_description' => 'Gerenciar idiomas e aparência da administração.',
        'region' => 'Região',
        'code_editor' => 'Editor de código',
        'timezone' => 'Fuso horário',
        'timezone_comment' => 'Ajustar datas exibidas para este Fuso horário.',
        'locale' => 'Idioma',
        'locale_comment' => 'Selecione o idioma de sua preferência.',
    ],
    'access_log' => [
        'hint' => 'Este registro mostra a lista de acessos dos administradores. Os registros são mantidos por um período de :days dias.',
        'menu_label' => 'Registro de Acesso',
        'menu_description' => 'Veja a lista de acessos à administração.',
        'created_at' => 'Data & Hora',
        'login' => 'Login',
        'ip_address' => 'Endereço IP',
        'first_name' => 'Nome',
        'last_name' => 'Sobrenome',
        'email' => 'E-mail',
    ],
    'filter' => [
        'all' => 'todos',
        'options_method_not_exists' => "A classe modelo :model deve definir um método :method() retornando opções para o filtro ':filter'.",
        'date_all' => 'todo o período'
    ],
    'import_export' => [
        'upload_csv_file' => '1. Enviar arquivo CSV',
        'import_file' => 'Importar arquivo',
        'first_row_contains_titles' => 'Primeira linha contém títulos das colunas',
        'first_row_contains_titles_desc' => 'Deixe marcado se primeira linha do CSV é utilizada como títulos das colunas.',
        'match_columns' => '2. Associar as colunas do arquivo a campos do banco de dados',
        'file_columns' => 'Colunas do arquivo',
        'database_fields' => 'Campos do banco de dados',
        'set_import_options' => '3. Definir opções de importação',
        'export_output_format' => '1. Formato de saída da exportação',
        'file_format' => 'Formato do arquivo',
        'standard_format' => 'Formato padrão',
        'custom_format' => 'Formato personalizado',
        'delimiter_char' => 'Caracter delimitador',
        'enclosure_char' => 'Caracter qualificador',
        'escape_char' => 'Caracter de escape',
        'select_columns' => '2. Selecione colunas para exportar',
        'column' => 'Coluna',
        'columns' => 'Colunas',
        'set_export_options' => '3. Definir opções de exportação',
        'show_ignored_columns' => 'Mostrar colunas ignoradas',
        'auto_match_columns' => 'Auto associar colunas',
        'created' => 'Criados',
        'updated' => 'Atualizados',
        'skipped' => 'Ignorados',
        'warnings' => 'Alertas',
        'errors' => 'Erros',
        'skipped_rows' => 'Registros Ignorados',
        'import_progress' => 'Progresso da Importação',
        'processing' => 'Processando',
        'import_error' => 'Erro de importação',
        'upload_valid_csv' => 'Por favor envie um arquivo CSV válido.',
        'drop_column_here' => 'Soltar coluna aqui...',
        'ignore_this_column' => 'Ignorar esta coluna',
        'processing_successful_line1' => 'Processo de exportação de arquivo concluído com sucesso!',
        'processing_successful_line2' => 'O navegador agora deve redirecionar automaticamente para o download do arquivo.',
        'export_progress' => 'Progresso da exportação',
        'export_error' => 'Erro de exportação',
        'column_preview' => 'Pré-visualizar coluna',
        'file_not_found_error' => 'Arquivo não encontrado',
        'empty_error' => 'Não havia dados fornecidos para exportar',
        'empty_import_columns_error' => 'Por favor, especifique algumas colunas para importar.',
        'match_some_column_error' => 'Por favor, combine algumas colunas primeiro.',
        'required_match_column_error' => 'Por favor, especifique a combinação para o campo requerido :label.',
        'empty_export_columns_error' => 'Por favor, especifique algumas colunas para exportar.',
        'behavior_missing_uselist_error' => 'Você deve implementar o comportamento do controlador ListController com a opção de exportação "useList" habilitada.',
        'missing_model_class_error' => 'Por favor, especifique a propriedade modelo de classe para :type',
        'missing_column_id_error' => 'Identificador de coluna ausente',
        'unknown_column_error' => 'Coluna desconhecida',
        'encoding_not_supported_error' => 'Codificação do arquivo fonte desconhecida. Por favor, selecione a opção "Formato personalizado", com a devida codificação, para importar o arquivo.',
        'encoding_format' => 'Codificação do arquivo',
        'encodings' => [
            'utf_8' => 'UTF-8',
            'us_ascii' => 'US-ASCII',
            'iso_8859_1' => 'ISO-8859-1 (Latin-1, Western European)',
            'iso_8859_2' => 'ISO-8859-2 (Latin-2, Central European)',
            'iso_8859_3' => 'ISO-8859-3 (Latin-3, South European)',
            'iso_8859_4' => 'ISO-8859-4 (Latin-4, North European)',
            'iso_8859_5' => 'ISO-8859-5 (Latin, Cyrillic)',
            'iso_8859_6' => 'ISO-8859-6 (Latin, Arabic)',
            'iso_8859_7' => 'ISO-8859-7 (Latin, Greek)',
            'iso_8859_8' => 'ISO-8859-8 (Latin, Hebrew)',
            'iso_8859_0' => 'ISO-8859-9 (Latin-5, Turkish)',
            'iso_8859_10' => 'ISO-8859-10 (Latin-6, Nordic)',
            'iso_8859_11' => 'ISO-8859-11 (Latin, Thai)',
            'iso_8859_13' => 'ISO-8859-13 (Latin-7, Baltic Rim)',
            'iso_8859_14' => 'ISO-8859-14 (Latin-8, Celtic)',
            'iso_8859_15' => 'ISO-8859-15 (Latin-9, Western European revision with euro sign)',
            'windows_1251' => 'Windows-1251 (CP1251)',
            'windows_1252' => 'Windows-1252 (CP1252)'
        ]
    ],
    'permissions' => [
        'manage_media' => 'Gerenciar mídias'
    ],
    'mediafinder' => [
        'default_prompt' => 'Clique no botão %s para localizar um arquivo de mídia'
    ],
    'media' => [
        'menu_label' => 'Mídias',
        'upload' => 'Enviar',
        'move' => 'Mover',
        'delete' => 'Excluir',
        'add_folder' => 'Adicionar pasta',
        'search' => 'Buscar',
        'display' => 'Exibir',
        'filter_everything' => 'Tudo',
        'filter_images' => 'Imagens',
        'filter_video' => 'Vídeos',
        'filter_audio' => 'Áudios',
        'filter_documents' => 'Documentos',
        'library' => 'Biblioteca',
        'size' => 'Tamanho',
        'title' => 'Título',
        'last_modified' => 'Última modificação',
        'public_url' => 'URL pública',
        'click_here' => 'Clique aqui',
        'thumbnail_error' => 'Erro ao gerar a miniatura.',
        'return_to_parent' => 'Retornar ao diretório anterior',
        'return_to_parent_label' => 'Vá para ..',
        'nothing_selected' => 'Nenhum item selecionado.',
        'multiple_selected' => 'Múltiplos itens selecionados.',
        'uploading_file_num' => 'Enviando :number arquivo(s)...',
        'uploading_complete' => 'Envio finalizado',
        'uploading_error' => 'Falha no envio',
        'type_blocked' => 'O tipo de arquivo utilizado é bloqueado por motivos de segurança.',
        'order_by' => 'Ordenar por',
        'folder' => 'Pasta',
        'no_files_found' => 'Nenhum arquivo encontrado.',
        'delete_empty' => 'Por favor, selecione um item para excluir.',
        'delete_confirm' => 'Você deseja mesmo excluir o(s) arquivo(s) selecionado(s)?',
        'error_renaming_file' => 'Erro ao renomear o arquivo.',
        'new_folder_title' => 'Nova pasta',
        'folder_name' => 'Nome da pasta',
        'error_creating_folder' => 'Erro ao criar a pasta',
        'folder_or_file_exist' => 'Uma pasta ou arquivo já existe com o nome especificado.',
        'move_empty' => 'Por favor, selecione um item para mover.',
        'move_popup_title' => 'Mover arquivos ou pastas',
        'move_destination' => 'Pasta destino',
        'please_select_move_dest' => 'Por favor, selecione a pasta destino.',
        'move_dest_src_match' => 'Por favor, selecione outra pasta destino.',
        'empty_library' => 'A biblioteca de mídias está vazia. Envie arquivos ou crie pastas para iniciar.',
        'insert' => 'Inserir',
        'crop_and_insert' => 'Cortar & Inserir',
        'select_single_image' => 'Por favor, selecione uma única imagem.',
        'selection_not_image' => 'O arquivo selecionado não é uma imagem.',
        'restore' => 'Desfazer todas as alterações',
        'resize' => 'Redimensionar...',
        'selection_mode_normal' => 'Normal',
        'selection_mode_fixed_ratio' => 'Proporção fixa',
        'selection_mode_fixed_size' => 'Tamanho fixo',
        'height' => 'Altura',
        'width' => 'Largura',
        'selection_mode' => 'Modo de seleção',
        'resize_image' => 'Redimensionar imagem',
        'image_size' => 'Tamanho da imagem:',
        'selected_size' => 'Selecionado:'
    ]
];
