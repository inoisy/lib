<script>
// import VHover from '../../directives/hover';

// Extensions
import VSheet from './VSheet';

// Components
import VProgressCircular from './VProgressCircular';
import VIcon from './VIcon';

// Mixins
import { factory as groupableFactory } from '../../mixins/groupable';
import { factory as toggleableFactory } from '../../mixins/toggleable';
import Elevatable from '../../mixins/elevatable';
import Positionable from '../../mixins/positionable';
import Routable from '../../mixins/routable';
import Sizeable from '../../mixins/sizeable';

// Utilities
import mixins from '../../utils/mixins';
import { breaking } from '../../utils/console';

const baseMixins = mixins(VSheet, Routable, Positionable, Sizeable, groupableFactory('btnToggle'), toggleableFactory('inputValue'));

export default baseMixins.extend({
    name: 'v-btn',

    props: {
        /* eslint-disable vue/require-prop-types */
        activeClass: {
            type: String,
            default() {
                if (!this.btnToggle) {
                    return '';
                }

                return this.btnToggle.activeClass;
            },
        },
        block: Boolean,
        depressed: Boolean,
        fab: Boolean,
        icon: Boolean,
        loading: Boolean,
        outlined: Boolean,
        plain: Boolean,
        retainFocusOnClick: Boolean,
        rounded: Boolean,
        tag: {
            type: String,
            default: 'button',
        },
        text: Boolean,
        tile: Boolean,
        type: {
            type: String,
            default: 'button',
        },
        value: [Boolean, String],
        hoverColor: {
            type: String,
            // default: 'base-500',
        },
        colorPreset: {
            type: String,
            default: 'default',
        },
        content: {
            type: String,
            default: '',
        },
        iconName: {
            type: String,
            default: '',
        },
        /* eslint-enable vue/require-prop-types */
    },

    data: () => ({
        proxyClass: 'v-btn--active',

    }),

    computed: {
        classes() {
            return {
                'v-btn': true,
                [`v-btn--color-${this.colorPreset}`]: true,
                ...Routable.options.computed.classes.call(this),
                'v-btn--absolute': this.absolute,
                'v-btn--block': this.block,
                'v-btn--bottom': this.bottom,
                'v-btn--disabled': this.disabled || this.loading,
                'v-btn--is-elevated': this.isElevated,
                'v-btn--fab': this.fab,
                'v-btn--fixed': this.fixed,
                'v-btn--has-bg': this.hasBg,
                'v-btn--icon': this.icon,
                'v-btn--left': this.left,
                'v-btn--loading': this.loading,
                'v-btn--outlined': this.outlined,
                'v-btn--plain': this.plain,
                'v-btn--right': this.right,
                'v-btn--round': this.isRound,
                'v-btn--rounded': this.rounded,
                'v-btn--router': this.to,
                'v-btn--text': this.text,
                'v-btn--tile': this.tile,
                'v-btn--top': this.top,
                ...this.themeClasses,
                ...this.groupClasses,
                ...this.elevationClasses,
                ...this.sizeableClasses,

            };
        },
        computedElevation() {
            if (this.disabled) {
                return undefined;
            }
            return Elevatable.options.computed.computedElevation.call(this);
        },
        computedRipple() {
            const defaultRipple = this.icon || this.fab ? { circle: true } : true;
            if (this.disabled) {
                return false;
            } else {
                return this.ripple ?? defaultRipple;
            }
        },
        computedHover() {
            if (this.disabled || this.loading || this.text || this.colorPreset === 'default' || this.tile) {
                return false;
            }
            const isCircle = Boolean(this.icon || this.fab);
            return isCircle ? { circle: true } : true;
        },
        hasBg() {
            return !this.text && !this.plain && !this.outlined && !this.icon;
        },
        isElevated() {
            return Boolean(!this.icon &&
                !this.text &&
                !this.outlined &&
                !this.depressed &&
                !this.disabled &&
                !this.plain &&
                (this.elevation === null || Number(this.elevation) > 0));
        },
        isRound() {
            return Boolean(this.icon ||
                this.fab);
        },
        styles() {
            return {
                ...this.measurableStyles,
            };
        },
    },

    created() {
        const breakingProps = [
            ['flat', 'text'],
            ['outline', 'outlined'],
            ['round', 'rounded'],
        ];

        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            /* eslint-disable no-prototype-builtins */
            if (this.$attrs.hasOwnProperty(original)) {
                breaking(original, replacement, this);
            }
            /* eslint-enable no-prototype-builtins */
        });
    },

    methods: {
        click(e) {
            // TODO: Remove this in v3
            if (!this.retainFocusOnClick && !this.fab && e.detail) {
                this.$el.blur();
            }
            // !this.retainFocusOnClick && !this.fab && e.detail && ;
            this.$emit('click', e);
            if (this.btnToggle) {
                this.toggle();
            }
        },
        genContent() {
            let content;
            if (this.icon && this.iconName) {
                content = this.$createElement(VIcon, {
                    // staticClass: 'v-chip__filter',
                    staticClass: 'v-btn__content',
                    props: { name: this.iconName },
                }, this.iconName);
            } else {
                content = this.$createElement('span', {
                    staticClass: 'v-btn__content',
                }, this.$slots.default || this.content);
            }

            return content;
        },
        genLoader() {
            return this.$createElement('span', {
                class: 'v-btn__loader',
            }, this.$slots.loader || [this.$createElement(VProgressCircular, {
                props: {
                    indeterminate: true,
                    size: 23,
                    width: 2,
                },
            })]);
        },
    },

    render(h) {
        const children = [
            this.genContent(),
            this.loading && this.genLoader(),
        ];
        const { tag, data } = this.generateRouteLink();
        const setColor = this.hasBg
            ? this.setBackgroundColor
            : this.setTextColor;

        if (tag === 'button') {
            data.attrs.type = this.type;
            data.attrs.disabled = this.disabled;
        }
        data.attrs.value = ['string', 'number'].includes(typeof this.value)
            ? this.value
            : JSON.stringify(this.value);
        data.directives.push({
            name: 'hover',
            value: this.computedHover,
        });

        return h(tag, this.disabled ? data : setColor(this.color, data), children);
    },
});
</script>
<style lang="scss">
    // @import '../../styles/common/_colors';

    /* stylelint-disable declaration-no-important */
    $btn-active-opacity: .18 !default;
    $btn-border-radius: $border-radius-root !default;
    $btn-focus-opacity: .24 !default;
    $btn-font-weight: 500 !default;
    $btn-hover-opacity: .08 !default;
    $btn-icon-font-size: 18px !default;
    $btn-icon-padding: 12px !default;
    $btn-letter-spacing: .0892857143em !default;
    $btn-outline-border-width: thin !default;
    $btn-round-border-radius: 50% !default;
    $btn-rounded-border-radius: 28px !default;
    $btn-text-transform: uppercase !default;
    $btn-tile-border-radius: 0 !default;
    $btn-transition-duration: .28s !default;
    $btn-transition-fn: map-get($transition, 'fast-out-slow-in') !default;
    $btn-transition: opacity .2s map-get($transition, 'ease-in-out') !default;
    $btn-states: (
        'states': (
            'activated': $btn-active-opacity,
            'focus': $btn-focus-opacity,
            'hover': $btn-hover-opacity
        )
    );
    $btn-sizes: (
        'x-small': 30px,
        'small': 32px,
        'default': 56px,
        'large': 56px,
        'x-large': 56px
    );
    $btn-font-sizes: (
        'x-small': 14px,
        'small': 14px,
        'default': 16px,
        'large': 16px,
        'x-large': 16px
    );
    $fab-sizes: (
        'x-small': 32px,
        'small': 40px,
        'default': 48px,
        'large': 56px,
        'x-large': 48px
    );

    $fab-icon-sizes: (
        'x-small': 18px,
        'small': 24px,
        'default': 20px,
        'large': 28px,
        'x-large': 32px
    );

    $btn-icon-sizes: (
        'x-small': 20px,
        'small': 28px,
        'default': 32px,
        'large': 44px,
        'x-large': 52px
    );

    $btn-sizes-presets: (
        'x-small': (
            'values': (
                'height': 20px,
                'padding-left': 8px,
                'padding-right': 8px,
                'font-size': 14px,
                'line-height': 1.16,
            ),
            'medias': (
                'sm': (
                    'height': 32px,
                    'padding-left': 15px,
                    'padding-right': 15px,
                )
            )
        ),
        'small': (
            'values': (
                'height': 3.2rem,
                'padding-left': 2.4rem,
                'padding-right': 2.4rem,
                'font-size': 1.4rem,
                'line-height': 1.16,
            ),
            'medias': (
                'sm': (
                    'height': 40px,
                )
            )
        ),
        'default': (
            'values': (
                'height': 56px,
                'min-height': 56px,
                'font-size': 16px,
                'line-height': 1,
            ),
            'states':(
                'rounded':(
                    'padding-left': 40px,
                    'padding-right': 40px,
                ),
            ),
            'medias': (
                'sm': (
                    'height': 40px,
                    'min-height':40px,
                    'padding-left': 30px,
                    'padding-right': 30px,
                    'font-size': 14px,
                )
            )
        ),
        'large': (
            'values': (
                'height': 5.6rem,
                'font-size': 1.6rem,
                'line-height': 1,
            ),
            'medias': (
                'xs': (
                    'padding-left': 44px,
                    'padding-right': 44px,
                )
            )
        )
    );

    $btn-color-presets: (
        'redline': (
            'values': (
                'border-color': $redline,
                'background-color': $redline,
                'color': $milk,
            ),
            'disabled': (
                'background-color': $base-100,
                'color': $base-300,
            ),
            'hover': (
                'backgroundColor': $base-500,
                'textColor': $milk,
            ),
            'active':(
                'background-color': $base-500,
                'color': $milk
            ),
            'outlined':(
                'color': $redline,
                'border-color': $redline
            )
        ),
        'vice': (
            'values': (
                'border-color': $secondary-100,
                'background-color': $secondary-100,
                'color': $vice,
            ),
            'disabled': (
                'border-color': $secondary-100,
                'background-color': $secondary-100,
                'color': $secondary-300
            ),
            'hover':  (
                'backgroundColor': $vice,
                'textColor': $milk,
            ),
            'active':(
                'background-color': $vice,
                'color': $milk,
            ),
            'outlined':(
                'color': $vice,
                'border-color': $vice
            )
        ),
    );

    // Block
    .v-btn {
        position: relative;
        // overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: $btn-border-radius;
        outline: 0;
        vertical-align: middle;
        text-decoration: none;
        // text-indent: $btn-letter-spacing;
        // text-transform: $btn-text-transform;
        white-space: nowrap;
        // letter-spacing: $btn-letter-spacing;
        transition-duration: $btn-transition-duration;
        transition-property: box-shadow, transform, opacity;
        transition-timing-function: $btn-transition-fn;
        font-weight: $btn-font-weight;
        user-select: none;

        // @each $name, $size in $btn-font-sizes {
        //     &.v-size--#{$name} {
        //         font-size: $size;
        //     }
        // }

        &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: inherit;
            background-color: currentColor;
            color: inherit;
            opacity: 0;
            transition: $btn-transition;
            pointer-events: none;
        }

        &:not(.v-btn--disabled) {
            will-change: box-shadow;
        }

        @each $name, $sizeObject in $btn-sizes-presets {
            &.v-size--#{$name} {
                @each $propertyName, $propertyValue in map-get($sizeObject, "values") {
                    #{$propertyName}: #{$propertyValue};
                }

                @each $state, $stateValues in map-get($sizeObject, "states") {

                    @if ($state) {
                        &.v-btn--#{$state} {
                            @each $propertyName, $propertyValue in $stateValues {
                                #{$propertyName}: #{$propertyValue};
                            }
                        }
                    }
                }
            }

            @each $breakpoint, $properties in map-get($sizeObject, "medias") {
                @include respond-to($breakpoint) {
                    &.v-size--#{$name} {
                        @each $propertyName, $propertyValue in $properties {
                            #{$propertyName}: #{$propertyValue};
                        }
                    }
                }
            }
        }

        @each $name, $colorsObject in $btn-color-presets {
            &.v-btn--color-#{$name} {
                @each $propertyName, $propertyValue in map-get($colorsObject, 'values') {
                    #{$propertyName}: #{$propertyValue};
                }

                .v-hover__animation {
                    color: map-deep-get($colorsObject, 'hover', 'backgroundColor');
                }

                &.v-btn--active {
                    @each $propertyName, $propertyValue in map-get($colorsObject, "active") {
                        #{$propertyName}: #{$propertyValue};
                    }
                }

                &.v-btn--disabled {
                    @each $propertyName, $propertyValue in map-get($colorsObject, "disabled") {
                        #{$propertyName}: #{$propertyValue};
                    }
                }

                &.v-btn--outlined {
                    border-color: map-deep-get($colorsObject, 'outlined', 'border-color');
                    background-color: unset;
                    color: map-deep-get($colorsObject, 'outlined', 'color');
                }

                &.v-btn--text {
                    color: map-deep-get($colorsObject, 'outlined', 'color');
                }

                @include hover {
                    &:hover:not(.v-btn--disabled,.v-btn--text) {
                        color: map-deep-get($colorsObject, 'hover', 'textColor');
                    }
                }
            }
        }

        &.v-btn--text {
            border-color: transparent;
            border-style: solid;
            border-width: thin;
            background-color: transparent;

            &.v-btn--active {
                background-color: transparent;
            }
        }

        // &.v-btn--outlined {
        //     border: $btn-outline-border-width solid currentColor;
        //     background-color: unset;
        // }

        > .v-btn__content .v-icon {
            color: inherit;
        }

        &.v-btn--icon,
        &.v-btn--fab {
            min-width: 0;
            min-height: 0;
            padding: 0;

            @each $name, $size in $fab-icon-sizes {
                &.v-size--#{$name} {
                    .v-icon {
                        width: #{$size};
                        height: #{$size};
                        font-size: #{$size};
                    }
                }
            }
        }

        &.v-btn--icon {
            // padding: 0;
            // padding-right: 0;
            // padding-left: 0;

            @each $name, $size in $btn-icon-sizes {
                &.v-size--#{$name} {
                    width: #{$size};
                    height: #{$size};
                }
            }
        }

        &.v-btn--fab {
            &.v-btn--absolute,
            &.v-btn--fixed {
                z-index: 4;
            }

            @each $name, $size in $fab-sizes {
                &.v-size--#{$name} {
                    width: #{$size};
                    height: #{$size};

                    &.v-btn--absolute {
                        &.v-btn--bottom {
                            bottom: -#{$size / 2};
                        }

                        &.v-btn--top {
                            top: -#{$size / 2};
                        }
                    }
                }
            }
        }
    }
    // Elements
    .v-btn__content {
        // Fixes bug where IE11 moves
        // button content when clicked
        // https://stackoverflow.com/questions/10305658/prevent-button-from-shifting-during-click-in-ie
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: inherit;
        flex: 1 0 auto;
        line-height: normal;
        color: inherit;
        transition: inherit;
        transition-property: opacity;

        .v-icon.v-icon--left,
        .v-icon.v-icon--right {
            width: $btn-icon-font-size;
            height: $btn-icon-font-size;
            font-size: $btn-icon-font-size;
        }

        .v-icon--left {
            margin-right: 8px;
            margin-left: -4px;
        }

        .v-icon--right {
            margin-right: -4px;
            margin-left: 8px;
        }
    }

    .v-btn__loader {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }
    // Modifiers
    .v-btn--absolute,
    .v-btn--fixed {
        &.v-btn--right {
            right: map-get($grid-gutters, 'lg');
        }

        &.v-btn--left {
            left: map-get($grid-gutters, 'lg');
        }

        &.v-btn--top {
            top: map-get($grid-gutters, 'lg');
        }

        &.v-btn--bottom {
            bottom: map-get($grid-gutters, 'lg');
        }
    }

    .v-btn--absolute {
        position: absolute;
    }

    .v-btn--fixed {
        position: fixed;
    }

    .v-btn--block {
        display: flex;
        flex: 1 0 auto;
        min-width: 100% !important;
        max-width: auto;
    }

    .v-btn--is-elevated {
        @include elevation(2);

        &:after {
            @include elevation(4);
        }

        &:active {
            @include elevation(8);
        }

        &.v-btn--fab {
            @include elevation(6);

            &:after {
                @include elevation(8);
            }

            &:active {
                @include elevation(12);
            }
        }
    }

    .v-btn--disabled {
        pointer-events: none;
    }

    .v-btn--loading {
        pointer-events: none;
        transition: none;

        .v-btn__content {
            opacity: 0;
        }
    }

    .v-btn--outlined {
        // border: $btn-outline-border-width solid currentColor;
        border-style: solid;
        border-width: $btn-outline-border-width;
    }

    .v-btn--plain {
        &:before {
            display: none;
        }

        &:not(.v-btn--active):not(.v-btn--loading):not(:focus):not(:hover) {
            .v-btn__content {
                opacity: .62;
            }
        }
    }

    .v-btn--round {
        @include radius($btn-round-border-radius);
    }

    .v-btn--rounded {
        border-radius: 9999px;
        // @include radius($btn-rounded-border-radius);
    }

    .v-btn--tile {
        @include radius($btn-tile-border-radius);
    }

    /* stylelint-enable declaration-no-important */
</style>
