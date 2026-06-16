<div>
    <input
        type="text"
        class="inspector-control clickable act-as-text-input"
        :class="{'placeholder': isPlaceholder}"
        :value="displayText"
        :id="controlId"
        :readonly="true"
        ref="link"
        @click="openPopup"
        @keydown.enter.prevent="openPopup"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
    />

    <Teleport to="body">
        <backend-modal
            v-if="popupVisible"
            ref="popupModal"
            size="small"
            :aria-labeled-by="controlId + '-modal-title'"
            :unique-key="controlId + '-modal'"
            @hidden="onPopupHidden"
        >
            <template v-slot:content>
                <div class="modal-header">
                    <h4
                        class="modal-title"
                        :id="controlId + '-modal-title'"
                        v-text="control.title"
                    ></h4>
                    <button
                        @click.prevent="cancelPopup"
                        type="button"
                        class="btn-close"
                        aria-label="<?= e(trans('backend::lang.form.close')) ?>"
                    ></button>
                </div>
                <div class="modal-body">
                    <p
                        v-if="control.description"
                        class="text-muted"
                        v-text="control.description"
                    ></p>
                    <div class="inspector-stringlist-autocomplete-rows">
                        <div
                            v-for="(row, index) in rows"
                            :key="index"
                            class="input-group mb-1"
                        >
                            <input
                                type="text"
                                class="form-control"
                                :value="row.value"
                                ref="rowInputs"
                                @input="onRowInput(index, $event)"
                                @keydown="onRowKeydown(index, $event)"
                                :placeholder="control.placeholder"
                                list="stringlist-autocomplete-items"
                            />
                            <button
                                type="button"
                                class="btn btn-outline-secondary"
                                @click="removeRow(index)"
                                tabindex="-1"
                            >&times;</button>
                        </div>
                        <datalist id="stringlist-autocomplete-items">
                            <option
                                v-for="item in resolvedItems"
                                :key="item"
                                :value="item"
                            ></option>
                        </datalist>
                    </div>
                    <button
                        type="button"
                        class="btn btn-sm btn-secondary mt-2"
                        @click="addRow"
                    ><?= e(trans('backend::lang.form.add')) ?></button>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="applyPopup"
                    ><?= e(trans('backend::lang.form.ok')) ?></button>
                    <span class="button-separator"><?= e(trans('backend::lang.form.or')) ?></span>
                    <button
                        class="btn btn-link text-muted"
                        @click.prevent="cancelPopup"
                    ><?= e(trans('backend::lang.form.cancel')) ?></button>
                </div>
            </template>
        </backend-modal>
    </Teleport>
</div>
