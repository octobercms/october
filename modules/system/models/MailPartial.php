<?php namespace System\Models;

use Twig;
use File;
use View;
use Model;
use Markdown;
use System\Classes\MailManager;
use October\Rain\Mail\MailParser;
use ApplicationException;

/**
 * Mail partial
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailPartial extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_mail_partials';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Validation rules
     */
    public $rules = [
        'code'                  => 'required|unique:system_mail_partials',
        'name'                  => 'required',
        'content_html'          => 'required',
    ];

    /**
     * Loops over each mail layout and ensures the system has a layout,
     * if the layout does not exist, it will create one.
     * @return void
     */
    public static function createPartials()
    {
        $dbPartials = self::lists('code', 'code');

        $definitions = MailManager::instance()->listRegisteredPartials();
        foreach ($definitions as $code => $path) {
            if (array_key_exists($code, $dbPartials)) {
                continue;
            }

            self::createPartialFromFile($code, $path);
        }
    }

    /**
     * Creates a layout using the contents of a specified file.
     * @param  string $code  New Partial code
     * @param  string $viewPath  View path
     * @return void
     */
    public static function createPartialFromFile($code, $viewPath)
    {
        $sections = self::getTemplateSections($viewPath);

        $name = array_get($sections, 'settings.name', '???');

        self::create([
            'name'         => $name,
            'code'         => $code,
            'is_custom'    => 0,
            'content_html' => array_get($sections, 'html'),
            'content_text' => array_get($sections, 'text')
        ]);
    }

    protected static function getTemplateSections($code)
    {
        return MailParser::parse(File::get(View::make($code)->getPath()));
    }
}
