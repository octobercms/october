<?php
    $vars = [
        'listColumn' => $column,
        'listRecord' => $record,
        'listValue' => $value,
        'column' => $column,
        'record' => $record,
        'value' => $value
    ];
?>
<?php if ($column->path && str_contains($column->path, '::')): ?>
    <?= View::make($column->path, $vars) ?>
<?php elseif ($column->path && File::isPathSymbol($column->path)): ?>
    <?= $this->controller->makePartial($column->path, $vars) ?>
<?php else: ?>
    <?php
        // @deprecated forever?
        $oldViewFile = $column->path ?: ltrim($column->columnName, '_');
        $viewFile = $column->path ?: 'column_' . ltrim($column->columnName, '_');
        $modelPath = $this->guessViewPathFrom($record);
    ?>
    <?= ($this->controller->makePartial("{$modelPath}/{$viewFile}", $vars, false)
            ?: $this->controller->makePartial($viewFile, $vars, false))
            ?: $this->controller->makePartial($oldViewFile, $vars, false) ?>
<?php endif ?>
