<?php namespace Database\Tester\Models;

use Model;

class Category extends Model
{
    /**
     * @var string The database table used by the model.
     */
    public $table = 'database_tester_categories';
}


class CategorySimple extends Category
{
    use \October\Rain\Database\Traits\SimpleTree;
}

class CategoryNested extends Category
{
    use \October\Rain\Database\Traits\NestedTree;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'database_tester_categories_nested';
}