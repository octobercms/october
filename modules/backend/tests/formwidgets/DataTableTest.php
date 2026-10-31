<?php

use Backend\Widgets\Form;
use October\Rain\Database\Model;

/**
 * DataTableModel is a plain model holding table rows in memory.
 */
class DataTableModel extends Model
{
    public $timestamps = false;
}

/**
 * DataTableTest covers the DataTable widget's rendered options and its CSV import and export handlers.
 */
class DataTableTest extends PluginTestCase
{
    /**
     * makeForm builds a form with a lines datatable using the given extra field options
     */
    protected function makeForm(array $fieldConfig = []): Form
    {
        $form = new Form(new \Backend\Classes\Controller, [
            'model' => new DataTableModel,
            'arrayName' => 'DataTableModel',
            'fields' => [
                'lines' => $fieldConfig + [
                    'type' => 'datatable',
                    'columns' => [
                        'sku' => ['type' => 'string', 'title' => 'SKU'],
                        'qty' => ['type' => 'numeric', 'title' => 'Quantity'],
                        'taxable' => ['type' => 'checkbox', 'title' => 'Taxable'],
                    ],
                ],
            ],
        ]);

        $form->bindToController();
        self::callProtectedMethod($form, 'defineFormFields');

        return $form;
    }

    /**
     * swapPost replaces the request instance so post() reads the given data
     */
    protected function swapPost(array $data): void
    {
        $request = \Illuminate\Http\Request::create('/', 'POST', $data);
        app()->instance('request', $request);
        \Illuminate\Support\Facades\Facade::clearResolvedInstance('request');
    }

    public function testRendersAddingAndDeletingForTheContextMenu()
    {
        $html = $this->makeForm(['adding' => false, 'toolbar' => false])->getFormWidget('lines')->render();

        $this->assertStringContainsString('data-adding="false"', $html);
        $this->assertStringContainsString('data-deleting="true"', $html);
    }

    public function testRendersRequireValid()
    {
        $this->assertStringContainsString('data-require-valid="false"', $this->makeForm()->getFormWidget('lines')->render());
        $this->assertStringContainsString('data-require-valid="true"', $this->makeForm(['requireValid' => true])->getFormWidget('lines')->render());
    }

    public function testKeepsPercentageWidthsAndReadsPixelWidths()
    {
        $html = $this->makeForm([
            'columns' => [
                'sku' => ['title' => 'SKU', 'width' => '15%'],
                'qty' => ['title' => 'Quantity', 'width' => '80px'],
                'note' => ['title' => 'Note', 'width' => 120],
            ],
        ])->getFormWidget('lines')->render();

        preg_match('/data-columns=\'([^\']*)\'/', $html, $match);
        $columns = json_decode(html_entity_decode($match[1]), true);

        $this->assertSame(['15%', 80, 120], array_column($columns, 'width'));
    }

    public function testMultiSelectOffSelectsOneCellAtATime()
    {
        $hotOptions = function (array $fieldConfig): array {
            preg_match('/data-hot-options=\'([^\']*)\'/', $this->makeForm($fieldConfig)->getFormWidget('lines')->render(), $match);
            return json_decode(html_entity_decode($match[1]), true);
        };

        $this->assertArrayNotHasKey('selectionMode', $hotOptions([]));
        $this->assertArrayNotHasKey('fillHandle', $hotOptions([]));
        $this->assertSame('single', $hotOptions(['multiSelect' => false])['selectionMode']);
        $this->assertFalse($hotOptions(['multiSelect' => false])['fillHandle']);
    }

    public function testRendersTheImportFileInputOnlyWithCsvImport()
    {
        $this->assertStringNotContainsString('data-table-import-file', $this->makeForm()->getFormWidget('lines')->render());

        $html = $this->makeForm(['csvImport' => true])->getFormWidget('lines')->render();
        $this->assertStringContainsString('data-table-import-file', $html);
    }

    public function testExportCsvWritesTitlesRowsAndNeutralizesFormulas()
    {
        $this->swapPost(['tableData' => json_encode([
            ['sku' => 'A-100', 'qty' => 12, 'taxable' => 1, 'note' => 'not a column'],
            ['sku' => '=SUM(A1:A2)', 'qty' => -5],
        ])]);

        $response = $this->makeForm()->getFormWidget('lines')->onExportCsv();
        $body = $response->getContent();

        $this->assertSame('attachment; filename="lines.csv"', $response->headers->get('Content-Disposition'));
        $this->assertStringStartsWith("\xEF\xBB\xBF", $body);
        $this->assertSame([
            'SKU,Quantity,Taxable',
            'A-100,12,1',
            "'=SUM(A1:A2),-5,",
        ], explode("\n", trim(substr($body, 3))));
    }

    public function testImportCsvMatchesHeaderTitlesAndNamesInAnyOrder()
    {
        $this->swapPost(['csvData' => "taxable,Unknown,quantity,sku\n1,x,12,A-100\n,,,\n0,y,3,B-200\n"]);

        $result = $this->makeForm()->getFormWidget('lines')->onImportCsv();

        $this->assertSame([
            ['taxable' => '1', 'qty' => '12', 'sku' => 'A-100'],
            ['taxable' => '0', 'qty' => '3', 'sku' => 'B-200'],
        ], $result['rows']);
    }

    public function testImportCsvUsesColumnOrderWithoutAHeader()
    {
        $this->swapPost(['csvData' => "A-100;12;1\nB-200;3\n"]);

        $result = $this->makeForm()->getFormWidget('lines')->onImportCsv();

        $this->assertSame([
            ['sku' => 'A-100', 'qty' => '12', 'taxable' => '1'],
            ['sku' => 'B-200', 'qty' => '3', 'taxable' => null],
        ], $result['rows']);
    }

    public function testImportCsvKeepsQuotedLineBreaks()
    {
        $this->swapPost(['csvData' => "SKU,Quantity\r\n\"Line one\nLine two\",5\r\n"]);

        $result = $this->makeForm()->getFormWidget('lines')->onImportCsv();

        $this->assertSame([['sku' => "Line one\nLine two", 'qty' => '5']], $result['rows']);
    }
}
