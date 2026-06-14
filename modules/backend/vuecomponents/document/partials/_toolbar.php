<div class="d-flex flex-row document-toolbar-scroll-container" ref="toolbarContainer">
    <div class="document-toolbar-scrollable flex-fill" ref="scrollable">
        <template v-for="element in scrollableElements" :key="element.uniqueKey">
            <template v-if="!element.hidden">
                <?= $this->makePartial('toolbarelementlist') ?>
            </template>
        </template>
    </div>

    <div class="flex-shrink-0 fixed-right">
        <template v-for="element in fixedRightElements" :key="element.uniqueKey">
            <template v-if="!element.hidden">
                <?= $this->makePartial('toolbarelementlist') ?>
            </template>
        </template>
    </div>
</div>