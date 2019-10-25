<?php

use Backend\Models\ImportModel;
use System\Models\File as FileModel;

class ExampleDbImportModel extends ImportModel
{
    public $rules = [];

    public function importData($results, $sessionKey = null)
    {
        return [];
    }
}

class ImportModelDbTest extends PluginTestCase
{
    public function testGetImportFilePath()
    {
        $model = new ExampleDbImportModel;
        $sessionKey = uniqid('session_key', true);

        $file1 = FileModel::create([
            'data' => base_path().'/tests/fixtures/backend/reference/file1.txt',
            'is_public' => false,
        ]);

        $file2 = FileModel::create([
            'data' => base_path().'/tests/fixtures/backend/reference/file2.txt',
            'is_public' => false,
        ]);

        $model->import_file()->add($file1, $sessionKey);
        $model->import_file()->add($file2, $sessionKey);

        $this->assertEquals(
            $file2->getLocalPath(),
            $model->getImportFilePath($sessionKey),
            'ImportModel::getImportFilePath() should return the last uploaded file.'
        );
    }
}
