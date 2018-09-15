<?php

use Backend\Models\ExportModel;

if (!class_exists('Model')) class_alias('October\Rain\Database\Model', 'Model');

class ExampleExportModel extends ExportModel
{
    public function exportData($columns, $sessionKey = null)
    {
        return [
            [
                'foo' => 'bar',
                'bar' => 'foo'
            ],
            [
                'foo' => 'bar2',
                'bar' => 'foo2'
            ],
        ];
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

    public function testExportContentType()
    {
        $model = new ExampleExportModel;

        $csvName = $model->export(['foo' => 'title', 'bar' => 'title2'], []);

        $response = $model->download($csvName);

        $requestMock = $this
            ->getMockBuilder('Illuminate\Http\Request')
            ->setMethods()
            ->getMock();
        $response->prepare($requestMock);

        $this->assertTrue($response->headers->has('Content-Type'), "Response is missing the Content-Type header!");
        $this->assertTrue($response->headers->contains('Content-Type', 'text/plain'), "Content-Type is not \"text/csv\"!");

        @unlink(temp_path() . '/' . $csvName);
    }

}
