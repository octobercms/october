<?php

use System\Models\File;
use System\Models\SiteDefinition;
use System\Models\TranslatableFile;
use October\Rain\Database\Model;

/**
 * TranslatableFileHostModel is an untranslated model with a file whose captions are translated.
 */
class TranslatableFileHostModel extends Model
{
    public $table = 'translatable_file_hosts';

    public $attachOne = [
        'document' => TranslatableFile::class,
        'manual' => File::class
    ];
}

/**
 * TranslatableFileTest covers translated titles and descriptions of file attachments.
 */
class TranslatableFileTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * @var SiteDefinition site using the French locale
     */
    protected $site;

    public function setUp(): void
    {
        parent::setUp();

        if (!Schema::hasTable('translatable_file_hosts')) {
            Schema::create('translatable_file_hosts', function ($table) {
                $table->increments('id');
                $table->timestamps();
            });
        }

        $this->site = $this->makeSite('fr');
    }

    public function tearDown(): void
    {
        Site::resetCache();

        parent::tearDown();
    }

    /**
     * testCaptionsAreTranslatedPerLocale confirms a locale stores its own title and description
     */
    public function testCaptionsAreTranslatedPerLocale()
    {
        $host = $this->makeHost();

        Site::withContext($this->site->id, function () use ($host) {
            $file = TranslatableFileHostModel::find($host->id)->document;
            $this->assertInstanceOf(TranslatableFile::class, $file);
            $this->assertSame('Manual', $file->title);

            $file->title = 'Guide';
            $file->description = 'Le guide';
            $file->save();

            $this->assertSame('Guide', TranslatableFileHostModel::find($host->id)->document->title);
        });

        $file = TranslatableFileHostModel::find($host->id)->document;
        $this->assertSame('Manual', $file->title);
        $this->assertSame('The manual', $file->description);
        $this->assertSame('Guide', $file->getTranslation('title', 'fr'));
    }

    /**
     * testFileRelationsStayUntranslated confirms only relations declaring the class translate their captions
     */
    public function testFileRelationsStayUntranslated()
    {
        $host = $this->makeHost();
        $host->manual()->add($this->makeFile(File::class));

        $this->assertNotInstanceOf(TranslatableFile::class, TranslatableFileHostModel::find($host->id)->manual);
    }

    /**
     * testDeletingFileRemovesTranslations confirms translated captions are deleted with the file
     */
    public function testDeletingFileRemovesTranslations()
    {
        $file = $this->makeHost()->document;
        $file->setTranslation('title', 'fr', 'Guide');
        $file->save();

        $query = Db::table('system_translate_attributes')
            ->where('model_type', TranslatableFile::class)
            ->where('model_id', $file->id);

        $this->assertSame(1, $query->count());

        $file->delete();

        $this->assertSame(0, $query->count());
    }

    /**
     * makeHost creates a host model with a captioned document
     */
    protected function makeHost(): TranslatableFileHostModel
    {
        $host = new TranslatableFileHostModel;
        $host->save();
        $host->document()->add($this->makeFile(TranslatableFile::class));

        return TranslatableFileHostModel::find($host->id);
    }

    /**
     * makeFile returns an unsaved file model with a title and description
     */
    protected function makeFile(string $class): File
    {
        $file = new $class;
        $file->file_name = 'manual.pdf';
        $file->disk_name = uniqid() . '.pdf';
        $file->file_size = 0;
        $file->content_type = 'application/pdf';
        $file->title = 'Manual';
        $file->description = 'The manual';

        return $file;
    }

    /**
     * makeSite creates an extra site using a locale
     */
    protected function makeSite(string $locale): SiteDefinition
    {
        $site = new SiteDefinition;
        $site->name = 'Site ' . $locale;
        $site->code = 'site-' . $locale;
        $site->locale = $locale;
        $site->is_enabled = true;
        $site->is_enabled_edit = true;
        $site->save();

        Site::resetCache();

        return $site;
    }
}
