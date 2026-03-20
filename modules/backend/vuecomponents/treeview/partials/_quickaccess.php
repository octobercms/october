<backend-modal
    ref="modal"
    :unique-key="modalUniqueKey"
    :close-by-overlay-click="true"
    :resizable="resizable"
    :draggable="true"
    :aria-labeled-by="labelId"
    :resize-min-height="200"
    :resize-default-width="500"
    modalCssClass="treeview-quick-access-modal"
    @shown="onModalShown"
    @hidden="onModalHidden"
>
    <template v-slot:content>
        <div class="treeview-quick-access flex-layout-column fill-container">
            <div class="modal-header flex-layout-item fix">
                <h4 class="modal-title" v-bind:id="labelId"><?= e(trans('backend::lang.treeview.quick_access')) ?></h4>
            </div>
            <div class="modal-body flex-layout-item stretch relative" :class="{'has-results': nodes.length > 0}">
                <div class="treeview-quick-access flex-layout-column fill-container">
                    <div class="input-container backend-icon-background-pseudo flex-layout-item fix">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="<?= e(trans('backend::lang.treeview.command_or_document')) ?>"
                            data-default-focus
                        />
                    </div>
                    <div class="quick-access-list flex-layout-item stretch relative">
                        <backend-scrollable-panel ref="scrollablePanel">
                            <ul>
                                <li class="quick-list-header" v-if="nodes.length > 0">
                                    <?= e(trans('backend::lang.treeview.open')) ?>
                                </li>
                                <li
                                    v-for="(nodeData, index) in nodes"
                                    class="item-document"
                                    :class="{selected: selectedIndex == index}"
                                    @mouseover="onMouseOver(index)"
                                    @click.prevent="onClick($event, nodeData.node.uniqueKey)"
                                    v-bind:data-node-key="nodeData.node.uniqueKey"
                                >
                                    <span
                                        class="node-icon"
                                        aria-hidden="true"
                                        v-if="nodeData.node.icon"
                                        v-bind:style="{'background-color': nodeData.node.icon.backgroundColor ? nodeData.node.icon.backgroundColor : '#E67E21'}"
                                    >
                                        <i :class="nodeData.node.icon.cssClass"></i>
                                    </span>

                                    <span
                                        v-for="pathItem in nodeData.path"
                                        v-text="getPathItemText(pathItem, nodeData.path)"
                                        class="path-item"
                                        :class="getPathItemClass(pathItem)"
                                    ></span>
                                    <span class="path-item path-leaf" v-text="getPathItemText(nodeData.node, nodeData.path)"></span>
                                </li>

                                <li class="quick-list-header" v-if="commands.length > 0">
                                    <?= e(trans('backend::lang.treeview.commands')) ?>
                                </li>

                                <li
                                    v-for="(commandData, index) in commands"
                                    class="item-command"
                                    :class="{selected: selectedIndex == index + nodes.length}"
                                    @mouseover="onMouseOver(index + nodes.length)"
                                    @click.prevent="onCommandClick($event, commandData.item.command, commandData.item)"
                                    v-bind:data-command="commandData.item.command"
                                    v-bind:data-item-href="commandData.item.href"
                                    v-bind:data-item-target="commandData.item.target"
                                >
                                    <span
                                        class="node-icon"
                                        aria-hidden="true"
                                    >
                                        <i class="backend-icon-background icon-command"></i>
                                    </span>

                                    <span
                                        v-for="pathItem in commandData.path"
                                        v-text="pathItem.label"
                                        class="path-item path-command"
                                    ></span>

                                    <span class="path-item path-leaf path-leaf-command" v-text="commandData.item.label"></span>
                                </li>
                            </ul>
                        </backend-scrollable-panel>
                    </div>
                </div>
            </div>
        </div>
    </template>
</backend-modal>