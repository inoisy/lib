<script>

// Mixins
import Themeable, { functionalThemeClasses } from '../../../mixins/themeable';

import mixins from '../../../utils/mixins';


export default mixins(Themeable).extend({
    name: 'VCounter',

    functional: true,
    /* eslint-disable vue/require-prop-types,vue/require-default-prop */
    props: {
        value: {
            type: [Number, String],
            default: '',
        },
        max: [Number, String],
    },

    render(h, ctx) {
        const { props } = ctx;
        const max = parseInt(props.max, 10);
        const value = parseInt(props.value, 10);
        const content = max ? `${value} / ${max}` : String(props.value);
        const isGreater = max && value > max;

        return h('div', {
            staticClass: 'v-counter',
            class: {
                'error--text': isGreater,
                ...functionalThemeClasses(ctx),
            },
        }, content);
    },
});

</script>

<style lang="scss">
    // @import './_variables.scss';

    $counter-font-size: 12px !default;
    $counter-line-height: $counter-font-size !default;
    $counter-min-height: 12px !default;

    /* Theme */
    @include theme(v-counter) using ($material) {
        color: map-deep-get($material, 'text', 'secondary');
    }

    .v-counter {
        flex: 0 1 auto;
        min-height: $counter-min-height;
        font-size: $counter-font-size;
        line-height: $counter-line-height;
    }
</style>
