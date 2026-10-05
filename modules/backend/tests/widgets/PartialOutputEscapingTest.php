<?php

/**
 * PartialOutputEscapingHarness renders a partial file with a stand-in widget context.
 */
class PartialOutputEscapingHarness
{
    use \System\Traits\ViewMaker;

    /**
     * @var array returns maps method and property names to the values they return.
     */
    public $returns = [];

    /**
     * __construct the harness with optional method and property return values.
     */
    public function __construct(array $returns = [])
    {
        $this->returns = $returns + ['previewMode' => false, 'formField' => $this];
    }

    /**
     * renderFile renders a partial file relative to the base path.
     */
    public function renderFile(string $path, array $vars = []): string
    {
        return $this->makeFileContents(base_path($path), $vars);
    }

    /**
     * makePartial skips nested partials so only the target file is rendered.
     */
    public function makePartial($partial, $params = [], $throwException = true)
    {
        return '';
    }

    /**
     * __call returns the configured value for any widget method.
     */
    public function __call($name, $args)
    {
        return $this->returns[$name] ?? '';
    }

    /**
     * __get returns the configured value for any widget property.
     */
    public function __get($name)
    {
        return $this->returns[$name] ?? null;
    }
}

/**
 * PartialOutputEscapingTest ensures stored or reflected values are escaped when written into backend partials.
 */
class PartialOutputEscapingTest extends PluginTestCase
{
    const PAYLOAD = '"><svg onload="alert(1)">';

    const ESCAPED = '&quot;&gt;&lt;svg onload=&quot;alert(1)&quot;&gt;';

    /**
     * makeFile returns a stand-in file object with the payload on its URL properties.
     */
    protected function makeFile(): object
    {
        $file = new class extends stdClass {
            public function getFileType()
            {
                return 'image';
            }
        };

        $file->id = 1;
        $file->pathUrl = self::PAYLOAD;
        $file->thumbUrl = self::PAYLOAD;
        $file->publicUrl = '/storage/app/media/image.png';
        $file->path = '/image.png';
        $file->title = 'Image';
        $file->file_name = 'image.png';
        $file->description = '';
        $file->file_size = 100;

        return $file;
    }

    /**
     * assertEscaped checks the payload appears escaped, not raw, after the given markup context.
     */
    protected function assertEscaped(string $html, string $context): void
    {
        $this->assertStringNotContainsString($context . self::PAYLOAD, $html);
        $this->assertStringContainsString($context . self::ESCAPED, $html);
    }

    /**
     * @dataProvider fileUploadPartialProvider
     */
    public function testFileUploadPathIsEscaped(string $partial)
    {
        $harness = new PartialOutputEscapingHarness;
        $file = $this->makeFile();

        $html = $harness->renderFile('modules/backend/formwidgets/fileupload/partials/' . $partial, [
            'name' => 'Model[files]',
            'size' => 'large',
            'fileList' => collect([$file]),
            'singleFile' => $file,
            'maxFilesize' => 10,
            'maxFiles' => null,
            'externalToolbarBus' => null,
            'useCaption' => false,
            'acceptedFileTypes' => null,
            'imageHeight' => null,
            'imageWidth' => null,
        ]);

        $this->assertEscaped($html, 'data-path="');
    }

    public static function fileUploadPartialProvider(): array
    {
        return [
            ['_file_multi.php'],
            ['_file_single.php'],
            ['_image_multi.php'],
            ['_image_single.php'],
        ];
    }

    /**
     * @dataProvider mediaFinderPartialProvider
     */
    public function testMediaFinderThumbUrlIsEscaped(string $partial)
    {
        $harness = new PartialOutputEscapingHarness;
        $file = $this->makeFile();

        $html = $harness->renderFile('modules/media/formwidgets/mediafinder/partials/' . $partial, [
            'field' => new PartialOutputEscapingHarness,
            'size' => 'large',
            'fileList' => collect([$file]),
            'singleFile' => $file,
            'maxItems' => null,
            'externalToolbarBus' => null,
            'useCopyPaste' => false,
            'imageHeight' => null,
            'imageWidth' => null,
        ]);

        $this->assertEscaped($html, 'data-thumb-url="');
    }

    public static function mediaFinderPartialProvider(): array
    {
        return [
            ['_image_single.php'],
            ['_image_multi.php'],
        ];
    }

    public function testMediaCropToolImageUrlIsEscaped()
    {
        $html = (new PartialOutputEscapingHarness)->renderFile('modules/media/widgets/mediamanager/partials/_crop-tool-image-area.php', [
            'dimensions' => [100, 100],
            'imageUrl' => self::PAYLOAD,
        ]);

        $this->assertEscaped($html, 'src="');
    }

    public function testMediaFolderPathSegmentIsEscaped()
    {
        $html = (new PartialOutputEscapingHarness)->renderFile('modules/media/widgets/mediamanager/partials/_folder-path.php', [
            'searchMode' => false,
            'pathSegments' => ['/' . self::PAYLOAD => '/' . self::PAYLOAD],
        ]);

        $this->assertEscaped($html, '">');
    }

    public function testImportColumnNameIsEscaped()
    {
        $html = (new PartialOutputEscapingHarness)->renderFile('modules/backend/behaviors/importexportcontroller/partials/_column_sample_form.php', [
            'columnName' => self::PAYLOAD,
            'columnData' => ['Sample'],
        ]);

        $this->assertEscaped($html, '<strong>');
    }

    /**
     * @dataProvider relationManageIdProvider
     */
    public function testRelationManageFormSessionKeyIsEscaped($manageId)
    {
        $harness = new PartialOutputEscapingHarness;

        $html = $harness->renderFile('modules/backend/behaviors/relationcontroller/partials/_manage_form.php', [
            'relationManageFormWidget' => new PartialOutputEscapingHarness,
            'relationPopupSize' => null,
            'relationManageId' => $manageId,
            'newSessionKey' => 'abc',
            'relationField' => 'comments',
            'relationExtraConfig' => [],
            'formSessionKey' => self::PAYLOAD,
            'relationManageTitle' => 'Title',
            'relationReadOnly' => false,
        ]);

        $this->assertEscaped($html, 'name="_form_session_key" value="');
    }

    public static function relationManageIdProvider(): array
    {
        return [
            [1],
            [null],
        ];
    }

    public function testRelationUpdateButtonManageIdIsEscaped()
    {
        $html = (new PartialOutputEscapingHarness)->renderFile('modules/backend/behaviors/relationcontroller/partials/_button_update.php', [
            'relationManageId' => self::PAYLOAD,
        ]);

        $this->assertEscaped($html, "manage_id: '");
    }

    public function testRelationPivotFormIdsAreEscaped()
    {
        $vars = [
            'relationPivotWidget' => new PartialOutputEscapingHarness,
            'relationPopupSize' => null,
            'relationManageId' => null,
            'relationPivotId' => self::PAYLOAD,
            'relationField' => 'comments',
            'relationExtraConfig' => [],
            'relationPivotTitle' => 'Title',
            'relationReadOnly' => false,
            'foreignId' => [self::PAYLOAD],
            'formSessionKey' => 'abc',
        ];

        $html = (new PartialOutputEscapingHarness)->renderFile('modules/backend/behaviors/relationcontroller/partials/_pivot_form.php', $vars);
        $this->assertEscaped($html, 'name="pivot_id" value="');

        $vars['relationPivotId'] = null;
        $html = (new PartialOutputEscapingHarness)->renderFile('modules/backend/behaviors/relationcontroller/partials/_pivot_form.php', $vars);
        $this->assertEscaped($html, 'name="foreign_id[]" value="');
    }

    public function testListCheckboxRecordKeyIsEscaped()
    {
        $harness = new PartialOutputEscapingHarness(['getColumnKey' => self::PAYLOAD]);

        $html = $harness->renderFile('modules/backend/widgets/lists/partials/_list_body_checkbox.php', [
            'record' => null,
        ]);

        $this->assertEscaped($html, 'value="');
    }

    public function testDashDefinitionIsEscaped()
    {
        $html = (new PartialOutputEscapingHarness)->renderFile('modules/dashboard/behaviors/dashcontroller/partials/_container.php', [
            'dashDefinition' => self::PAYLOAD,
            'dashWidget' => new PartialOutputEscapingHarness,
        ]);

        $this->assertEscaped($html, 'name="_dash_definition" value="');
    }
}
