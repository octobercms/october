<?php

return [
    'app' => [
        'name' => 'October CMS',
        'motto' => 'Voltando ao básico',
    ],
    'directory' => [
        'create_fail' => "Não é possível criar o diretório: :name",
    ],
    'file' => [
        'create_fail' => "Não é possível criar o arquivo: :name",
    ],
    'system' => [
        'name' => 'Sistema',
        'menu_label' => 'Sistema',
    ],
    'plugin' => [
        'unnamed' => 'Plugin não nomeado',
        'name' => [
            'label' => 'Nome do Plugin',
            'help' => 'Nome do plugin pelo seu código único. Por exemplo, RainLab.Blog',
        ],
    ],
    'plugins' => [
        'manage' => 'Gerenciar plugins',
        'enable_or_disable' => 'Habilitar ou desabilitar',
        'enable_or_disable_title' => 'Habilitar ou Desabilitar Plugins',
        'remove' => 'Remover',
        'refresh' => 'Atualizar',
        'disabled_label' => 'Desabilitado',
        'disabled_help' => 'Plugins que estão desabilitados são ignorados pela aplicação.',
        'selected_amount' => 'Plugins selecionados: :amount',
        'remove_success' => "Plugins removidos com sucesso do sistema.",
        'refresh_success' => "Plugins atualizados com sucesso.",
        'disable_success' => "Plugins desabilitados com sucesso.",
        'enable_success' => "Plugins habilitados com sucesso.",
    ],
    'project' => [
        'name' => 'Projeto',
        'owner_label' => 'Dono',
        'attach' => 'Anexar Projeto',
        'detach' => 'Desanexar Projeto',
        'none' => 'Nenhum',
        'id' => [
            'label' => 'ID do Projeto',
            'help' => 'Como encontrar o ID do seu projeto?',
            'missing' => 'Por favor, especifique um ID de Projeto para usar.',
        ],
        'detach_confirm' => 'Tem certeza de que deseja desanexar este projeto?',
        'unbind_success' => 'Projeto desanexado com sucesso.',
    ],
    'settings' => [
        'menu_label' => 'Configurações',
        'missing_model' => 'A página de configurações está faltando uma definição de modelo.',
        'update_success' => 'Configurações para :name foram atualizados com sucesso.',
        'return' => 'Retornar para as configurações do sistema',
    ],
    'email' => [
        'menu_label' => 'Configurações de E-mail',
        'menu_description' => 'Gerenciar configurações de e-mail.',
        'general' => 'Geral',
        'method' => 'Método de Envio',
        'sender_name' => 'Nome do Remetente',
        'sender_email' => 'E-mail do Remetente',
        'smtp' => 'SMTP',
        'smtp_address' => 'Endereço SMTP',
        'smtp_authorization' => 'Autenticação SMTP obrigatória',
        'smtp_authorization_comment' => 'Use esta opção se o seu servidor SMTP requer autenticação.',
        'smtp_username' => 'Usuário',
        'smtp_password' => 'Senha',
        'smtp_port' => 'Porta SMTP',
        'smtp_ssl' => 'Conexão SSL obrigatória',
        'sendmail' => 'Sendmail',
        'sendmail_path' => 'Caminho do Sendmail',
        'sendmail_path_comment' => 'Por favor, especifique o caminho do programa sendmail.',
    ],
    'mail_templates' => [
        'menu_label' => 'Modelos de E-mail',
        'menu_description' => 'Modificar os modelos de e-mail que são enviados para usuários e administradores.',
        'new_template' => 'Novo modelo',
        'new_layout' => 'Novo layout',
        'template' => 'Modelo',
        'templates' => 'Modelos',
        'menu_layouts_label' => 'Layouts de E-mail',
        'layout' => 'Layout',
        'layouts' => 'Layouts',
        'name' => 'Nome',
        'name_comment' => 'Nome exclusivo usado para se referir à este modelo',
        'code' => 'Código',
        'code_comment' => 'Código único usado para se referir à este modelo',
        'subject' => 'Assunto',
        'subject_comment' => 'Assunto da mensagem',
        'description' => 'Descrição',
        'content_html' => 'HTML',
        'content_css' => 'CSS',
        'content_text' => 'Texto Simples',
    ],
    'install' => [
        'project_label' => 'Anexar ao projeto',
        'plugin_label' => 'Instalar plugin',
        'missing_plugin_name' => 'Por favor, especifique um nome de plugin para instalar.',
        'install_completing' => 'Finalizando processo de instalação.',
        'install_success' => 'O plugin foi instalado com sucesso.',
    ],
    'updates' => [
        'title' => 'Gerenciar Atualizações',
        'name' => 'Atualização de software',
        'menu_label' => 'Atualizações',
        'check_label' => 'Verificar atualizações',
        'retry_label' => 'Tentar novamente',
        'plugin_name' => 'Nome',
        'plugin_description' => 'Descrição',
        'plugin_version' => 'Versão',
        'plugin_author' => 'Autor',
        'core_build' => 'Compilação atual',
        'core_build_old' => 'Compilação atual :build',
        'core_build_new' => 'Compilação :build',
        'core_build_new_help' => 'Última versão está disponível.',
        'core_downloading' => 'Baixando arquivos do aplicativo',
        'core_extracting' => 'Desempacotando arquivos de aplicativos',
        'plugin_downloading' => 'Baixando plugin: :name',
        'plugin_extracting' => 'Desempacotando plugin: :name',
        'plugin_version_none' => 'Novo plugin',
        'plugin_version_old' => 'Atual v:version',
        'plugin_version_new' => 'v:version',
        'update_label' => 'Atualizar o software',
        'update_completing' => 'Finalizando processo de atualização',
        'update_loading' => 'Carregando atualizações disponíveis...',
        'update_success' => 'O processo de atualização foi realizada com sucesso.',
        'update_failed_label' => 'Falha na atualização',
        'force_label' => 'Forçar atualização',
        'found' => [
            'label' => 'Encontrado novas atualizações!',
            'help' => 'Clique Atualizar o software para iniciar o processo de atualização.',
        ],
        'none' => [
            'label' => 'Não há atualizações',
            'help' => 'Não há novas atualizações.',
        ],
    ],
    'server' => [
        'connect_error' => 'Erro ao conectar-se ao servidor.',
        'response_not_found' => 'O servidor de atualização não pôde ser encontrado.',
        'response_invalid' => 'Resposta inválida do servidor.',
        'response_empty' => 'Resposta vazia a partir do servidor.',
        'file_error' => 'Servidor não conseguiu entregar o pacote.',
        'file_corrupt' => 'Arquivo do servidor está corrompido.',
    ],
    'behavior' => [
        'missing_property' => 'Classe :class deve definir a $:property imóvel usado por:behavior  comportamento.',
    ],
    'config' => [
        'not_found' => 'Não foi possível localizar arquivos de configuração :file definido para :location.',
        'required' => 'Configuração usada em :location deve fornecer um valor :property.',
    ],
    'zip' => [
        'extract_failed' => "Não foi possível extrair arquivo core ':file'.",
    ],
];
