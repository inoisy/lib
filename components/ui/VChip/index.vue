<script>

import mixins from '../../../utils/mixins';

// Components
import VExpandXTransition from '../../transitions/VExpandXTransition';
import VIcon from '../VIcon';

// Mixins
import Colorable from '../../../mixins/colorable';
import { factory as GroupableFactory } from '../../../mixins/groupable';
import Themeable from '../../../mixins/themeable';
import { factory as ToggleableFactory } from '../../../mixins/toggleable';
import Routable from '../../../mixins/routable';
import Sizeable from '../../../mixins/sizeable';

// Utilities
import { breaking } from '../../../utils/console';
/* eslint-disable vue/require-prop-types,no-prototype-builtins,new-cap,vue/require-default-prop,no-unused-expressions */
export default mixins(Colorable, Sizeable, Routable, Themeable, GroupableFactory('chipGroup'), ToggleableFactory('inputValue')).extend({
    name: 'VChip',

    props: {
        active: {
            type: Boolean,
            default: true,
        },
        activeClass: {
            type: String,
            default() {
                if (!this.chipGroup) {
                    return '';
                }

                return this.chipGroup.activeClass;
            },
        },
        close: Boolean,
        closeIcon: {
            type: String,
            default: '$delete',
        },
        closeLabel: {
            type: String,
            default: '$close',
        },
        disabled: Boolean,
        draggable: Boolean,
        filter: Boolean,
        filterIcon: {
            type: String,
            default: '$complete',
        },
        label: Boolean,
        link: Boolean,
        outlined: Boolean,
        pill: Boolean,
        tag: {
            type: String,
            default: 'span',
        },
        textColor: String,
        value: {},
    },

    data: () => ({
        proxyClass: 'v-chip--active',
    }),

    computed: {
        classes() {
            return {
                'v-chip': true,
                ...Routable.options.computed.classes.call(this),
                'v-chip--clickable': this.isClickable,
                'v-chip--disabled': this.disabled,
                'v-chip--draggable': this.draggable,
                'v-chip--label': this.label,
                'v-chip--link': this.isLink,
                'v-chip--no-color': !this.color,
                'v-chip--outlined': this.outlined,
                'v-chip--pill': this.pill,
                'v-chip--removable': this.hasClose,
                ...this.themeClasses,
                ...this.sizeableClasses,
                ...this.groupClasses,
            };
        },
        hasClose() {
            return Boolean(this.close);
        },
        isClickable() {
            return Boolean(Routable.options.computed.isClickable.call(this) ||
                this.chipGroup);
        },
    },

    created() {
        const breakingProps = [
            ['outline', 'outlined'],
            ['selected', 'input-value'],
            ['value', 'active'],
            ['@input', '@active.sync'],
        ];

        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original)) {
                breaking(original, replacement, this);
            }
        });
    },

    methods: {
        click(e) {
            this.$emit('click', e);

            this.chipGroup && this.toggle();
        },
        genFilter() {
            const children = [];

            if (this.isActive) {
                children.push(this.$createElement(VIcon, {
                    staticClass: 'v-chip__filter',
                    props: { left: true },
                }, this.filterIcon));
            }

            return this.$createElement(VExpandXTransition, children);
        },
        genClose() {
            return this.$createElement(VIcon, {
                staticClass: 'v-chip__close',
                props: {
                    right: true,
                    size: 18,
                },
                attrs: {
                    'aria-label': 'Закрыть',
                },
                on: {
                    click: e => {
                        e.stopPropagation();
                        e.preventDefault();

                        this.$emit('click:close');
                        this.$emit('update:active', false);
                    },
                },
            }, this.closeIcon);
        },
        genContent() {
            return this.$createElement('span', {
                staticClass: 'v-chip__content',
            }, [
                this.filter && this.genFilter(),
                this.$slots.default,
                this.hasClose && this.genClose(),
            ]);
        },
    },

    render(h) {
        const children = [this.genContent()];
        let { tag, data } = this.generateRouteLink();

        data.attrs = {
            ...data.attrs,
            draggable: this.draggable ? 'true' : undefined,
            tabindex: this.chipGroup && !this.disabled ? 0 : data.attrs?.tabindex,
        };
        if (data.directives) {
            data.directives.push({
                name: 'show',
                value: this.active,
            });
        }

        data = this.setBackgroundColor(this.color, data);

        const color = this.textColor || this.outlined && this.color;

        return h(tag, this.setTextColor(color, data), children);
    },
});

</script>

<style lang="scss">

    // @import '../../../styles/tools/_functions.scss';

    $chip-avatar-size: 24px !default;
    $chip-close-size: 18px !default;
    $chip-icon-margin-after: 6px !default;
    $chip-icon-margin-before: -6px !default;
    $chip-icon-right-margin-after: -4px !default;
    $chip-icon-right-margin-before: 8px !default;
    $chip-icon-size: 24px !default;
    $chip-label-border-radius: $border-radius-root !default;
    $chip-link-focus-opacity: .32 !default;
    $chip-pill-avatar-margin-after: 8px !default;
    $chip-pill-avatar-margin-before: -12px !default;
    $chip-pill-avatar-size: 32px !default;
    $chip-pill-filter-margin: 0 16px 0 0 !default;
    $chip-transition-duration: .28s !default;
    $chip-transition-fn: map-get($transition, 'fast-out-slow-in') !default;
    $icon-outlined-border-width: thin !default;
    $chip-line-height: 20px !default;
    $chip-padding: 0 12px !default;
    $chip-white-space: nowrap !default;
    $chip-disabled-opacity: .4 !default;
    $chip-filter-max-width: 24px !default;
    $chip-outlined-active-opacity: .08 !default;
    $chip-selected-opacity: .28 !default;
    $icon-sizes: () !default;
    $icon-sizes: map-deep-merge(
        (
            'x-small': (
                'font-size': 10,
                'height': 16
            ),
            'small': (
                'font-size': 12,
                'height': 24
            ),
            'default': (
                'font-size': 14,
                'height': 32
            ),
            'large': (
                'font-size': 16,
                'height': 54
            ),
            'x-large': (
                'font-size': 18,
                'height': 66
            )
        ),
        $icon-sizes
    );

    /* stylelint-disable declaration-no-important,no-duplicate-selectors */
    .v-chip:not(.v-chip--outlined) {
        &.primary,
        &.secondary,
        &.accent,
        &.success,
        &.error,
        &.warning,
        &.info {
            color: map-deep-get($material-dark, 'text', 'primary');
        }
    }

    @include theme(v-chip) using ($material) {
        border-color: map-get($material, 'dividers');
        color: map-deep-get($material, 'text', 'primary');

        &:not(.v-chip--active) {
            background: map-get($material, 'chips');
        }

        @include states($material);
    }
    // Block
    .v-chip {
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        padding: $chip-padding;
        outline: none;
        vertical-align: middle;
        text-decoration: none;
        white-space: $chip-white-space;
        line-height: $chip-line-height;
        transition-duration: $chip-transition-duration;
        transition-property: box-shadow, opacity;
        transition-timing-function: $chip-transition-fn;
        cursor: default;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: inherit;
            background-color: currentColor;
            opacity: 0;
            pointer-events: none;
        }
        // Important is needed to account for new avatar structure
        .v-avatar {
            width: $chip-avatar-size !important;
            min-width: $chip-avatar-size !important;
            height: $chip-avatar-size !important;
        }

        .v-icon {
            font-size: $chip-icon-size;
        }

        .v-avatar,
        .v-icon {
            &--left {
                margin-right: $chip-icon-margin-after;
                margin-left: $chip-icon-margin-before;
            }

            &--right {
                margin-right: $chip-icon-margin-before;
                margin-left: $chip-icon-margin-after;
            }
        }

        &:not(.v-chip--no-color) {
            .v-icon {
                color: inherit;
            }
        }
    }
    // Elements
    .v-chip {
        .v-chip__close.v-icon {
            max-width: $chip-close-size;
            max-height: $chip-close-size;
            font-size: $chip-close-size;
            user-select: none;
        }

        &.v-icon--right {
            margin-right: $chip-icon-right-margin-after;
        }

        &:hover,
        &:focus,
        &:active {
            opacity: .72;
        }

        .v-chip__content {
            display: inline-flex;
            align-items: center;
            max-width: 100%;
            height: 100%;
        }
    }
    // Modifiers
    .v-chip--active {
        .v-icon {
            color: inherit;
        }
    }

    .v-chip--link {
        &:before {
            transition: opacity $primary-transition;
        }

        &:focus:before {
            opacity: $chip-link-focus-opacity;
        }
    }

    .v-chip--clickable {
        cursor: pointer;
        user-select: none;

        &:active {
            @include elevation(2);
        }
    }

    .v-chip--disabled {
        opacity: $chip-disabled-opacity;
        pointer-events: none;
        user-select: none;
    }

    .v-chip__filter {
        // TODO: Figure out why the absence
        // of this breaks the transition
        max-width: $chip-filter-max-width;

        // Increase specificity to
        // overwrite theme style
        &.v-icon {
            color: inherit;
        }

        &.expand-x-transition-leave-active,
        &.expand-x-transition-enter {
            margin: 0;
        }
    }

    .v-chip--pill {
        .v-chip__filter {
            margin-right: $chip-pill-filter-margin;
        }

        .v-avatar {
            width: $chip-pill-avatar-size !important;
            height: $chip-pill-avatar-size !important;
        }

        .v-avatar {
            &--left {
                margin-left: $chip-pill-avatar-margin-before;
            }

            &--right {
                margin-right: $chip-pill-avatar-margin-before;
            }
        }
    }

    .v-chip--label {
        border-radius: $chip-label-border-radius !important;
    }

    .v-chip.v-chip--outlined {
        border-style: solid;
        border-width: $icon-outlined-border-width;

        &.v-chip--active:before {
            opacity: $chip-outlined-active-opacity;
        }

        .v-icon {
            color: inherit;
        }
        // Needs increased specificity
        &.v-chip.v-chip {
            background-color: transparent !important;
        }
    }
    // Needs increased specificity
    // to overwrite theme color
    .v-chip.v-chip--selected {
        background: transparent;

        &:after {
            opacity: $chip-selected-opacity;
        }
    }

    .v-chip {
        @each $name, $size in $icon-sizes {
            &.v-size--#{$name} {
                height: #{map-get($size, 'height')}px;
                border-radius: #{map-get($size, 'height') / 2}px;
                font-size: #{map-get($size, 'font-size')}px;
            }
        }
    }

</style>
