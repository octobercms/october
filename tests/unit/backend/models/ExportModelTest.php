<?php

use Backend\Models\ExportModel;

if (!class_exists('Model')) class_alias('October\Rain\Database\Model', 'Model');

class ExampleExportModel extends ExportModel
{
    public function exportData($columns, $sessionKey = null)
    {
        return [];
    }
}

class ExportModelTest extends TestCase
{

    //
    // Helpers
    //

    protected static function callProtectedMethod($object, $name, $params = [])
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $method = $class->getMethod($name);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $params);
    }

    //
    // Tests
    //

    public function testEncodeArrayValue()
    {
        $model = new ExampleExportModel;
        $data = ['foo', 'bar'];
        $result = self::callProtectedMethod($model, 'encodeArrayValue', [$data]);
        $this->assertEquals('foo|bar', $result);

        $data = ['dps | heals | tank', 'paladin', 'berserker', 'gunner'];
        $result = self::callProtectedMethod($model, 'encodeArrayValue', [$data]);
        $this->assertEquals('dps \| heals \| tank|paladin|berserker|gunner', $result);

        $data = ['art direction', 'roman empire', 'sci-fi'];
        $result = self::callProtectedMethod($model, 'encodeArrayValue', [$data, '-']);
        $this->assertEquals('art direction-roman empire-sci\-fi', $result);
    }

}
