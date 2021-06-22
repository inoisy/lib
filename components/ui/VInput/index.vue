<script>
// import './VInput.sass';

// Components
import VIcon from '../VIcon';
import VLabel from '../VLabel';
import VMessages from '../VMessages/index.vue';

// Mixins
import BindsAttrs from '../../../mixins/binds-attrs';
import Validatable from '../../../mixins/validatable';

// Utilities
import {
    convertToUnit,
    getSlot,
    kebabCase,
} from '../../../utils/helpers';
import mergeData from '../../../utils/mergeData';


import mixins from '../../../utils/mixins';

const baseMixins = mixins(BindsAttrs, Validatable);


export default baseMixins.extend({
    name: 'VInput',

    inheritAttrs: false,

    props: {
        /* eslint-disable vue/require-prop-types,vue/require-default-prop */
        appendIcon: String,
        backgroundColor: {
            type: String,
            default: '',
        },
        dense: Boolean,
        height: [Number, String],
        hideDetails: [Boolean, String],
        hint: String,
        id: String,
        label: String,
        loading: Boolean,
        persistentHint: Boolean,
        prependIcon: String,
        value: null,
        /* eslint-enable vue/require-prop-types,vue/require-default-prop */

    },

    data() {
        return {
            lazyValue: this.value,
            hasMouseDown: false,
        };
    },

    computed: {
        classes() {
            return {
                'v-input--has-state': this.hasState,
                'v-input--hide-details': !this.showDetails,
                'v-input--is-label-active': this.isLabelActive,
                'v-input--is-dirty': this.isDirty,
                'v-input--is-disabled': this.isDisabled,
                'v-input--is-focused': this.isFocused,
                // <v-switch loading>.loading === '' so we can't just cast to boolean
                'v-input--is-loading': this.loading !== false && this.loading !== null,
                'v-input--is-readonly': this.isReadonly,
                'v-input--dense': this.dense,
                ...this.themeClasses,
            };
        },
        computedId() {
            return this.id || `input-${this._uid}`;
        },
        hasDetails() {
            return this.messagesToDisplay.length > 0;
        },
        hasHint() {
            return !this.hasMessages &&
                Boolean(this.hint) &&
                (this.persistentHint || this.isFocused);
        },
        hasLabel() {
            return Boolean(this.$slots.label || this.label);
        },
        // Proxy for `lazyValue`
        // This allows an input
        // to function without
        // a provided model
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit(this.$_modelEvent, val);
            },
        },
        isDirty() {
            return Boolean(this.lazyValue);
        },
        isLabelActive() {
            return this.isDirty;
        },
        messagesToDisplay() {
            if (this.hasHint) {
                return [this.hint];
            }

            if (!this.hasMessages) {
                return [];
            }

            return this.validations.map(validation => {
                if (typeof validation === 'string') {
                    return validation;
                }

                const validationResult = validation(this.internalValue);

                return typeof validationResult === 'string' ? validationResult : '';
            }).filter(message => message !== '');
        },
        showDetails() {
            return this.hideDetails === false || this.hideDetails === 'auto' && this.hasDetails;
        },
    },

    watch: {
        value(val) {
            this.lazyValue = val;
        },
    },

    beforeCreate() {
        // v-radio-group needs to emit a different event
        this.$_modelEvent = this.$options.model && this.$options.model.event || 'input';
    },

    methods: {
        genContent() {
            return [
                this.genPrependSlot(),
                this.genControl(),
                this.genAppendSlot(),
            ];
        },
        genControl() {
            return this.$createElement('div', {
                staticClass: 'v-input__control',
                attrs: { title: this.attrs$.title },
            }, [
                this.genInputSlot(),
                this.genMessages(),
            ]);
        },
        genDefaultSlot() {
            return [
                this.genLabel(),
                this.$slots.default,
            ];
        },
        genIcon(
            type,
            cb,
            extraData = {},
        ) {
            const icon = this[`${type}Icon`];
            const eventName = `click:${kebabCase(type)}`;
            const hasListener = Boolean(this.listeners$[eventName] || cb);

            const data = mergeData({
                attrs: {
                    'aria-label': hasListener ? kebabCase(type).split('-')[0] + ' icon' : undefined,
                    color: this.validationState,
                    dark: this.dark,
                    disabled: this.isDisabled,
                    light: this.light,
                },
                on: !hasListener
                    ? undefined
                    : {
                        click: e => {
                            e.preventDefault();
                            e.stopPropagation();

                            this.$emit(eventName, e);
                            if (cb) {
                                cb(e);
                            }
                        },
                        // Container has g event that will
                        // trigger menu open if enclosed
                        mouseup: e => {
                            e.preventDefault();
                            e.stopPropagation();
                        },
                    },
            }, extraData);

            return this.$createElement('div', {
                staticClass: 'v-input__icon',
                class: type ? `v-input__icon--${kebabCase(type)}` : undefined,
            }, [
                this.$createElement(VIcon, data, icon),
            ]);
        },
        genInputSlot() {
            return this.$createElement('div', this.setBackgroundColor(this.backgroundColor, {
                staticClass: 'v-input__slot',
                style: { height: convertToUnit(this.height) },
                on: {
                    click: this.onClick,
                    mousedown: this.onMouseDown,
                    mouseup: this.onMouseUp,
                },
                ref: 'input-slot',
            }), [this.genDefaultSlot()]);
        },
        genLabel() {
            if (!this.hasLabel) {
                return null;
            }

            return this.$createElement(VLabel, {
                props: {
                    color: this.validationState,
                    dark: this.dark,
                    disabled: this.isDisabled,
                    focused: this.hasState,
                    for: this.computedId,
                    light: this.light,
                },
            }, this.$slots.label || this.label);
        },
        genMessages() {
            if (!this.showDetails) {
                return null;
            }

            return this.$createElement(VMessages, {
                props: {
                    color: this.hasHint ? '' : this.validationState,
                    dark: this.dark,
                    light: this.light,
                    value: this.messagesToDisplay,
                },
                attrs: {
                    role: this.hasMessages ? 'alert' : null,
                },
                scopedSlots: {
                    default: props => getSlot(this, 'message', props),
                },
            });
        },
        genSlot(
            type,
            location,
            slot,
        ) {
            if (!slot.length) {
                return null;
            }

            const ref = `${type}-${location}`;

            return this.$createElement('div', {
                staticClass: `v-input__${ref}`,
                ref,
            }, slot);
        },
        genPrependSlot() {
            const slot = [];

            if (this.$slots.prepend) {
                slot.push(this.$slots.prepend);
            } else if (this.prependIcon) {
                slot.push(this.genIcon('prepend'));
            }

            return this.genSlot('prepend', 'outer', slot);
        },
        genAppendSlot() {
            const slot = [];

            // Append icon for text field was really
            // an appended inner icon, v-text-field
            // will overwrite this method in order to obtain
            // backwards compat
            if (this.$slots.append) {
                slot.push(this.$slots.append);
            } else if (this.appendIcon) {
                slot.push(this.genIcon('append'));
            }

            return this.genSlot('append', 'outer', slot);
        },
        onClick(e) {
            this.$emit('click', e);
        },
        onMouseDown(e) {
            this.hasMouseDown = true;
            this.$emit('mousedown', e);
        },
        onMouseUp(e) {
            this.hasMouseDown = false;
            this.$emit('mouseup', e);
        },
    },

    render(h) {
        return h('div', this.setTextColor(this.validationState, {
            staticClass: 'v-input',
            class: this.classes,
        }), this.genContent());
    },
});

</script>

<style lang="scss">

    $input-font-size: 16px !default;
    $input-letter-spacing: normal !default;
    $input-text-align: left !default;
    $input-max-height: 32px !default;
    $input-label-height: 20px !default;
    $input-label-letter-spacing: normal !default;
    $input-prepend-append-outer-margin: 9px !default;
    $input-icon-height: 24px !default;
    $input-icon-min-width: 24px !default;
    $input-icon-width: 24px !default;
    $input-slot-margin-bottom: 8px !default;
    $input-dense-slot-margin-bottom: 4px !default;
    $input-font-weight: 500 !default;
    $input-max-height: 40px;
    $input-font-size: 16px;
    // $input-font-size-xs: 16px;
    $input-slot-margin-bottom: 8px;

    @include theme(v-input) using ($material) {
        color: $base-500;//map-deep-get($material, 'text', 'primary');

        input,
        textarea {
            color: $base-500;
            font-weight: $input-font-weight;
            // map-deep-get($material, 'text', 'primary');
        }

        input::placeholder,
        textarea::placeholder {
            color: $base-200;// map-deep-get($material, 'text', 'disabled');
        }

        &--is-disabled {
            color: $base-200;//map-deep-get($material, 'text', 'disabled');

            input,
            textarea {
                color: $base-200;//map-deep-get($material, 'text', 'disabled');
            }
        }
    }

    .v-input {
        display: flex;
        align-items: flex-start;
        flex: 1 1 auto;
        max-width: 100%;
        text-align: $input-text-align;
        font-size: $input-font-size;
        letter-spacing: $input-letter-spacing;

        // @include respond-to(xs) {
        //     font-size: $input-font-size-xs;
        // }

        .v-progress-linear {
            top: calc(100% - 1px);
            left: 0;
        }

        input {
            max-height: $input-max-height;
        }

        input,
        textarea {
            // Remove Firefox red outline
            &:invalid {
                box-shadow: none;
            }

            &:focus,
            &:active {
                outline: none;
            }
        }

        .v-label {
            height: $input-label-height;
            line-height: $input-label-height;
            letter-spacing: $input-label-letter-spacing;
        }

        &__append-outer,
        &__prepend-outer {
            display: inline-flex;
            // margin-top: 4px;
            // margin-bottom: 4px;
            // margin-top: auto;
            // margin-bottom: auto;
            margin-top: 12px;
            margin-bottom: 12px;
            line-height: 1;

            .v-icon {
                user-select: none;
            }
        }

        &__append-outer {
            margin-left: $input-prepend-append-outer-margin;
        }

        &__prepend-outer {
            margin-right: $input-prepend-append-outer-margin;
        }

        &__control {
            display: flex;
            flex-grow: 1;
            flex-wrap: wrap;
            width: 100%; // For IE11
            min-width: 0;
            height: auto;
            flex-direction: column;
        }

        &__icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 1 0 auto;
            width: $input-icon-width;
            min-width: $input-icon-min-width;
            height: $input-icon-height;

            &--clear {
                border-radius: 50%;

                .v-icon--disabled {
                    visibility: hidden;
                }
            }
        }

        &__slot {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            min-height: inherit;
            // margin-bottom: $input-slot-margin-bottom;
            color: inherit;
            transition: $primary-transition;
        }

        // &--dense > .v-input__control > .v-input__slot {
        //     margin-bottom: $input-dense-slot-margin-bottom;
        // }

        &--is-disabled:not(.v-input--is-readonly) {
            pointer-events: none;
        }

        &--is-loading > .v-input__control > .v-input__slot &:before,
        &:after {
            display: none;
        }

        &--hide-details > .v-input__control > .v-input__slot {
            margin-bottom: 0;
        }

        &--has-state {
            &.error--text .v-label {
                animation: v-shake .6s map-get($transition, 'swing');
            }
        }

        &--is-readonly {
            user-select: none;
            pointer-events: none;
        }
    }
</style>
