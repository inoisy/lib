<script>
// Extensions
import VTextField from '../VTextField';

// Components
import VChip from '../VChip';

// Utilities
import { deepEqual, humanReadableFileSize, wrapInArray } from '../../../utils/helpers';
import { consoleError } from '../../../utils/console';
import { mergeStyles } from '../../../utils/mergeData';
import { replaceVariablesInTemplate } from '../../../utils/text-utils';
/* eslint-disable vue/require-prop-types,no-prototype-builtins,new-cap,vue/require-default-prop,no-unused-expressions */

export default VTextField.extend({
    name: 'v-file-input',

    model: {
        prop: 'value',
        event: 'change',
    },

    props: {
        chips: Boolean,
        clearable: {
            type: Boolean,
            default: true,
        },
        counterSizeString: {
            type: String,
            default: 'Файлов: {0} (всего {1})',
        },
        counterString: {
            type: String,
            default: 'Файлов: {0}',
        },
        hideInput: Boolean,
        placeholder: String,
        prependIcon: {
            type: String,
            default: '$file',
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        showSize: {
            type: [Boolean, Number],
            default: false,
            validator: v => typeof v === 'boolean' ||
                [1000, 1024].includes(v)
            ,
        },
        smallChips: Boolean,
        truncateLength: {
            type: [Number, String],
            default: 22,
        },
        type: {
            type: String,
            default: 'file',
        },
        value: {
            default: undefined,
            validator: val => wrapInArray(val).every(v => v !== null && typeof v === 'object'),
        },
    },

    computed: {
        classes() {
            return {
                ...VTextField.options.computed.classes.call(this),
                'v-file-input': true,
            };
        },
        computedCounterValue() {
            const fileCount = this.isMultiple && this.lazyValue
                ? this.lazyValue.length
                : this.lazyValue instanceof File ? 1 : 0;

            if (!this.showSize) {
                return replaceVariablesInTemplate(this.counterString, fileCount);
            }

            const bytes = this.internalArrayValue.reduce((bytes, { size = 0 }) => bytes + size, 0);

            return replaceVariablesInTemplate(this.counterSizeString, fileCount, humanReadableFileSize(bytes, this.base === 1024));
        },
        internalArrayValue() {
            return wrapInArray(this.internalValue);
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit('change', this.lazyValue);
            },
        },
        isDirty() {
            return this.internalArrayValue.length > 0;
        },
        isLabelActive() {
            return this.isDirty;
        },
        isMultiple() {
            return this.$attrs.hasOwnProperty('multiple');
        },
        text() {
            if (!this.isDirty && (this.isFocused || !this.hasLabel)) {
                return [this.placeholder];
            }

            return this.internalArrayValue.map(file => {
                const {
                    name = '',
                    size = 0,
                } = file;

                const truncatedText = this.truncateText(name);

                return !this.showSize
                    ? truncatedText
                    : `${truncatedText} (${humanReadableFileSize(size, this.base === 1024)})`;
            });
        },
        base() {
            return typeof this.showSize !== 'boolean' ? this.showSize : undefined;
        },
        hasChips() {
            return this.chips || this.smallChips;
        },
    },

    watch: {
        readonly: {
            handler(v) {
                if (v === true) {
                    consoleError('readonly is not supported on <v-file-input>', this);
                }
            },
            immediate: true,
        },
        value(v) {
            const value = this.isMultiple ? v : v ? [v] : [];
            if (!deepEqual(value, this.$refs.input.files)) {
                // When the input value is changed programatically, clear the
                // internal input's value so that the `onInput` handler
                // can be triggered again if the user re-selects the exact
                // same file(s). Ideally, `input.files` should be
                // manipulated directly but that property is readonly.
                this.$refs.input.value = '';
            }
        },
    },

    methods: {
        clearableCallback() {
            this.internalValue = this.isMultiple ? [] : null;
            this.$refs.input.value = '';
        },
        genChips() {
            if (!this.isDirty) {
                return [];
            }

            return this.text.map((text, index) => this.$createElement(VChip, {
                props: { small: this.smallChips },
                on: {
                    'click:close': () => {
                        const internalValue = this.internalValue;
                        internalValue.splice(index, 1);
                        this.internalValue = internalValue; // Trigger the watcher
                    },
                },
            }, [text]));
        },
        genControl() {
            const render = VTextField.options.methods.genControl.call(this);

            if (this.hideInput && render.data) {
                render.data.style = mergeStyles(render.data.style, { display: 'none' });
            }

            return render;
        },
        genInput() {
            const input = VTextField.options.methods.genInput.call(this);

            // We should not be setting value
            // programmatically on the input
            // when it is using type="file"
            delete input.data?.domProps?.value;

            // This solves an issue in Safari where
            // nothing happens when adding a file
            // do to the input event not firing
            delete input.data?.on?.input;
            if (input.data?.on) {
                input.data.on.change = this.onInput;
            }


            return [this.genSelections(), input];
        },
        genPrependSlot() {
            if (!this.prependIcon) {
                return null;
            }

            const icon = this.genIcon('prepend', () => {
                this.$refs.input.click();
            });

            return this.genSlot('prepend', 'outer', [icon]);
        },
        genSelectionText() {
            const length = this.text.length;

            if (length < 2) {
                return this.text;
            }
            if (this.showSize && !this.counter) {
                return [this.computedCounterValue];
            }
            return [replaceVariablesInTemplate(this.counterString, length)];
        },
        genSelections() {
            const children = [];

            if (this.isDirty && this.$scopedSlots.selection) {
                this.internalArrayValue.forEach((file, index) => {
                    if (!this.$scopedSlots.selection) {
                        return;
                    }

                    children.push(this.$scopedSlots.selection({
                        text: this.text[index],
                        file,
                        index,
                    }));
                });
            } else {
                children.push(this.hasChips && this.isDirty ? this.genChips() : this.genSelectionText());
            }

            return this.$createElement('div', {
                staticClass: 'v-file-input__text',
                class: {
                    'v-file-input__text--placeholder': this.placeholder && !this.isDirty,
                    'v-file-input__text--chips': this.hasChips && !this.$scopedSlots.selection,
                },
            }, children);
        },
        genTextFieldSlot() {
            const node = VTextField.options.methods.genTextFieldSlot.call(this);
            if (node.data) {
                node.data.on = {
                    ...node.data.on || {},
                    click: () => this.$refs.input.click(),
                };
            }

            return node;
        },
        onInput(e) {
            const files = [...e.target.files || []];

            this.internalValue = this.isMultiple ? files : files[0];

            // Set initialValue here otherwise isFocused
            // watcher in VTextField will emit a change
            // event whenever the component is blurred
            this.initialValue = this.internalValue;
        },
        onKeyDown(e) {
            this.$emit('keydown', e);
        },
        truncateText(str) {
            if (str.length < Number(this.truncateLength)) {
                return str;
            }
            const charsKeepOneSide = Math.floor((Number(this.truncateLength) - 1) / 2);
            return `${str.slice(0, charsKeepOneSide)}…${str.slice(str.length - charsKeepOneSide)}`;
        },
    },
});

</script>
<style lang="scss">

    $file-input-filled-padding-top: 22px !default;
    $file-input-chip-margin: 4px !default;
    $file-input-outlined-padding: 6px 0 !default;
    $file-input-outlined-dense-padding: 3px 0 !default;
    $file-input-slot-min-height: 32px !default;
    $file-input-slot-dense-min-height: 26px !default;

    /* stylelint-disable declaration-no-important,no-duplicate-selectors */
    @include theme(v-file-input) using ($material) {
        .v-file-input__text {
            color: map-deep-get($material, 'text', 'primary');

            &--placeholder {
                color: map-deep-get($material, 'text', 'secondary');
            }
        }

        &.v-input--is-disabled {
            .v-file-input__text {
                color: map-deep-get($material, 'text', 'disabled');

                .v-file-input__text--placeholder {
                    color: map-deep-get($material, 'text', 'disabled');
                }
            }
        }
    }
    // Block
    .v-file-input {
        input[type="file"] {
            position: absolute;
            left: 0;
            width: 0;
            max-width: 0;
            opacity: 0;
            pointer-events: none;
        }
    }
    // Element
    .v-file-input .v-file-input__text {
        display: flex;
        align-items: center;
        align-self: stretch;
        flex-wrap: wrap;
        width: 100%;

        &.v-file-input__text--chips {
            flex-wrap: wrap;
        }

        .v-chip {
            margin: $file-input-chip-margin;
        }
    }

    .v-file-input .v-text-field__slot {
        min-height: $file-input-slot-min-height;
    }

    .v-file-input {
        &.v-input--dense {
            .v-text-field__slot {
                min-height: $file-input-slot-dense-min-height;
            }
        }
    }

    .v-file-input.v-text-field--filled:not(.v-text-field--single-line) {
        .v-file-input__text {
            padding-top: $file-input-filled-padding-top;
        }
    }

    .v-file-input.v-text-field--outlined {
        .v-text-field__slot {
            padding: $file-input-outlined-padding;
        }

        &.v-input--dense {
            .v-text-field__slot {
                padding: $file-input-outlined-dense-padding;
            }
        }
    }

</style>
