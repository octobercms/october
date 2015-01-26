<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Exception</title>
        <link href="<?php echo URL::to('/modules/system/assets/vendor/font-autumn/css/font-autumn.css') ?>" rel="stylesheet">
        <link href="<?php echo URL::to('/modules/system/assets/css/styles.css') ?>" rel="stylesheet">
        <script src="<?php echo URL::to('/modules/system/assets/vendor/syntaxhighlighter/scripts/shCore.js') ?>"></script>
        <script src="<?php echo URL::to('/modules/system/assets/vendor/syntaxhighlighter/scripts/shBrushPhp.js') ?>"></script>
        <script src="<?php echo URL::to('/modules/system/assets/vendor/syntaxhighlighter/scripts/shBrushXml.js') ?>"></script>
        <link href="<?php echo URL::to('/modules/system/assets/vendor/syntaxhighlighter/styles/shCore.css') ?>">
    </head>
    <body>
        <div class="container">

            <h1><i class="icon-power-off warning"></i> Error</h1>

            <p class="lead">We're sorry, but an unhandled error occurred. Please see the details below.</p>

            <div class="exception-name-block">
                <div><?php echo e($exception->getMessage()) ?></div>
                <p><?php echo $exception->getFile() ?> <span>line</span> <?php echo $exception->getLine() ?></p>
            </div>

            <ul class="indicators">
                <li>
                    <h3>Type</h3>
                    <p><?php echo e($exception->getErrorType()) ?></p>
                </li>
                <li>
                    <h3>Exception</h3>
                    <p><?php echo e($exception->getClassName()) ?></p>
                </li>
            </ul>

            <pre class="brush: php"><?php foreach ($exception->getHighlightLines() as $line): ?><?php echo $line ?><?php endforeach ?></pre>

            <h3><i class="icon-code-fork warning"></i> Stack trace</h3>

            <table class="data-table">
                <thead>
                    <tr>
                        <th class="right">#</th>
                        <th>Called Code</th>
                        <th>Document</th>
                        <th class="right">Line</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($exception->getCallStack() as $stackItem): ?>
                        <tr>
                            <td class="right"><?php echo $stackItem->id ?></td>
                            <td>
                                <?php echo $stackItem->code ?>(<?php if ($stackItem->args): ?><abbr title="<?php echo $stackItem->args ?>">&hellip;</abbr><?php endif ?>)
                            </td>
                            <td><?php echo $stackItem->file ?></td>
                            <td class="right"><?php echo $stackItem->line ?></td>
                        </tr>
                    <?php endforeach ?>
                </tbody>
            </table>
        </div>

        <script>
            SyntaxHighlighter.defaults['toolbar'] = false;
            SyntaxHighlighter.defaults['html-script'] = true;
            SyntaxHighlighter.defaults['first-line'] = <?php echo $exception->getHighlight()->startLine+1 ?>;
            SyntaxHighlighter.defaults['highlight'] = <?php echo $exception->getLine() ?>;
            SyntaxHighlighter.all()
        </script>
    </body>
</html>