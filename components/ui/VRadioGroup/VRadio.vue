<script>
/* eslint-disable no-empty-function,no-unused-vars,vue/require-prop-types,no-prototype-builtins,new-cap,vue/require-default-prop,no-unused-expressions */

// Components
import VLabel from '../VLabel';
import VIcon from '../VIcon';
import VInput from '../VInput';

// Mixins
import BindsAttrs from '../../../mixins/binds-attrs';
import Colorable from '../../../mixins/colorable';
import { factory as GroupableFactory } from '../../../mixins/groupable';
import Rippleable from '../../../mixins/rippleable';
import Themeable from '../../../mixins/themeable';
import Selectable, { prevent } from '../../../mixins/selectable';

// Utilities
import { getSlot } from '../../../utils/helpers';

import mixins from '../../../utils/mixins';
import { mergeListeners } from '../../../utils/mergeData';

const baseMixins = mixins(BindsAttrs, Colorable, Rippleable, GroupableFactory('radioGroup'), Themeable);

export default baseMixins.extend({
    name: 'VRadio',

    inheritAttrs: false,

    props: {
        disabled: Boolean,
        id: String,
        label: String,
        name: String,
        offIcon: {
            type: String,
            default: '$radioOff',
        },
        onIcon: {
            type: String,
            default: '$radioOn',
        },
        readonly: Boolean,
        value: {
            default: null,
        },
    },

    data() {
        return {
            isFocused: false,
        };
    },

    computed: {
        classes() {
            return {
                'v-radio--is-disabled': this.isDisabled,
                'v-radio--is-focused': this.isFocused,
                ...this.themeClasses,
                ...this.groupClasses,
            };
        },
        computedColor() {
            return Selectable.options.computed.computedColor.call(this);
        },
        computedIcon() {
            return this.isActive
                ? this.onIcon
                : this.offIcon;
        },
        computedId() {
            return VInput.options.computed.computedId.call(this);
        },
        hasLabel: VInput.options.computed.hasLabel,
        hasState() {
            return (this.radioGroup || {}).hasState;
        },
        isDisabled() {
            return this.disabled ||
                Boolean(this.radioGroup) &&
                this.radioGroup.isDisabled;
        },
        isReadonly() {
            return this.readonly ||
                Boolean(this.radioGroup) &&
                this.radioGroup.isReadonly;
        },
        computedName() {
            if (this.name || !this.radioGroup) {
                return this.name;
            }

            return this.radioGroup.name || `radio-${this.radioGroup._uid}`;
        },
        rippleState() {
            return Selectable.options.computed.rippleState.call(this);
        },
        validationState() {
            return (this.radioGroup || {}).validationState || this.computedColor;
        },
    },

    methods: {
        genInput(args) {
            // We can't actually use the mixin directly because
            // it's made for standalone components, but its
            // genInput method is exactly what we need
            return Selectable.options.methods.genInput.call(this, 'radio', args);
        },
        genLabel() {
            if (!this.hasLabel) {
                return null;
            }

            return this.$createElement(VLabel, {
                on: {
                    // Label shouldn't cause the input to focus
                    click: prevent,
                },
                attrs: {
                    for: this.computedId,
                },
                props: {
                    color: this.validationState,
                    focused: this.hasState,
                },
            }, getSlot(this, 'label') || this.label);
        },
        genRadio() {
            const { title, ...radioAttrs } = this.attrs$;

            return this.$createElement('div', {
                staticClass: 'v-input--selection-controls__input',
            }, [
                this.$createElement(VIcon, this.setTextColor(this.validationState, {
                    props: {
                        dense: this.radioGroup && this.radioGroup.dense,
                    },
                }), this.computedIcon),
                this.genInput({
                    name: this.computedName,
                    value: this.value,
                    ...radioAttrs,
                }),
                this.genRipple(this.setTextColor(this.rippleState)),
            ]);
        },
        onFocus(e) {
            this.isFocused = true;
            this.$emit('focus', e);
        },
        onBlur(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        },
        onChange() {
            if (this.isDisabled || this.isReadonly || this.isActive) {
                return;
            }

            this.toggle();
        },
        onKeydown: () => {}, // Override default with noop
    },

    render(h) {
        const data = {
            staticClass: 'v-radio',
            class: this.classes,
            on: mergeListeners({
                click: this.onChange,
            }, this.listeners$),
            attrs: { title: this.attrs$.title },
        };

        return h('div', data, [
            this.genRadio(),
            this.genLabel(),
        ]);
    },
});

</script>
<style lang="scss">
    @import './_variables';


    /* stylelint-disable declaration-no-important,no-duplicate-selectors */

    @include theme(v-radio) using ($material) {
        &--is-disabled {
            label {
                color: map-deep-get($material, 'text', 'disabled');
            }

            .v-icon {
                // needed for helper override
                color: map-deep-get($material, 'selection-controls', 'disabled') !important;
            }
        }
    }

    .v-radio {
        display: flex;
        align-items: center;
        height: auto;
        outline: none;

        &--is-disabled {
            cursor: default;
            pointer-events: none;
        }
    }

    .v-input--radio-group.v-input--radio-group--row {
        .v-radio {
            margin-right: $radio-margin-right;
        }
    }
</style>
