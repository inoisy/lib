<script>
/* eslint-disable no-empty-function,no-unused-vars,vue/require-prop-types,no-prototype-builtins,new-cap,vue/require-default-prop,no-unused-expressions */

// Extensions
import VInput from '../VInput';
import { BaseItemGroup } from '../VItemGroup/VItemGroup.vue';

// Mixins
import Comparable from '../../../mixins/comparable';

import mixins from '../../../utils/mixins';

const baseMixins = mixins(Comparable, BaseItemGroup, VInput);

export default baseMixins.extend({
    name: 'VRadioGroup',

    provide() {
        return {
            radioGroup: this,
        };
    },

    props: {
        column: {
            type: Boolean,
            default: true,
        },
        height: {
            type: [Number, String],
            default: 'auto',
        },
        name: String,
        row: Boolean,
        // If no value set on VRadio
        // will match valueComparator
        // force default to null
        value: {},
    },

    computed: {
        classes() {
            return {
                ...VInput.options.computed.classes.call(this),
                'v-input--selection-controls v-input--radio-group': true,
                'v-input--radio-group--column': this.column && !this.row,
                'v-input--radio-group--row': this.row,
            };
        },
    },

    methods: {
        genDefaultSlot() {
            return this.$createElement('div', {
                staticClass: 'v-input--radio-group__input',
                attrs: {
                    id: this.id,
                    role: 'radiogroup',
                    'aria-labelledby': this.computedId,
                },
            }, VInput.options.methods.genDefaultSlot.call(this));
        },
        genInputSlot() {
            const render = VInput.options.methods.genInputSlot.call(this);

            delete render.data?.on?.click;

            return render;
        },
        genLabel() {
            const label = VInput.options.methods.genLabel.call(this);

            if (!label) {
                return null;
            }
            if (label.data?.attrs) {
                label.data.attrs.id = this.computedId;
            }

            // WAI considers this an orphaned label
            if (label.data?.attrs) {
                delete label.data?.attrs?.for;
            }

            label.tag = 'legend';

            return label;
        },
        onClick: BaseItemGroup.options.methods.onClick,
    },
});

</script>
<style lang="scss">
    @import './_variables';
    @import '../../../styles/components/_selection-controls';

    .v-input--radio-group {
        legend.v-label {
            height: auto;
            font-size: 14px;
            cursor: text;
        }

        &__input {
            display: flex;
            width: 100%;
            border: none;
            cursor: default;
        }

        &--column .v-input--radio-group__input > .v-label {
            padding-bottom: $radio-group-padding;
        }

        &--row .v-input--radio-group__input > .v-label {
            padding-right: $radio-group-padding;
        }

        &--row {
            legend {
                display: inline-block;
                align-self: center;
            }

            .v-input--radio-group__input {
                flex-direction: row;
                flex-wrap: wrap;
            }
        }

        &--column {
            legend {
                padding-bottom: $radio-group-padding;
            }

            .v-radio:not(:last-child):not(:only-child) {
                margin-bottom: $radio-group-padding;
            }

            .v-input--radio-group__input {
                flex-direction: column;
            }
        }
    }
</style>
