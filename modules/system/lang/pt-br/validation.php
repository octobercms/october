<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | such as the size rules. Feel free to tweak each of these messages.
    |
    */

    'after_or_equal'       => 'O campo :attribute deve ser uma data posterior ou igual a :date.',
    'before_or_equal'      => 'O campo :attribute deve ser uma data anterior ou igual a :date.',
    'accepted'             => ':attribute deve ser aceito.',
    'active_url'           => ':attribute não é uma URL válida.',
    'after'                => ':attribute deve ser uma data após :date.',
    'alpha'                => ':attribute só pode conter letras.',
    'alpha_dash'           => ':attribute só pode conter letras, números e traços.',
    'alpha_num'            => ':attribute só pode conter letras e números.',
    'array'                => ':attribute deve ser uma matriz.',
    'before'               => ':attribute deve ser uma data antes :date.',
    'between'              => [
        'numeric' => ':attribute deve situar-se entre :min e :max.',
        'file'    => ':attribute deve ter entre :min e :max kilobytes.',
        'string'  => ':attribute deve ter entre :min e :max caracteres.',
        'array'   => ':attribute deve ter entre :min e :max itens.',
    ],
    'boolean'              => 'O campo :attribute deve ser verdadeiro ou falso.',
    'dimensions'           => 'O campo :attribute tem dimensões de imagem inválidas.',
    'distinct'             => 'O campo :attribute campo tem um valor duplicado.',
    'file'                 => 'O campo :attribute deve ser um arquivo.',
    'filled'               => 'O campo :attribute deve ter um valor.',
    'in_array'             => 'O campo :attribute não existe em :other.',
    'ipv4'                 => 'O campo :attribute deve ser um endereço IPv4 válido.',
    'ipv6'                 => 'O campo :attribute deve ser um endereço IPv6 válido.',
    'json'                 => 'O campo :attribute deve ser uma string JSON válida.',
    'confirmed'            => 'A confirmação de :attribute não corresponde.',
    'date'                 => ':attribute não é uma data válida.',
    'date_format'          => ':attribute não coincide com o formato :format.',
    'different'            => ':attribute e :other devem ser diferentes.',
    'digits'               => ':attribute deve ser :digits dígitos.',
    'digits_between'       => ':attribute deve ter entre :min e :max dígitos.',
    'email'                => 'Formato de :attribute é inválido.',
    'exists'               => ':attribute selecionado é inválido.',
    'image'                => ':attribute deve ser uma imagem.',
    'in'                   => ':attribute selecionado é inválido.',
    'integer'              => ':attribute deve ser um número inteiro.',
    'ip'                   => ':attribute deve ser um endereço IP válido.',
    'max'                  => [
        'numeric' => ':attribute não pode ser maior do que :max.',
        'file'    => ':attribute não pode ser maior do que :max kilobytes.',
        'string'  => ':attribute não pode ser maior do que :max caracteres.',
        'array'   => ':attribute não pode ter mais que :max itens.',
    ],
    'mimes'                => ':attribute deve ser um arquivo do tipo: :values.',
    'extensions'           => 'O :attribute deve conter uma extensão: :values.',
    'mimetypes'            => 'O campo :attribute deve ser um arquivo do tipo: :values.',
    'min'                  => [
        'numeric' => ':attribute deve ser no mínimo :min.',
        'file'    => ':attribute deve ter pelo menos :min kilobytes.',
        'string'  => ':attribute deve ter pelo menos :min caracteres.',
        'array'   => ':attribute deve ter pelo menos :min itens.',
    ],
    'present'              => 'O campo :attribute deve estar presente.',
    'required_unless'      => 'O campo :attribute é obrigatório exceto quando :other for :values.',
    'required_with_all'    => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_without_all' => 'O campo :attribute é obrigatório quando nenhum dos :values estão presentes.',
    'not_in'               => ':attribute selecionado é inválido.',
    'numeric'              => ':attribute deve ser um número.',
    'regex'                => 'Formato de :attribute é inválido.',
    'required'             => 'O campo :attribute é obrigatório.',
    'required_if'          => 'O campo :attribute é obrigatório quando :other é :value.',
    'required_with'        => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_without'     => 'O campo :attribute é obrigatório quando :values não está presente.',
    'same'                 => 'O campo :attribute e :other devem corresponder.',
    'size'                 => [
        'numeric' => ':attribute deve ser :size.',
        'file'    => ':attribute deve ser :size kilobytes.',
        'string'  => ':attribute deve ter :size caracteres.',
        'array'   => ':attribute deve conter :size itens.',
    ],
    'string'               => 'O campo :attribute deve ser uma string.',
    'timezone'             => 'O campo :attribute deve ser uma zona válida.',
    'uploaded'             => 'Ocorreu uma falha no upload do campo :attribute.',
    'unique'               => ':attribute já está sendo utilizado.',
    'url'                  => 'Formato de :attribute é inválido.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention 'attribute.rule' to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of 'email'. This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
