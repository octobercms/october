<div class="widget-error">
    <span class="ph ph-warning"></span>
    <p>
        <span v-if="message" v-text="message"></span>
        <template v-else>
            <?= __("Error loading the widget data. See the browser error console for details.") ?>
        </template>
        <template v-if="store.state.canCreateAndEdit">
            <a href="javascript:;" @click.stop.prevent="$emit('configure')"><?= __("Configure the widget") ?></a>
            <?= __("to manage its settings.") ?>
        </template>
    </p>
</div>
