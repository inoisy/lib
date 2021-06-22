<script>
// Components
import VSlideXTransition from '../transitions/VSlideXTransition';
import VFadeTransition from '../transitions/VFadeTransition';

// Directives
import intersect from '../../directives/intersect';

// Mixins
import Colorable from '../../mixins/colorable';

import { factory as positionableFactory } from '../../mixins/positionable';
import Proxyable from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable';

// Utilities
import { convertToUnit, getSlot } from '../../utils/helpers';
import mixins from '../../utils/mixins';

const baseMixins = mixins(Colorable, positionableFactory(['absolute', 'fixed', 'top', 'bottom']), Proxyable, Themeable);

export default baseMixins.extend({
    name: 'VProgressLinear',

    directives: { intersect },
    props: {
        active: {
            type: Boolean,
            default: true,
        },
        backgroundColor: {
            type: String,
            default: null,
        },
        backgroundOpacity: {
            type: [Number, String],
            default: null,
        },
        gradient: {
            type: String,
            default: null,
        },
        bufferValue: {
            type: [Number, String],
            default: 100,
        },
        color: {
            type: String,
            default: null,
        },
        height: {
            type: [Number, String],
            default: 4,
        },
        indeterminate: Boolean,
        query: Boolean,
        reverse: Boolean,
        rounded: Boolean,
        stream: Boolean,
        striped: Boolean,
        value: {
            type: [Number, String],
            default: 0,
        },
    },

    data() {
        return {
            internalLazyValue: this.value || 0,
            isVisible: true,
        };
    },

    computed: {
        __cachedBackground() {
            return this.$createElement('div', this.setBackgroundColor(this.backgroundColor || this.color, {
                staticClass: 'v-progress-linear__background',
                style: this.backgroundStyle,
            }));
        },
        __cachedBar() {
            return this.$createElement(this.computedTransition, [this.__cachedBarType]);
        },
        __cachedBarType() {
            return this.indeterminate ? this.__cachedIndeterminate : this.__cachedDeterminate;
        },
        __cachedBuffer() {
            return this.$createElement('div', {
                staticClass: 'v-progress-linear__buffer',
                style: this.styles,
            });
        },
        __cachedDeterminate() {
            return this.$createElement('div', this.setBackgroundColor(this.color, {
                staticClass: 'v-progress-linear__determinate',
                style: {
                    width: convertToUnit(this.normalizedValue, '%'),
                    ...this.gradient ? { background: this.gradient }: null,
                },
            }));
        },
        __cachedIndeterminate() {
            return this.$createElement('div', {
                staticClass: 'v-progress-linear__indeterminate',
                class: {
                    'v-progress-linear__indeterminate--active': this.active,
                },
            }, [
                this.genProgressBar('long'),
                this.genProgressBar('short'),
            ]);
        },
        __cachedStream() {
            if (!this.stream) {
                return null;
            }

            return this.$createElement('div', this.setTextColor(this.color, {
                staticClass: 'v-progress-linear__stream',
                style: {
                    width: convertToUnit(100 - this.normalizedBuffer, '%'),
                },
            }));
        },
        backgroundStyle() {
            const backgroundOpacity = this.backgroundOpacity === null
                ? this.backgroundColor ? 1 : 0.3
                : parseFloat(this.backgroundOpacity);

            return {
                opacity: backgroundOpacity,
                [this.isReversed ? 'right' : 'left']: convertToUnit(this.normalizedValue, '%'),
                width: convertToUnit(Math.max(0, this.normalizedBuffer - this.normalizedValue), '%'),
            };
        },
        classes() {
            return {
                'v-progress-linear--absolute': this.absolute,
                'v-progress-linear--fixed': this.fixed,
                'v-progress-linear--query': this.query,
                'v-progress-linear--reactive': this.reactive,
                'v-progress-linear--reverse': this.isReversed,
                'v-progress-linear--rounded': this.rounded,
                'v-progress-linear--striped': this.striped,
                'v-progress-linear--visible': this.isVisible,
                ...this.themeClasses,
            };
        },
        computedTransition() {
            return this.indeterminate ? VFadeTransition : VSlideXTransition;
        },
        isReversed() {
            return this.reverse;
        },
        normalizedBuffer() {
            return this.normalize(this.bufferValue);
        },
        normalizedValue() {
            return this.normalize(this.internalLazyValue);
        },
        reactive() {
            return Boolean(this.$listeners.change);
        },
        styles() {
            const styles = {};

            if (!this.active) {
                styles.height = 0;
            }

            if (!this.indeterminate && parseFloat(this.normalizedBuffer) !== 100) {
                styles.width = convertToUnit(this.normalizedBuffer, '%');
            }

            return styles;
        },
    },

    methods: {
        setColor(color, data) {
            this.setBackgroundColor(color, data);
        },
        genContent() {
            const slot = getSlot(this, 'default', { value: this.internalLazyValue });

            if (!slot) {
                return null;
            }

            return this.$createElement('div', {
                staticClass: 'v-progress-linear__content',
            }, slot);
        },
        genListeners() {
            const listeners = this.$listeners;

            if (this.reactive) {
                listeners.click = this.onClick;
            }

            return listeners;
        },
        genProgressBar(name) {
            return this.$createElement('div', this.setBackgroundColor(this.color, {
                staticClass: 'v-progress-linear__indeterminate',
                class: {
                    [name]: true,
                },
                ...this.gradient ? { style: { background: this.gradient } }: null,
            }));
        },
        onClick(e) {
            if (!this.reactive) {
                return;
            }

            const { width } = this.$el.getBoundingClientRect();

            this.internalValue = e.offsetX / width * 100;
        },
        onObserve(entries, observer, isIntersecting) {
            this.isVisible = isIntersecting;
        },
        normalize(value) {
            if (value < 0) {
                return 0;
            }
            if (value > 100) {
                return 100;
            }
            return parseFloat(value);
        },
    },

    render(h) {
        const data = {
            staticClass: 'v-progress-linear',
            attrs: {
                role: 'progressbar',
                'aria-valuemin': 0,
                'aria-valuemax': this.normalizedBuffer,
                'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
            },
            class: this.classes,
            directives: [{
                name: 'intersect',
                value: this.onObserve,
            }],
            style: {
                bottom: this.bottom ? 0 : undefined,
                height: this.active ? convertToUnit(this.height) : 0,
                top: this.top ? 0 : undefined,
            },
            on: this.genListeners(),
        };

        return h('div', data, [
            this.__cachedStream,
            this.__cachedBackground,
            this.__cachedBuffer,
            this.__cachedBar,
            this.genContent(),
        ]);
    },
});
</script>
<style lang="scss">
    $border-radius-root:5px;
    $progress-linear-border-radius: $border-radius-root !default;
    $progress-linear-stream-opacity: .3 !default;
    $progress-linear-stream-border-width: 4px !default;
    $progress-linear-stripe-gradient: linear-gradient(
        135deg,
        hsla(0, 0%, 100%, .25) 25%,
        transparent 0,
        transparent 50%,
        hsla(0, 0%, 100%, .25) 0,
        hsla(0, 0%, 100%, .25) 75%,
        transparent 0,
        transparent
    ) !default;
    $progress-linear-stripe-background-size: 40px 40px !default;
    // @import './_variables.scss'

    // +theme(v-progress-linear) using ($material)
    //   color: map-deep-get($material, 'text', 'primary')

    // Block
    .v-progress-linear {
        position: relative;
        overflow: hidden;
        width: 100%;
        background: transparent;
        transition: .2s map-get($transition, 'ease-in-out');

        .v-progress-linear__background {
            right: 0;
            left: auto;
        }

        .v-progress-linear__indeterminate {
            .long,
            .short {
                position: absolute;
                top: 0;
                right: auto;
                bottom: 0;
                left: 0;
                width: auto;
                height: inherit;
                background-color: inherit;
                animation-play-state: paused;
                will-change: left, right;
            }

            &--active .long {
                animation-name: indeterminate-ltr;
                animation-duration: 2.2s;
                animation-iteration-count: infinite;
            }

            &--active .short {
                animation-name: indeterminate-short-ltr;
                animation-duration: 2.2s;
                animation-iteration-count: infinite;
            }
        }
    }

    // Element
    .v-progress-linear__buffer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: inherit;
        transition: inherit;
    }

    .v-progress-linear__background {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        transition: inherit;
    }

    .v-progress-linear__content {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .v-progress-linear__determinate {
        position: absolute;
        left: 0;
        height: inherit;
        transition: inherit;
    }

    .v-progress-linear--reverse {
        .v-progress-linear__buffer {
            right: 0;
            left: auto;
        }

        .v-progress-linear__content {
            right: 0;
            left: auto;
        }

        .v-progress-linear__determinate {
            right: 0;
            left: auto;
        }

        .v-progress-linear__stream {
            right: auto;
            left: -8px;
            animation: stream-rtl .25s infinite linear;
        }

        .v-progress-linear__indeterminate {
            .long,
            .short {
                right: 0;
                left: auto;
            }

            &--active .long {
                animation-name: indeterminate-rtl;
            }

            &--active .short {
                animation-name: indeterminate-short-rtl;
            }
        }
    }

    .v-progress-linear__stream {
        position: absolute;
        top: calc(50% - #{$progress-linear-stream-border-width / 2});
        right: -8px;
        bottom: 0;
        left: auto;
        border-color: currentColor;
        border-top: $progress-linear-stream-border-width dotted;
        opacity: $progress-linear-stream-opacity;
        transition: inherit;
        animation: stream-ltr .25s infinite linear;
        animation-play-state: paused;
        pointer-events: none;
    }

    // .v-progress-linear--reverse {

    // }

    .v-progress-linear__wrapper {
        position: relative;
        overflow: hidden;
        transition: inherit;
    }
    // Modifier
    .v-progress-linear--absolute,
    .v-progress-linear--fixed {
        left: 0;
        z-index: 1;
    }

    .v-progress-linear--absolute {
        position: absolute;
    }

    .v-progress-linear--fixed {
        position: fixed;
    }

    .v-progress-linear--reactive {
        .v-progress-linear__content {
            pointer-events: none;
        }
    }

    .v-progress-linear--rounded {
        border-radius: $progress-linear-border-radius;
    }

    .v-progress-linear--striped {
        .v-progress-linear__determinate {
            background-image: $progress-linear-stripe-gradient;
            background-repeat: repeat;
            background-size: $progress-linear-stripe-background-size;
        }
    }

    .v-progress-linear--query {
        .v-progress-linear__indeterminate--active {
            .long {
                animation-name: query-ltr;
                animation-duration: 2s;
                animation-iteration-count: infinite;
            }

            .short {
                animation-name: query-short-ltr;
                animation-duration: 2s;
                animation-iteration-count: infinite;
            }
        }

        &.v-progress-linear--reverse {
            .v-progress-linear__indeterminate--active {
                .long {
                    animation-name: query-rtl;
                }

                .short {
                    animation-name: query-short-rtl;
                }
            }
        }
    }

    .v-progress-linear--visible {
        .v-progress-linear__indeterminate--active {
            .long,
            .short {
                animation-play-state: running;
            }

            .v-progress-linear__stream {
                animation-play-state: running;
            }
        }
    }

    @keyframes indeterminate-ltr {
        0% {
            right: 100%;
            left: -90%;
        }

        60% {
            right: 100%;
            left: -90%;
        }

        100% {
            right: -35%;
            left: 100%;
        }
    }

    @keyframes indeterminate-rtl {
        0% {
            right: -90%;
            left: 100%;
        }

        60% {
            right: -90%;
            left: 100%;
        }

        100% {
            right: 100%;
            left: -35%;
        }
    }

    @keyframes indeterminate-short-ltr {
        0% {
            right: 100%;
            left: -200%;
        }

        60% {
            right: -8%;
            left: 107%;
        }

        100% {
            right: -8%;
            left: 107%;
        }
    }

    @keyframes indeterminate-short-rtl {
        0% {
            right: -200%;
            left: 100%;
        }

        60% {
            right: 107%;
            left: -8%;
        }

        100% {
            right: 107%;
            left: -8%;
        }
    }

    @keyframes query-ltr {
        0% {
            right: -90%;
            left: 100%;
        }

        60% {
            right: -90%;
            left: 100%;
        }

        100% {
            right: 100%;
            left: -35%;
        }
    }

    @keyframes query-rtl {
        0% {
            right: 100%;
            left: -90%;
        }

        60% {
            right: 100%;
            left: -90%;
        }

        100% {
            right: -35%;
            left: 100%;
        }
    }

    @keyframes query-short-ltr {
        0% {
            right: -200%;
            left: 100%;
        }

        60% {
            right: 107%;
            left: -8%;
        }

        100% {
            right: 107%;
            left: -8%;
        }
    }

    @keyframes query-short-rtl {
        0% {
            right: 100%;
            left: -200%;
        }

        60% {
            right: -8%;
            left: 107%;
        }

        100% {
            right: -8%;
            left: 107%;
        }
    }

    @keyframes stream-ltr {
        to {
            transform: translateX(-8px);
        }
    }

    @keyframes stream-rtl {
        to {
            transform: translateX(8px);
        }
    }
</style>
