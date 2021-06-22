<script>
import { convertToUnit } from '../../utils/helpers.js';
import Colorable from '../../mixins/colorable';
export default Colorable.extend({
    name: 'VProgressCircular',
    props: {
        button: Boolean,
        indeterminate: Boolean,
        rotate: {
            type: [Number, String],
            default: 0,
        },
        size: {
            type: [Number, String],
            default: 32,
        },
        width: {
            type: [Number, String],
            default: 4,
        },
        value: {
            type: [Number, String],
            default: 0,
        },
    },

    data: () => ({
        radius: 20,
        isVisible: true,
    }),

    computed: {
        calculatedSize() {
            return Number(this.size) + (this.button ? 8 : 0);
        },

        circumference() {
            return 2 * Math.PI * this.radius;
        },

        classes() {
            return {
                'v-progress-circular--indeterminate': this.indeterminate,
                'v-progress-circular--button': this.button,
            };
        },

        normalizedValue() {
            if (this.value < 0) {
                return 0;
            }

            if (this.value > 100) {
                return 100;
            }

            return parseFloat(this.value);
        },

        strokeDashArray() {
            return Math.round(this.circumference * 1000) / 1000;
        },

        strokeDashOffset() {
            return (100 - this.normalizedValue) / 100 * this.circumference + 'px';
        },

        strokeWidth() {
            return Number(this.width) / Number(this.size) * this.viewBoxSize * 2;
        },

        styles() {
            return {
                height: convertToUnit(this.calculatedSize),
                width: convertToUnit(this.calculatedSize),
            };
        },

        svgStyles() {
            return {
                transform: `rotate(${Number(this.rotate)}deg)`,
            };
        },

        viewBoxSize() {
            return this.radius / (1 - Number(this.width) / Number(this.size));
        },
    },

    methods: {
        genCircle(name, offset) {
            return this.$createElement('circle', {
                class: `v-progress-circular__${name}`,
                attrs: {
                    fill: 'transparent',
                    cx: 2 * this.viewBoxSize,
                    cy: 2 * this.viewBoxSize,
                    r: this.radius,
                    'stroke-width': this.strokeWidth,
                    'stroke-dasharray': this.strokeDashArray,
                    'stroke-dashoffset': offset,
                },
            });
        },
        genSvg() {
            const children = [
                this.indeterminate || this.genCircle('underlay', 0),
                this.genCircle('overlay', this.strokeDashOffset),
            ];

            return this.$createElement('svg', {
                style: this.svgStyles,
                attrs: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`,
                },
            }, children);
        },
        genInfo() {
            return this.$createElement('div', {
                staticClass: 'v-progress-circular__info',
            }, this.$slots.default);
        },
        onObserve(entries, observer, isIntersecting) {
            this.isVisible = isIntersecting;
        },
    },

    render(h) {
        return h('div', this.setTextColor(this.color, {
            staticClass: 'v-progress-circular',
            attrs: {
                role: 'progressbar',
                'aria-valuemin': 0,
                'aria-valuemax': 100,
                'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
            },
            class: this.classes,
            directives: [{
                name: 'intersect',
                value: this.onObserve,
            }],
            style: this.styles,
            on: this.$listeners,
        }), [
            this.genSvg(),
            this.genInfo(),
        ]);
    },
});
</script>

<style lang="scss">
    $progress-circular-rotate-animation: progress-circular-rotate 1.4s linear infinite !default;
    $progress-circular-rotate-dash: progress-circular-dash 1.4s ease-in-out infinite !default;
    $process-circular-intermediate-svg-transition: all .2s ease-in-out !default;
    $progress-circular-underlay-stroke: rgba($base-300, .4) !default;
    $progress-circular-overlay-transition: all .6s ease-in-out !default;

    .v-progress-circular {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;

        > svg {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
            margin: auto;
        }

        &--indeterminate {
            > svg {
                transform-origin: center center;
                transition: $process-circular-intermediate-svg-transition;
                animation: $progress-circular-rotate-animation;
            }

            .v-progress-circular__overlay {
                animation: $progress-circular-rotate-dash;
                stroke-linecap: round;
                stroke-dasharray: 80, 200;
                stroke-dashoffset: 0;
            }
        }

        &__info {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &__underlay {
            z-index: 1;
            stroke: $progress-circular-underlay-stroke;
        }

        &__overlay {
            z-index: 2;
            transition: $progress-circular-overlay-transition;
            stroke: currentColor;
        }

        @keyframes progress-circular-dash {
            0% {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
            }

            50% {
                stroke-dasharray: 100, 200;
                stroke-dashoffset: -15px;
            }

            100% {
                stroke-dasharray: 100, 200;
                stroke-dashoffset: -125px;
            }
        }

        @keyframes progress-circular-rotate {
            100% {
                transform: rotate(360deg);
            }
        }
    }

</style>
