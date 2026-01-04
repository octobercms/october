<div class="list-file-items">
    <?php foreach ($fileItems as $fileItem): ?>
        <?php if (!$column->clickable): ?>
            <a
                href="<?= e($fileItem['url']) ?>"
                target="_blank"
                class="list-file-item"
                title="<?= e($fileItem['name']) ?>"
            >
                <i class="ph ph-<?= e($fileItem['icon']) ?>"></i>
            </a>
        <?php else: ?>
            <span class="list-file-item" title="<?= e($fileItem['name']) ?>">
                <i class="ph ph-<?= e($fileItem['icon']) ?>"></i>
            </span>
        <?php endif ?>
    <?php endforeach ?>
</div>
