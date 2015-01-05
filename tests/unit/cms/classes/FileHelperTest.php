<?php

use Cms\Classes\FileHelper;

class FileHelperTest extends TestCase
{
    public function testValidateName()
    {
        $this->assertFalse(FileHelper::validateName(''));
        $this->assertTrue(FileHelper::validateName('01test-testdat'));
        $this->assertTrue(FileHelper::validateName('test/testdat'));
        $this->assertFalse(FileHelper::validateName('test\testdat'));
        $this->assertTrue(FileHelper::validateName('01test-test.dat'));
        $this->assertFalse(FileHelper::validateName('test@test.dat'));
        $this->assertFalse(FileHelper::validateName('test::test'));
        $this->assertFalse(FileHelper::validateName('@test'));
    }

    public function testFormatIniString()
    {
        $data = [
            'var1'=>'value 1',
            'var2'=>'value 21'
        ];

        $path = base_path().'/tests/fixtures/cms/filehelper/simple.ini';
        $this->assertFileExists($path);

        $str = FileHelper::formatIniString($data);
        $this->assertNotEmpty($str);
        $this->assertEquals($this->getContents($path), $str);

        $data = [
            'section' => [
                'sectionVar1' => 'section value 1',
                'sectionVar2' => 'section value 2'
            ],
            'section data' => [
                'sectionVar3' => 'section value 3',
                'sectionVar4' => 'section value 4'
            ],
            'var1'=>'value 1',
            'var2'=>'value 21'
        ];

        $path = base_path().'/tests/fixtures/cms/filehelper/sections.ini';
        $this->assertFileExists($path);

        $str = FileHelper::formatIniString($data);
        $this->assertEquals($this->getContents($path), $str);

        $data = [
            'section' => [
                'sectionVar1' => 'section value 1',
                'sectionVar2' => 'section value 2',
                'subsection' => [
                    'subsectionVar1' => 'subsection value 1',
                    'subsectionVar2' => 'subsection value 2'
                ],
                'sectionVar3' => 'section value 3'
            ],
            'section data' => [
                'sectionVar3' => 'section value 3',
                'sectionVar4' => 'section value 4',
                'subsection' => [
                    'subsectionVar1' => 'subsection value 1',
                    'subsectionVar2' => 'subsection value 2'
                ]
            ],
            'var1'=>'value 1',
            'var2'=>'value 21'
        ];

        $path = base_path().'/tests/fixtures/cms/filehelper/subsections.ini';
        $this->assertFileExists($path);

        $str = FileHelper::formatIniString($data);
        $this->assertEquals($this->getContents($path), $str);
   }

   //
   // Helpers
   //

   protected function getContents($path)
   {
        $content = file_get_contents($path);
        $content = preg_replace('~\R~u', PHP_EOL, $content); // Normalize EOL
        return $content;
   }

}
