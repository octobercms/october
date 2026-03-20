<div class="flex-layout-row document-toolbar-scroll-container" ref="toolbarContainer">
    <div class="document-toolbar-scrollable flex-layout-item stretch" ref="scrollable">
        <template v-for="element in scrollableElements" :key="element.uniqueKey">
            <template v-if="!element.hidden">
                <?= $this->makePartial('toolbarelementlist') ?>
            </template>
        </template>
    </div>

    <div class="flex-layout-item fix fixed-right">
        <template v-for="element in fixedRightElements" :key="element.uniqueKey">
            <template v-if="!element.hidden">
                <?= $this->makePartial('toolbarelementlist') ?>
            </template>
        </template>
    </div>
</div>