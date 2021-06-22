<script>
/* eslint-disable vue/require-prop-types,vue/require-default-prop */

// Mixins
import Colorable from '../../mixins/colorable';
import Themeable, { functionalThemeClasses } from '../../mixins/themeable';

import mixins from '../../utils/mixins';

// Helpers
import { convertToUnit } from '../../utils/helpers';

export default mixins(Themeable).extend({
    name: 'VLabel',

    functional: true,

    props: {
        absolute: Boolean,
        color: {
            type: String,
            default: 'primary',
        },
        disabled: Boolean,
        focused: Boolean,
        for: String,
        left: {
            type: [Number, String],
            default: 0,
        },
        right: {
            type: [Number, String],
            default: 'auto',
        },
        value: Boolean,
        /* eslint-enable vue/require-prop-types,vue/require-default-prop */

    },

    render(h, ctx) {
        const { children, listeners, props } = ctx;
        const data = {
            staticClass: 'v-label',
            class: {
                'v-label--active': props.value,
                'v-label--is-disabled': props.disabled,
                ...functionalThemeClasses(ctx),
            },
            attrs: {
                for: props.for,
                'aria-hidden': !props.for,
            },
            on: listeners,
            style: {
                left: convertToUnit(props.left),
                right: convertToUnit(props.right),
                position: props.absolute ? 'absolute' : 'relative',
            },
            ref: 'label',
        };

        return h('label', Colorable.options.methods.setTextColor(props.focused && props.color, data), children);
    },
});

</script>

<style lang="scss">
    // @import '../../styles/common/_colors';
    $label-font-size: 16px !default;
    $label-line-height: 1 !default;
    $label-min-height: 8px !default;
    // $label-font-size: 1.6rem;
    $label-line-height: 1.46;
    // $label-min-height: .8rem;

    // Theme
    @include theme(v-label) using ($material) {
        // font-size: 1.6rem;
        // color: map-deep-get($material, 'text', 'secondary');
        color: $base-300;
        font-weight: 500;

        &--is-disabled {
            color: map-deep-get($material, 'text', 'disabled');
        }
    }

    .v-label {
        min-height: $label-min-height;
        font-size: $label-font-size;
        line-height: $label-line-height;
        transition: .3s map-get($transition, 'swing');

        @include respond-to(xs) {
            font-size: 14px;
        }
    }
</style>
