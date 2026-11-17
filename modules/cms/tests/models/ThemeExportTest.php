<?php

use Cms\Models\ThemeExport;
use October\Rain\Exception\ApplicationException;

/**
 * ThemeExportTest
 */
class ThemeExportTest extends TestCase
{
    /**
     * testSaveExplainsThatTheModelIsNotSaved confirms saving reports the intended message
     */
    public function testSaveExplainsThatTheModelIsNotSaved()
    {
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('ThemeExport model is not intended to be saved');

        (new ThemeExport)->save();
    }
}
