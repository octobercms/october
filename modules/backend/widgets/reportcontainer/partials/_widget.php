<?php if ($widget->property('ocWidgetNewRow')): ?>
    <li class="item separator"></li>
<?php endif ?>

<li class="item <?= 'width-'.$widget->property('ocWidgetWidth') ?> <?= $widget->property('ocWidgetNewRow') ? 'new-line' : null ?> <?= $this->showReorder ? 'is-sortable' : '' ?> <?= $this->showAddRemove ? 'is-removable' : '' ?>">
    <div class="content">
        <?php if ($this->showReorder): ?>
            <div class="drag-handle">
                <i class="icon-list-reorder"></i>
            </div>
        <?php endif ?>

        <div id="<?= $widgetAlias ?>"><?= $widget->render() ?></div>

        <?php if ($this->showConfigure): ?>
            <a href="javascript:;"
                class="icon-cog widget-control edit-widget"
                data-inspectable
                data-inspector-title="<?= e(__("Widget Configuration")) ?>"
                data-inspector-description="<?= e(__("Configure the report widget")) ?>"
                data-inspector-config="<?= e($this->getWidgetPropertyConfig($widget)) ?>"
                data-inspector-class="<?= get_class($widget) ?>"
                data-inspector-offset="-3"
                data-inspector-offset-x="-15"
                data-inspector-placement="left"
                data-inspector-fallback-placement="left">
                <input type="hidden" name="widget_properties[]" data-inspector-values value="<?= e($this->getWidgetPropertyValues($widget)) ?>"/>
                Edit
            </a>
        <?php endif ?>

        <?php if ($this->showAddRemove): ?>
            <button
                type="button"
                class="btn-close widget-control close-widget"
                data-remove-widget
                aria-label="<?= __("Close") ?>"></button>
        <?php endif ?>

        <input type="hidden" data-widget-alias name="widgetAliases[]" value="<?= $widgetAlias ?>"/>
        <input type="hidden" data-widget-order name="widgetSortOrders[]" value="<?= $sortOrder ?>"/>
    </div>
</li>
