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

    'accepted'             => ':attribute deve ser aceito.',
    'active_url'           => ':attribute não é uma URL válida.',
    'after'                => ':attribute deve ser uma data posterior a :date.',
    'after_or_equal'       => ':attribute deve ser uma data posterior ou igual a :date.',
    'alpha'                => ':attribute só pode conter letras.',
    'alpha_dash'           => ':attribute só pode conter letras, números e traços.',
    'alpha_num'            => ':attribute só pode conter letras e números.',
    'array'                => ':attribute deve ser uma matriz.',
    'before'               => ':attribute deve ser uma data anterior :date.',
    'before_or_equal'      => ':attribute deve ser uma data anterior ou igual a :date.',
    'between'              => [
        'numeric' => ':attribute deve ser entre :min e :max.',
        'file'    => ':attribute deve ser entre :min e :max kilobytes.',
        'string'  => ':attribute deve ser entre :min e :max caracteres.',
        'array'   => ':attribute deve ter entre :min e :max itens.',
    ],
    'boolean'              => ':attribute deve ser verdadeiro ou falso.',
    'confirmed'            => ':attribute de confirmação não confere.',
    'date'                 => ':attribute não é uma data válida.',
    'date_equals'          => ':attribute deve ser uma data igual a :date.',
    'date_format'          => ':attribute não corresponde ao formato :format.',
    'different'            => ':attribute e :other devem ser diferentes.',
    'digits'               => ':attribute deve ter :digits dígitos.',
    'digits_between'       => ':attribute deve ter entre :min e :max dígitos.',
    'dimensions'           => ':attribute tem dimensões de imagem inválidas.',
    'distinct'             => ':attribute campo tem um valor duplicado.',
    'email'                => ':attribute deve ser um endereço de e-mail válido.',
    'ends_with'            => ':attribute deve terminar com um dos seguintes: :values',
    'exists'               => ':attribute selecionado é inválido.',
    'file'                 => ':attribute deve ser um arquivo.',
    'filled'               => ':attribute deve ter um valor.',
    'gt' => [
        'numeric' => ':attribute deve ser maior que :value.',
        'file'    => ':attribute deve ser maior que :value kilobytes.',
        'string'  => ':attribute deve ser maior que :value caracteres.',
        'array'   => ':attribute deve conter mais de :value itens.',
    ],
    'gte' => [
        'numeric' => ':attribute deve ser maior ou igual a :value.',
        'file'    => ':attribute deve ser maior ou igual a :value kilobytes.',
        'string'  => ':attribute deve ser maior ou igual a :value caracteres.',
        'array'   => ':attribute deve conter :value itens ou mais.',
    ],
    'image'                => ':attribute deve ser uma imagem.',
    'in'                   => ':attribute selecionado é inválido.',
    'in_array'             => ':attribute não existe em :other.',
    'integer'              => ':attribute deve ser um número inteiro.',
    'ip'                   => ':attribute deve ser um endereço de IP válido.',
    'ipv4'                 => ':attribute deve ser um endereço IPv4 válido.',
    'ipv6'                 => ':attribute deve ser um endereço IPv6 válido.',
    'json'                 => ':attribute deve ser uma string JSON válida.',
    'lt' => [
        'numeric' => ':attribute deve ser menor que :value.',
        'file'    => ':attribute deve ser menor que :value kilobytes.',
        'string'  => ':attribute deve ser menor que :value caracteres.',
        'array'   => ':attribute deve conter menos de :value itens.',
    ],
    'lte' => [
        'numeric' => ':attribute deve ser menor ou igual a :value.',
        'file'    => ':attribute deve ser menor ou igual a :value kilobytes.',
        'string'  => ':attribute deve ser menor ou igual a :value caracteres.',
        'array'   => ':attribute não deve conter mais que :value itens.',
    ],
    'max' => [
        'numeric' => ':attribute não pode ser superior a :max.',
        'file'    => ':attribute não pode ser superior a :max kilobytes.',
        'string'  => ':attribute não pode ser superior a :max caracteres.',
        'array'   => ':attribute não pode ter mais do que :max itens.',
    ],
    'mimes'                => ':attribute deve ser um arquivo do tipo: :values.',
    'mimetypes'            => ':attribute deve ser um arquivo do tipo: :values.',
    'min' => [
        'numeric' => ':attribute deve ser pelo menos :min.',
        'file'    => ':attribute deve ter pelo menos :min kilobytes.',
        'string'  => ':attribute deve ter pelo menos :min caracteres.',
        'array'   => ':attribute deve ter pelo menos :min itens.',
    ],
    'not_in'               => ':attribute selecionado é inválido.',
    'not_regex'            => ':attribute possui um formato inválido.',
    'numeric'              => ':attribute deve ser um número.',
    'password'             => 'A senha está incorreta.',
    'present'              => ':attribute deve estar presente.',
    'regex'                => ':attribute tem um formato inválido.',
    'required'             => ':attribute é obrigatório.',
    'required_if'          => ':attribute é obrigatório quando :other for :value.',
    'required_unless'      => ':attribute é obrigatório exceto quando :other for :values.',
    'required_with'        => ':attribute é obrigatório quando :values está presente.',
    'required_with_all'    => ':attribute é obrigatório quando :values está presente.',
    'required_without'     => ':attribute é obrigatório quando :values não está presente.',
    'required_without_all' => ':attribute é obrigatório quando nenhum dos :values estão presentes.',
    'same'                 => ':attribute e :other devem corresponder.',
    'size'                 => [
        'numeric' => ':attribute deve ser :size.',
        'file'    => ':attribute deve ser :size kilobytes.',
        'string'  => ':attribute deve ser :size caracteres.',
        'array'   => ':attribute deve conter :size itens.',
    ],
    'starts_with'          => ':attribute deve começar com um dos seguintes valores: :values',
    'string'               => ':attribute deve ser uma string.',
    'timezone'             => ':attribute deve ser uma zona válida.',
    'unique'               => ':attribute já está sendo utilizado.',
    'uploaded'             => 'Ocorreu uma falha no upload do campo :attribute.',
    'url'                  => ':attribute tem um formato inválido.',
    'uuid' => ':attribute deve ser um UUID válido.',

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
