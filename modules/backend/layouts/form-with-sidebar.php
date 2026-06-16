<div class="d-flex h-100 form-with-sidebar sidebar-width-<?= $sidebarWidth ?? 300 ?>">
    <div class="flex-grow-1 form-contents">

        <div class="d-flex h-100 flex-column">
            <?php if ($breadcrumbContent = Block::placeholder('breadcrumb')): ?>
                <!-- Breadcrumb -->
                <nav class="control-breadcrumb breadcrumb-flush">
                    <?= $breadcrumbContent ?>
                </nav>
            <?php endif ?>

            <!-- Content -->
            <div class="flex-grow-1 position-relative">
                <div class="padded-container h-100 d-flex flex-column">
                    <?= Block::placeholder('form-contents') ?>
                </div>
            </div>
        </div>

    </div>
    <div class="flex-shrink-0 form-sidebar control-scrollpanel">
        <div class="position-relative h-100">
            <div class="form-with-sidebar-canvas">
                <div class="control-scrollbar" data-control="scrollbar">
                    <div class="padded-container">
                        <?= Block::placeholder('form-sidebar') ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
