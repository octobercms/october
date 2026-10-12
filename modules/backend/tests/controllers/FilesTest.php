<?php

use System\Models\File;
use System\Models\TranslatableFile;
use Backend\Controllers\Files;
use October\Rain\Database\Model;

/**
 * FilesTranslatableModel is a translatable model with protected attachments.
 */
class FilesTranslatableModel extends Model
{
    use \October\Rain\Database\Traits\Translatable;
    use \October\Rain\Database\Traits\TranslatableAttachments;

    public static $activeLocale = 'en';

    public $table = 'files_translatables';

    public $translatable = ['image'];

    public $attachOne = [
        'image' => [File::class, 'public' => false],
        'document' => [TranslatableFile::class, 'public' => false]
    ];

    protected function resolveTranslatableLocale()
    {
        return static::$activeLocale;
    }

    protected function resolveTranslatableDefaultLocale()
    {
        return 'en';
    }
}

/**
 * FilesTest covers locating protected files from their download code.
 */
class FilesTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    public function setUp(): void
    {
        parent::setUp();

        if (!Schema::hasTable('files_translatables')) {
            Schema::create('files_translatables', function ($table) {
                $table->increments('id');
                $table->timestamps();
            });
        }

        FilesTranslatableModel::$activeLocale = 'en';
    }

    public function tearDown(): void
    {
        FilesTranslatableModel::$activeLocale = 'en';

        parent::tearDown();
    }

    /**
     * testLocaleFileIsFoundThroughItsRelation confirms a translated file resolves the relation without its locale suffix
     */
    public function testLocaleFileIsFoundThroughItsRelation()
    {
        $model = new FilesTranslatableModel;
        $model->save();

        FilesTranslatableModel::$activeLocale = 'fr';
        $file = $this->makeFile(File::class);
        FilesTranslatableModel::find($model->id)->image()->add($file);

        $this->assertSame('image:fr', File::find($file->id)->field);
        $this->assertSame($file->id, $this->findFileObject($file)->id);
    }

    /**
     * testFileIsFoundAsItsRelationClass confirms a file is returned as the class its relation declares
     */
    public function testFileIsFoundAsItsRelationClass()
    {
        $model = new FilesTranslatableModel;
        $model->save();

        $file = $this->makeFile(TranslatableFile::class);
        $model->document()->add($file);

        $this->assertInstanceOf(TranslatableFile::class, $this->findFileObject($file));
    }

    /**
     * findFileObject locates a file using its download code
     */
    protected function findFileObject($file)
    {
        return self::callProtectedMethod(new Files, 'findFileObject', [Files::getUniqueCode($file)]);
    }

    /**
     * makeFile returns an unsaved protected file model
     */
    protected function makeFile(string $class)
    {
        $file = new $class;
        $file->file_name = 'manual.pdf';
        $file->disk_name = uniqid() . '.pdf';
        $file->file_size = 0;
        $file->content_type = 'application/pdf';
        $file->is_public = false;

        return $file;
    }
}
