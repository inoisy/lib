<script>
// Components
import VInput from '../VInput';
import VScaleTransition from '../../transitions/VScaleTransition';
// /  '../../transitions';

// Mixins
import mixins from '../../../utils/mixins';
import Loadable from '../../../mixins/loadable';

// Directives
import ClickOutside from '../../../directives/click-outside';

// Helpers
import { addOnceEventListener, deepEqual, keyCodes, createRange, convertToUnit, passiveSupported } from '../../../utils/helpers';
import { consoleWarn } from '../../../utils/console';


/* eslint-disable vue/require-default-prop,no-unused-expressions,no-eq-null */
export default mixins(VInput, Loadable).extend({
    name: 'VSlider',

    directives: {
        ClickOutside,
    },

    mixins: [Loadable],

    props: {
        disabled: Boolean,
        inverseLabel: Boolean,
        max: {
            type: [Number, String],
            default: 100,
        },
        min: {
            type: [Number, String],
            default: 0,
        },
        step: {
            type: [Number, String],
            default: 1,
        },
        thumbColor: String,
        thumbLabel: {
            type: [Boolean, String],
            default: undefined,
            validator: v => typeof v === 'boolean' || v === 'always',
        },
        thumbSize: {
            type: [Number, String],
            default: 32,
        },
        tickLabels: {
            type: Array,
            default: () => [],
        },
        ticks: {
            type: [Boolean, String],
            default: false,
            validator: v => typeof v === 'boolean' || v === 'always',
        },
        tickSize: {
            type: [Number, String],
            default: 2,
        },
        trackColor: String,
        trackFillColor: String,
        value: [Number, String],
        vertical: Boolean,
    },

    data: () => ({
        app: null,
        oldValue: null,
        thumbPressed: false,
        mouseTimeout: -1,
        isFocused: false,
        isActive: false,
        noClick: false, // Prevent click event if dragging took place, hack for #7915
    }),

    computed: {
        classes() {
            return {
                ...VInput.options.computed.classes.call(this),
                'v-input__slider': true,
                'v-input__slider--vertical': this.vertical,
                'v-input__slider--inverse-label': this.inverseLabel,
            };
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                val = isNaN(val) ? this.minValue : val;
                // Round value to ensure the
                // entire slider range can
                // be selected with step
                const value = this.roundValue(Math.min(Math.max(val, this.minValue), this.maxValue));

                if (value === this.lazyValue) {
                    return;
                }

                this.lazyValue = value;

                this.$emit('input', value);
            },
        },
        trackTransition() {
            return this.thumbPressed
                ? this.showTicks || this.stepNumeric
                    ? '0.1s cubic-bezier(0.25, 0.8, 0.5, 1)'
                    : 'none'
                : '';
        },
        minValue() {
            return parseFloat(this.min);
        },
        maxValue() {
            return parseFloat(this.max);
        },
        stepNumeric() {
            return this.step > 0 ? parseFloat(this.step) : 0;
        },
        inputWidth() {
            return (this.roundValue(this.internalValue) - this.minValue) / (this.maxValue - this.minValue) * 100;
        },
        trackFillStyles() {
            const startDir = this.vertical ? 'bottom' : 'left';
            const endDir = this.vertical ? 'top' : 'right';
            const valueDir = this.vertical ? 'height' : 'width';

            // const start = this.$vuetify.rtl ? 'auto' : '0';
            // const end = this.$vuetify.rtl ? '0' : 'auto';
            const start = '0';
            const end = 'auto';
            const value = this.isDisabled ? `calc(${this.inputWidth}% - 10px)` : `${this.inputWidth}%`;

            return {
                transition: this.trackTransition,
                [startDir]: start,
                [endDir]: end,
                [valueDir]: value,
            };
        },
        trackStyles() {
            // const startDir = this.vertical ? this.$vuetify.rtl ? 'bottom' : 'top' : this.$vuetify.rtl ? 'left' : 'right';
            const startDir = this.vertical ? 'top' : 'right';

            const endDir = this.vertical ? 'height' : 'width';

            const start = '0px';
            const end = this.isDisabled ? `calc(${100 - this.inputWidth}% - 10px)` : `calc(${100 - this.inputWidth}%)`;

            return {
                transition: this.trackTransition,
                [startDir]: start,
                [endDir]: end,
            };
        },
        showTicks() {
            return this.tickLabels.length > 0 ||
                Boolean(!this.isDisabled && this.stepNumeric && this.ticks);
        },
        numTicks() {
            return Math.ceil((this.maxValue - this.minValue) / this.stepNumeric);
        },
        showThumbLabel() {
            return !this.isDisabled && Boolean(this.thumbLabel ||
                this.$scopedSlots['thumb-label']);
        },
        computedTrackColor() {
            if (this.isDisabled) {
                return undefined;
            }
            if (this.trackColor) {
                return this.trackColor;
            }
            if (this.isDark) {
                return this.validationState;
            }
            return this.validationState || 'primary lighten-3';
        },
        computedTrackFillColor() {
            if (this.isDisabled) {
                return undefined;
            }
            if (this.trackFillColor) {
                return this.trackFillColor;
            }
            return this.validationState || this.computedColor;
        },
        computedThumbColor() {
            if (this.thumbColor) {
                return this.thumbColor;
            }
            return this.validationState || this.computedColor;
        },
    },

    watch: {
        min(val) {
            const parsed = parseFloat(val);
            parsed > this.internalValue && this.$emit('input', parsed);
        },
        max(val) {
            const parsed = parseFloat(val);
            parsed < this.internalValue && this.$emit('input', parsed);
        },
        value: {
            handler(v) {
                this.internalValue = v;
            },
        },
    },

    // If done in as immediate in
    // value watcher, causes issues
    // with vue-test-utils
    beforeMount() {
        this.internalValue = this.value;
    },

    mounted() {
        // Without a v-app, iOS does not work with body selectors
        this.app = document.querySelector('[data-app]') ||
            consoleWarn('Missing v-app or a non-body wrapping element with the [data-app] attribute', this);
    },

    methods: {
        genDefaultSlot() {
            const children = [this.genLabel()];
            const slider = this.genSlider();
            this.inverseLabel
                ? children.unshift(slider)
                : children.push(slider);

            children.push(this.genProgress());

            return children;
        },
        genSlider() {
            return this.$createElement('div', {
                class: {
                    'v-slider': true,
                    'v-slider--horizontal': !this.vertical,
                    'v-slider--vertical': this.vertical,
                    'v-slider--focused': this.isFocused,
                    'v-slider--active': this.isActive,
                    'v-slider--disabled': this.isDisabled,
                    'v-slider--readonly': this.isReadonly,
                    ...this.themeClasses,
                },
                directives: [{
                    name: 'click-outside',
                    value: this.onBlur,
                }],
                on: {
                    click: this.onSliderClick,
                    mousedown: this.onSliderMouseDown,
                    touchstart: this.onSliderMouseDown,
                },
            }, this.genChildren());
        },
        genChildren() {
            return [
                this.genInput(),
                this.genTrackContainer(),
                this.genSteps(),
                this.genThumbContainer(this.internalValue, this.inputWidth, this.isActive, this.isFocused, this.onFocus, this.onBlur),
            ];
        },
        genInput() {
            return this.$createElement('input', {
                attrs: {
                    value: this.internalValue,
                    id: this.computedId,
                    disabled: true,
                    readonly: true,
                    tabindex: -1,
                    ...this.$attrs,
                },
                // on: this.genListeners(), // TODO: do we need to attach the listeners to input?
            });
        },
        genTrackContainer() {
            const children = [
                this.$createElement('div', this.setBackgroundColor(this.computedTrackColor, {
                    staticClass: 'v-slider__track-background',
                    style: this.trackStyles,
                })),
                this.$createElement('div', this.setBackgroundColor(this.computedTrackFillColor, {
                    staticClass: 'v-slider__track-fill',
                    style: this.trackFillStyles,
                })),
            ];

            return this.$createElement('div', {
                staticClass: 'v-slider__track-container',
                ref: 'track',
            }, children);
        },
        genSteps() {
            if (!this.step || !this.showTicks) {
                return null;
            }

            const tickSize = parseFloat(this.tickSize);
            const range = createRange(this.numTicks + 1);
            // const direction = this.vertical ? 'bottom' : this.$vuetify.rtl ? 'right' : 'left';
            // const offsetDirection = this.vertical ? this.$vuetify.rtl ? 'left' : 'right' : 'top';
            const direction = this.vertical ? 'bottom' : 'left';
            const offsetDirection = this.vertical ? 'right' : 'top';

            if (this.vertical) {
                range.reverse();
            }

            const ticks = range.map(index => {
                const children = [];

                if (this.tickLabels[index]) {
                    children.push(this.$createElement('div', {
                        staticClass: 'v-slider__tick-label',
                    }, this.tickLabels[index]));
                }

                const width = index * (100 / this.numTicks);
                const filled = this.$vuetify.rtl ? 100 - this.inputWidth < width : width < this.inputWidth;

                return this.$createElement('span', {
                    key: index,
                    staticClass: 'v-slider__tick',
                    class: {
                        'v-slider__tick--filled': filled,
                    },
                    style: {
                        width: `${tickSize}px`,
                        height: `${tickSize}px`,
                        [direction]: `calc(${width}% - ${tickSize / 2}px)`,
                        [offsetDirection]: `calc(50% - ${tickSize / 2}px)`,
                    },
                }, children);
            });

            return this.$createElement('div', {
                staticClass: 'v-slider__ticks-container',
                class: {
                    'v-slider__ticks-container--always-show': this.ticks === 'always' || this.tickLabels.length > 0,
                },
            }, ticks);
        },
        genThumbContainer(
            value,
            valueWidth,
            isActive,
            isFocused,
            onFocus,
            onBlur,
            ref = 'thumb',
        ) {
            const children = [this.genThumb()];

            const thumbLabelContent = this.genThumbLabelContent(value);
            this.showThumbLabel && children.push(this.genThumbLabel(thumbLabelContent));

            return this.$createElement('div', this.setTextColor(this.computedThumbColor, {
                ref,
                key: ref,
                staticClass: 'v-slider__thumb-container',
                class: {
                    'v-slider__thumb-container--active': isActive,
                    'v-slider__thumb-container--focused': isFocused,
                    'v-slider__thumb-container--show-label': this.showThumbLabel,
                },
                style: this.getThumbContainerStyles(valueWidth),
                attrs: {
                    role: 'slider',
                    tabindex: this.isDisabled ? -1 : this.$attrs.tabindex ? this.$attrs.tabindex : 0,
                    'aria-label': this.label,
                    'aria-valuemin': this.min,
                    'aria-valuemax': this.max,
                    'aria-valuenow': this.internalValue,
                    'aria-readonly': String(this.isReadonly),
                    'aria-orientation': this.vertical ? 'vertical' : 'horizontal',
                    ...this.$attrs,
                },
                on: {
                    focus: onFocus,
                    blur: onBlur,
                    keydown: this.onKeyDown,
                },
            }), children);
        },
        genThumbLabelContent(value) {
            return this.$scopedSlots['thumb-label']
                ? this.$scopedSlots['thumb-label']({ value })
                : [this.$createElement('span', [String(value)])];
        },
        genThumbLabel(content) {
            const size = convertToUnit(this.thumbSize);

            const transform = this.vertical
                ? `translateY(20%) translateY(${Number(this.thumbSize) / 3 - 1}px) translateX(55%) rotate(135deg)`
                : 'translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg)';

            return this.$createElement(VScaleTransition, {
                props: { origin: 'bottom center' },
            }, [
                this.$createElement('div', {
                    staticClass: 'v-slider__thumb-label-container',
                    directives: [{
                        name: 'show',
                        value: this.isFocused || this.isActive || this.thumbLabel === 'always',
                    }],
                }, [
                    this.$createElement('div', this.setBackgroundColor(this.computedThumbColor, {
                        staticClass: 'v-slider__thumb-label',
                        style: {
                            height: size,
                            width: size,
                            transform,
                        },
                    }), [this.$createElement('div', content)]),
                ]),
            ]);
        },
        genThumb() {
            return this.$createElement('div', this.setBackgroundColor(this.computedThumbColor, {
                staticClass: 'v-slider__thumb',
            }));
        },
        getThumbContainerStyles(width) {
            const direction = this.vertical ? 'top' : 'left';
            // let value = this.$vuetify.rtl ? 100 - width : width;
            let value = width;

            value = this.vertical ? 100 - value : value;

            return {
                transition: this.trackTransition,
                [direction]: `${value}%`,
            };
        },
        onSliderMouseDown(e) {
            e.preventDefault();

            this.oldValue = this.internalValue;
            this.isActive = true;

            const mouseUpOptions = passiveSupported ? { passive: true, capture: true } : true;
            const mouseMoveOptions = passiveSupported ? { passive: true } : false;

            if (e.target?.matches('.v-slider__thumb-container, .v-slider__thumb-container *')) {
                this.thumbPressed = true;
            } else {
                window.clearTimeout(this.mouseTimeout);
                this.mouseTimeout = window.setTimeout(() => {
                    this.thumbPressed = true;
                }, 300);
            }

            const isTouchEvent = 'touches' in e;

            this.onMouseMove(e);
            this.app.addEventListener(isTouchEvent ? 'touchmove' : 'mousemove', this.onMouseMove, mouseMoveOptions);
            addOnceEventListener(this.app, isTouchEvent ? 'touchend' : 'mouseup', this.onSliderMouseUp, mouseUpOptions);

            this.$emit('start', this.internalValue);
        },
        onSliderMouseUp(e) {
            e.stopPropagation();
            window.clearTimeout(this.mouseTimeout);
            this.thumbPressed = false;
            const mouseMoveOptions = passiveSupported ? { passive: true } : false;
            this.app.removeEventListener('touchmove', this.onMouseMove, mouseMoveOptions);
            this.app.removeEventListener('mousemove', this.onMouseMove, mouseMoveOptions);

            this.$emit('mouseup', e);
            this.$emit('end', this.internalValue);
            if (!deepEqual(this.oldValue, this.internalValue)) {
                this.$emit('change', this.internalValue);
                this.noClick = true;
            }

            this.isActive = false;
        },
        onMouseMove(e) {
            if (e.type === 'mousemove') {
                this.thumbPressed = true;
            }
            this.internalValue = this.parseMouseMove(e);
        },
        onKeyDown(e) {
            if (!this.isInteractive) {
                return;
            }

            const value = this.parseKeyDown(e, this.internalValue);

            if (
                value == null ||
                value < this.minValue ||
                value > this.maxValue
            ) {
                return;
            }

            this.internalValue = value;
            this.$emit('change', value);
        },
        onSliderClick(e) {
            if (this.noClick) {
                this.noClick = false;
                return;
            }
            const thumb = this.$refs.thumb;
            thumb.focus();

            this.onMouseMove(e);
            this.$emit('change', this.internalValue);
        },
        onBlur(e) {
            this.isFocused = false;

            this.$emit('blur', e);
        },
        onFocus(e) {
            this.isFocused = true;

            this.$emit('focus', e);
        },
        parseMouseMove(e) {
            const start = this.vertical ? 'top' : 'left';
            const length = this.vertical ? 'height' : 'width';
            const click = this.vertical ? 'clientY' : 'clientX';

            const {
                [start]: trackStart,
                [length]: trackLength,
            } = this.$refs.track.getBoundingClientRect();
            const clickOffset = 'touches' in e ? e.touches[0][click] : e[click]; // Can we get rid of any here?

            // It is possible for left to be NaN, force to number
            let clickPos = Math.min(Math.max((clickOffset - trackStart) / trackLength, 0), 1) || 0;

            if (this.vertical) {
                clickPos = 1 - clickPos;
            }
            // if (this.$vuetify.rtl) {
            //     clickPos = 1 - clickPos;
            // }

            return parseFloat(this.min) + clickPos * (this.maxValue - this.minValue);
        },
        parseKeyDown(e, value) {
            if (!this.isInteractive) {
                return;
            }

            const { pageup, pagedown, end, home, left, right, down, up } = keyCodes;

            if (![pageup, pagedown, end, home, left, right, down, up].includes(e.keyCode)) {
                return;
            }

            e.preventDefault();
            const step = this.stepNumeric || 1;
            const steps = (this.maxValue - this.minValue) / step;
            if ([left, right, down, up].includes(e.keyCode)) {
                // const increase = this.$vuetify.rtl ? [left, up] : [right, up];

                const increase = [right, up];
                const direction = increase.includes(e.keyCode) ? 1 : -1;
                const multiplier = e.shiftKey ? 3 : e.ctrlKey ? 2 : 1;

                value += direction * step * multiplier;
            } else if (e.keyCode === home) {
                value = this.minValue;
            } else if (e.keyCode === end) {
                value = this.maxValue;
            } else {
                const direction = e.keyCode === pagedown ? 1 : -1;
                value -= direction * step * (steps > 100 ? steps / 10 : 10);
            }

            return value;
        },
        roundValue(value) {
            if (!this.stepNumeric) {
                return value;
            }
            // Format input value using the same number
            // of decimals places as in the step prop
            const trimmedStep = this.step.toString().trim();
            const decimals = trimmedStep.indexOf('.') > -1
                ? trimmedStep.length - trimmedStep.indexOf('.') - 1
                : 0;
            const offset = this.minValue % this.stepNumeric;

            const newValue = Math.round((value - offset) / this.stepNumeric) * this.stepNumeric + offset;

            return parseFloat(Math.min(newValue, this.maxValue).toFixed(decimals));
        },
    },
});
</script>
<style lang="scss">
    $chip-group-no-color-opacity: .22 !default;
    $chip-group-opacity: .32 !default;
    $slider-horizontal-left: 8px !default;
    $slider-horizontal-min-height: 32px !default;
    $slider-horizontal-right: 8px !default;
    $slider-label-margin-end: 12px !default;
    $slider-label-margin-start: 12px !default;
    $slider-state-track-background-opacity: .4 !default;
    $slider-thumb-before-opacity: .3 !default;
    $slider-thumb-border-radius: 50% !default;
    $slider-thumb-focused-size-increase: 24px !default;
    $slider-thumb-label-font-size: map-deep-get($headings, 'caption', 'size') !default;
    $slider-thumb-label-height: 32px !default;
    $slider-thumb-label-transition: .3s map-get($transition, 'fast-in-fast-out') !default;
    $slider-thumb-label-width: 32px !default;
    $slider-thumb-size: 12px !default;
    $slider-tick-border-radius: 0 !default;
    $slider-track-border-radius: 0 !default;
    $slider-track-width: 2px !default;
    $slider-transition: .3s map-get($transition, 'swing') !default;
    $slider-vertical-margin-bottom: 12px !default;
    $slider-vertical-margin-top: 12px !default;
    $slider-vertical-min-height: 150px !default;


    /* stylelint-disable declaration-no-important */
    // Theme
    @include theme(v-slider) using ($material) {
        .v-slider__track-background,
        .v-slider__track-fill,
        .v-slider__thumb {
            background: map-deep-get($material, 'slider', 'inactive');
        }
    }
    // Block
    .v-slider {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
        cursor: default;
        user-select: none;

        input {
            display: none;
            width: 100%;
            padding: 0;
            cursor: default;
        }
    }
    // Elements
    .v-slider__track-container {
        position: absolute;
        border-radius: $slider-track-border-radius;
    }

    .v-slider__track {
        &-background,
        &-fill {
            position: absolute;
            transition: $slider-transition;
        }
    }

    .v-slider__thumb-container {
        position: absolute;
        top: 50%;
        outline: none;
        transition: $slider-transition;

        &:hover {
            .v-slider__thumb:before {
                transform: scale(1);
            }
        }
    }

    .v-slider__thumb {
        position: absolute;
        top: 50%;
        left: -$slider-thumb-size / 2;
        width: $slider-thumb-size;
        height: $slider-thumb-size;
        border-radius: $slider-thumb-border-radius;
        transform: translateY(-50%);
        transition: $slider-transition;
        user-select: none;

        &:before {
            content: '';
            position: absolute;
            top: -$slider-thumb-focused-size-increase / 2;
            left: -$slider-thumb-focused-size-increase / 2;
            width: #{$slider-thumb-size + $slider-thumb-focused-size-increase};
            height: #{$slider-thumb-size + $slider-thumb-focused-size-increase};
            border-radius: $slider-thumb-border-radius;
            background: currentColor;
            color: inherit;
            opacity: $slider-thumb-before-opacity;
            transform: scale(.1);
            transition: $primary-transition;
            pointer-events: none;
        }
    }

    .v-slider__ticks-container {
        position: absolute;
    }

    .v-slider__tick {
        position: absolute;
        border-radius: $slider-tick-border-radius;
        background-color: rgba(0, 0, 0, .5);
        opacity: 0;
        // TODO: move to theme mixin?;
        transition: $slider-transition;

        &--filled {
            background-color: rgba(255, 255, 255, .5); // TODO: move to theme mixin?
        }

        &:first-child .v-slider__tick-label {
            // +ltr()
            transform: none;
        }
        // +rtl()
        //   transform: translateX(100%)

        &:last-child .v-slider__tick-label {
            // +ltr()
            transform: translateX(-100%);
        }
        // +rtl()
        //   transform: none
    }

    .v-slider__tick-label {
        position: absolute;
        user-select: none;
        white-space: nowrap;
    }

    .v-slider__thumb-label-container {
        position: absolute;
        top: 0;
        left: 0;
        transition: $slider-thumb-label-transition;
    }

    .v-slider__thumb-label {
        position: absolute;
        bottom: 100%;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        // TODO: move to theme mixin?;
        width: $slider-thumb-label-width;
        height: $slider-thumb-label-height;
        border-radius: 50% 50% 0;
        font-size: $slider-thumb-label-font-size;
        color: #fff;
        transition: $slider-thumb-label-transition;
        user-select: none;
    }
    // Modifiers
    .v-slider--horizontal {
        min-height: $slider-horizontal-min-height;
        margin-right: $slider-horizontal-right;
        margin-left: $slider-horizontal-left;

        .v-slider__track {
            &-container {
                top: 50%;
                left: 0;
                width: 100%;
                height: $slider-track-width;
                transform: translateY(-50%);
            }

            &-background,
            &-fill {
                height: 100%;
            }
        }

        .v-slider__ticks-container {
            left: 0;
            width: 100%;
            height: $slider-track-width;
        }

        .v-slider__tick {
            &:first-child .v-slider__tick-label {
                //   +ltr()
                transform: translateX(0%);
            }
            //   +rtl()
            //     transform: translateX(0%)

            &:last-child .v-slider__tick-label {
                //   +ltr()
                transform: translateX(-100%);
            }
            //   +rtl()
            //     transform: translateX(100%)

            .v-slider__tick-label {
                top: 8px;

                //   +ltr()
                transform: translateX(-50%);
            }
            //   +rtl()
            //     transform: translateX(50%)
        }

        .v-slider__thumb-label {
            // Needed for IE11 which does not
            // process translateY(calc(-20% - 12px))
            // or translate(-50%, calc(-20% - 12px))
            transform: translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg);

            > * {
                transform: rotate(-45deg);
            }
        }
    }

    .v-slider--vertical {
        min-height: $slider-vertical-min-height;
        margin-top: $slider-vertical-margin-top;
        margin-bottom: $slider-vertical-margin-bottom;

        .v-slider__track {
            &-container {
                top: 0;
                left: 50%;
                width: $slider-track-width;
                height: 100%;
                transform: translateX(-50%);
            }

            &-background,
            &-fill {
                width: 100%;
            }
        }

        .v-slider__thumb-container {
            left: 50%;
        }

        .v-slider__ticks-container {
            top: 0;
            left: 50%;
            width: $slider-track-width;
            height: 100%;
            transform: translateX(-50%);
        }

        .v-slider__tick {
            .v-slider__tick-label,
            &:first-child .v-slider__tick-label,
            &:last-child .v-slider__tick-label {
                left: 12px;
                //   +ltr()
                transform: translateY(-50%);
            }
        }
        //   +rtl()
        //     transform: translateY(-50%)
        //     right: 12px

        .v-slider__thumb-label {
            // Needed for IE11 which does not
            // process translateY(calc(-20% - 12px))
            // or translate(-50%, calc(-20% - 12px))
            // transform: translateY(20%) translateY(10px) translateX(55%) rotate(135deg)

            > * {
                transform: rotate(-135deg);
            }
        }
    }

    .v-slider__thumb-container--focused {
        .v-slider__thumb:before {
            transform: scale(1);
        }
    }

    .v-slider--active {
        .v-slider__tick {
            opacity: 1;
        }
    }

    .v-slider__thumb-container--active {
        .v-slider__thumb:before {
            transform: scale(1.5) !important;
        }
    }

    .v-slider--disabled {
        pointer-events: none;

        .v-slider__thumb {
            left: -($slider-thumb-size - 4) / 2;
            width: $slider-thumb-size - 4;
            height: $slider-thumb-size - 4;
        }

        &:before {
            display: none;
        }
    }

    .v-slider__ticks-container--always-show {
        .v-slider__tick {
            opacity: 1;
        }
    }
    // Input
    .v-input__slider {
        &.v-input--is-readonly > .v-input__control {
            pointer-events: none;
        }

        .v-input__slot .v-label {
            margin-right: $slider-label-margin-end;
            // +ltr()
            margin-left: 0;

            // +rtl()
            //   margin-right: 0
            //   margin-left: $slider-label-margin-end
        }
    }

    .v-input__slider--inverse-label {
        .v-input__slot .v-label {
            // +ltr()
            margin-right: 0;
            margin-left: $slider-label-margin-start;
        }
    }
    // +rtl()
    //   margin-left: 0
    //   margin-right: $slider-label-margin-start

    .v-input__slider--vertical {
        align-items: center;

        //   +ltr()
        flex-direction: column-reverse;

        //   +rtl()
        //     flex-direction: column

        .v-input {
            &__slot,
            &__prepend-outer,
            &__append-outer {
                margin: 0;
            }
        }

        .v-messages {
            display: none;
        }
    }

    .v-input--has-state {
        .v-slider__track-background {
            opacity: $slider-state-track-background-opacity;
        }
    }

</style>
