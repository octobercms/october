<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted'             => ':attribute phải được chấp nhận.',
    'active_url'           => ':attribute không phải là URL hợp lệ.',
    'after'                => ':attribute phải là ngày sau :date.',
    'after_or_equal'       => ':attribute phải là một ngày sau hoặc bằng ngày :date.',
    'alpha'                => ':attribute phải là chữ cái.',
    'alpha_dash'           => ':attribute phải là chữ cái, số hoặc dấu gạch ngang.',
    'alpha_num'            => ':attribute phải là chữ cái hoặc số.',
    'array'                => ':attribute phải là mảng.',
    'before'               => ':attribute phải là ngày trước ngày :date.',
    'before_or_equal'      => ':attribute phải là một ngày trước hoặc bằng với ngày :date.',
    'between'              => [
        'numeric' => ':attribute phải lớn hơn :min và nhỏ hơn :max.',
        'file'    => ':attribute  phải lớn hơn :min và nhỏ hơn :max kilobytes.',
        'string'  => ':attribute phải lớn hơn :min và nhỏ hơn :max kí tự.',
        'array'   => ':attribute phải lớn hơn :min và nhỏ hơn :max items.',
    ],
    'boolean'              => 'Trường :attribute phải là giá trị đúng hoặc sai.',
    'confirmed'            => ':attribute không chính xác.',
    'date'                 => ':attribute không phải là ngày.',
    'date_format'          => ':attribute không đúng định dạng với :format.',
    'different'            => ':attribute phải khác :other.',
    'digits'               => ':attribute phải có :digits chữ số.',
    'digits_between'       => ':attribute phải lớn hơn :min và nhỏ hơn :max chữ số.',
    'dimensions'           => ':attribute kích thước không hợp lệ.',
    'distinct'             => 'Trường :attribute bị trùng giá trị.',
    'email'                => ':attribute phải là một email hợp lệ.',
    'exists'               => 'Mục đã chọn :attribute không hợp lệ.',
    'file'                 => ':attribute phải là tệp tin.',
    'filled'               => 'Trường :attribute không được để trống.',
    'image'                => ':attribute phải là hình ảnh.',
    'in'                   => 'Mục đã chọn :attribute không hợp lệ.',
    'in_array'             => 'Trường :attribute không tồn tại trong :other.',
    'integer'              => ':attribute phải là một số nguyên.',
    'ip'                   => ':attribute phải là một địa chỉ IP hợp lệ.',
    'ipv4'                 => ':attribute phải là địa chỉ IPv4 hợp lệ.',
    'ipv6'                 => ':attribute phải là địa chỉ IPv6 hợp lệ.',
    'json'                 => ':attribute phải là chuỗi JSON hợp lệ.',
    'max'                  => [
        'numeric' => ':attribute không được lơn hơn :max.',
        'file'    => ':attribute không được lơn hơn :max kilobytes.',
        'string'  => ':attribute không được lơn hơn :max kí tự.',
        'array'   => ':attribute không được lơn hơn :max items.',
    ],
    'mimes'                => 'Loại file của :attribute phải là: :values.',
    'mimetypes'            => 'Loại file của :attribute phải là: :values.',
    'min'                  => [
        'numeric' => ':attribute phải lớn hơn :min.',
        'file'    => ':attribute phải lớn hơn :min kilobytes.',
        'string'  => ':attribute phải nhiều hơn :min kí tự.',
        'array'   => ':attribute phải có nhiều hơn :min item.',
    ],
    'not_in'               => 'Mục đã chọn :attribute không hợp lệ.',
    'numeric'              => ':attribute phải là số.',
    'present'              => 'Phải có trường :attribute.',
    'regex'                => 'Định dạng của :attribute không hợp lệ.',
    'required'             => 'Trường :attribute là bắt buộc.',
    'required_if'          => 'Trường :attribute là bắt buộc khi :other là :value.',
    'required_unless'      => 'Trường :attribute là bắt buộc trừ khi :other là :values.',
    'required_with'        => 'Trường :attribute là bắt buộc khi có :values.',
    'required_with_all'    => 'Trường :attribute là bắt buộc khi có :values.',
    'required_without'     => 'Trường :attribute là bắt buộc khi không có :values.',
    'required_without_all' => 'Trường :attribute là bắt buộc khi không có :values.',
    'same'                 => ':attribute phải trùng khớp với :other.',
    'size'                 => [
        'numeric' => ':attribute phải có kích thước :size.',
        'file'    => ':attribute phải có kích thước :size kilobytes.',
        'string'  => ':attribute phải có :size kí tự.',
        'array'   => ':attribute phải có :size items.',
    ],
    'string'               => ':attribute phải là chuỗi.',
    'timezone'             => ':attribute phải là múi là hợp lệ.',
    'unique'               => ':attribute đã tồn tại.',
    'uploaded'             => ':attribute bị lỗi khi tải lên.',
    'url'                  => ':attribute sai định dạng.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
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
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
