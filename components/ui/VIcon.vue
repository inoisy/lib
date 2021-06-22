<script>
import Vue from 'vue';

// Mixins
import BindsAttrs from '../../mixins/binds-attrs';
import Colorable from '../../mixins/colorable';
import Sizeable from '../../mixins/sizeable';
import Themeable from '../../mixins/themeable';

// Util
import { convertToUnit, keys, remapInternalIcon } from '../../utils/helpers';
import mixins from '../../utils/mixins';

function isSvgPath(icon) {
    return /^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(icon) && /[\dz]$/i.test(icon) && icon.length > 4;
}

const SIZE_MAP = {
    xSmall: '12px',
    small: '16px',
    default: '24px',
    medium: '28px',
    large: '36px',
    xLarge: '40px',
};

const VIcon = mixins(BindsAttrs, Colorable, Sizeable, Themeable).extend({
    name: 'VIcon',

    props: {
        /* eslint-disable vue/require-prop-types */

        dense: Boolean,
        disabled: Boolean,
        left: Boolean,
        right: Boolean,
        size: [Number, String],
        tag: {
            type: String,
            default: 'div',
        },
        name: {
            type: String,
        },
        /* eslint-enable vue/require-prop-types */

    },

    computed: {
        medium() {
            return false;
        },
        hasClickListener() {
            return Boolean(this.listeners$.click || this.listeners$['!click']);
        },
    },

    methods: {
        getIcon() {
            let iconName = '';
            if (this.$slots.default) {
                iconName = this.$slots.default[0].text?.trim();
            } else if (this.name) {
                iconName =this.name;
            }

            return remapInternalIcon(this, iconName);
        },
        getSize() {
            const sizes = {
                xSmall: this.xSmall,
                small: this.small,
                medium: this.medium,
                large: this.large,
                xLarge: this.xLarge,
            };

            const explicitSize = keys(sizes).find(key => sizes[key]);

            return (
                // explicitSize ||
                // && SIZE_MAP[explicitSize]
                explicitSize && SIZE_MAP[explicitSize] || convertToUnit(this.size)
            );
        },
        // Component data for both font icon and SVG wrapper span
        getDefaultData() {
            return {
                staticClass: 'v-icon notranslate',
                class: {
                    'v-icon--disabled': this.disabled,
                    'v-icon--left': this.left,
                    'v-icon--link': this.hasClickListener,
                    'v-icon--right': this.right,
                    'v-icon--dense': this.dense,
                },
                attrs: {
                    'aria-hidden': !this.hasClickListener,
                    disabled: this.hasClickListener && this.disabled,
                    type: this.hasClickListener ? 'button' : undefined,
                    ...this.attrs$,
                },
                on: this.listeners$,
            };
        },
        getSvgWrapperData() {
            const fontSize = this.getSize();
            const wrapperData = {
                ...this.getDefaultData(),
                style: fontSize
                    ? {
                        fontSize,
                        height: fontSize,
                        width: fontSize,
                    }
                    : undefined,
            };
            this.applyColors(wrapperData);

            return wrapperData;
        },
        applyColors(data) {
            data.class = { ...data.class, ...this.themeClasses };
            this.setTextColor(this.color, data);
        },
        renderFontIcon(icon, h) {
            const newChildren = [];
            const data = this.getDefaultData();

            let iconType = 'material-icons';
            // Material Icon delimiter is _
            // https://material.io/icons/
            const delimiterIndex = icon.indexOf('-');
            const isMaterialIcon = delimiterIndex <= -1;

            if (isMaterialIcon) {
                // Material icon uses ligatures.
                newChildren.push(icon);
            } else {
                iconType = icon.slice(0, delimiterIndex);
                // if (isFontAwesome5(iconType)) {
                //     iconType = '';
                // }
            }

            data.class[iconType] = true;
            data.class[icon] = !isMaterialIcon;

            const fontSize = this.getSize();
            if (fontSize) {
                data.style = { fontSize };
            }

            this.applyColors(data);

            return h(this.hasClickListener ? 'button' : this.tag, data, newChildren);
        },
        renderSvgIcon(icon, h) {
            const svgData = {
                class: 'v-icon__svg',
                attrs: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 24 24',
                    role: 'img',
                    'aria-hidden': true,
                },
            };

            const size = this.getSize();
            if (size) {
                svgData.style = {
                    fontSize: size,
                    height: size,
                    width: size,
                };
            }

            return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), [
                h('svg', svgData, [
                    h('path', {
                        attrs: {
                            d: icon,
                        },
                    }),
                ]),
            ]);
        },
        renderSvgIconComponent(
            icon,
            h,
        ) {
            const data = {
                class: {
                    'v-icon__component': true,
                },
            };

            const size = this.getSize();
            if (size) {
                data.style = {
                    fontSize: size,
                    height: size,
                    width: size,
                };
            }

            this.applyColors(data);

            const component = icon.component;
            data.props = icon.props;
            data.key=icon.key;

            return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), [
                h(component, data),
            ]);
        },
    },

    render(h) {
        const icon = this.getIcon();

        if (typeof icon === 'string') {
            if (isSvgPath(icon)) {
                return this.renderSvgIcon(icon, h);
            }
            // return this.renderFontIcon(icon, h);
        }

        return this.renderSvgIconComponent(icon, h);
    },
});

export default Vue.extend({
    name: 'VIcon',

    $_wrapperFor: VIcon,

    functional: true,

    render(h, { data, children }) {
        let iconName = '';

        // Support usage of v-text and v-html
        if (data.domProps) {
            iconName = data.domProps.textContent ||
                data.domProps.innerHTML ||
                iconName;

            // Remove nodes so it doesn't
            // overwrite our changes
            delete data.domProps.textContent;
            delete data.domProps.innerHTML;
        }

        return h(VIcon, data, iconName ? [iconName] : children);
    },
});

</script>

<style lang="scss">
    // @import '../../styles/common/_colors';
    $icon-size: 24px !default;
    $icon-size-dense: 20px !default;

    /* stylelint-disable declaration-no-important,no-duplicate-selectors */

    // Theme
    // @include theme(v-icon) using ($material) {
    //     color: map-deep-get($material, 'icons', 'active');

    //     &:focus:after {
    //         opacity: map-deep-get($material, 'states', 'focus');
    //     }

    //     &.v-icon--disabled {
    //         color: map-deep-get($material, 'icons', 'inactive') !important;
    //     }
    // }
    // Increased specificity to overwrite
    // iconfont css interference
    .v-icon {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        max-height: 100%;
        vertical-align: middle;
        text-indent: 0;
        font-size: $icon-size;
        line-height: 1;
        letter-spacing: normal;
        transition: $primary-transition, visibility 0s;
        font-feature-settings: 'liga';
        user-select: none;

        &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            display: inline-block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: currentColor;
            opacity: 0;
            transform: scale(1.3);
            transition: opacity .2s map-get($transition, 'ease-in-out');
            pointer-events: none;
        }

        &--dense {
            font-size: $icon-size-dense;
        }

        &--right {
            margin-left: map-get($grid-gutters, 'md');
        }

        &--left {
            margin-right: map-get($grid-gutters, 'md');
        }

        &.v-icon.v-icon--link {
            outline: none;
            cursor: pointer;
        }

        &--disabled {
            pointer-events: none;
        }

        &--dense {
            &__component,
            &__svg {
                height: $icon-size-dense;
            }
        }

        &__component {
            width: $icon-size;
            min-width: $icon-size;
            height: $icon-size;
        }

        &__svg {
            width: $icon-size;
            height: $icon-size;
            fill: currentColor;
        }
    }

</style>
