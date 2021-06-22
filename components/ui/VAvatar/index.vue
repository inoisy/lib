<script>
// Mixins
import Colorable from '../../../mixins/colorable';
import Measurable from '../../../mixins/measurable';
import Roundable from '../../../mixins/roundable';

// Utilities
import { convertToUnit } from '../../../utils/helpers';

import mixins from '../../../utils/mixins';

export default mixins(Colorable, Measurable, Roundable).extend({
    name: 'VAvatar',

    props: {
        left: Boolean,
        right: Boolean,
        size: {
            type: [Number, String],
            default: 48,
        },
    },

    computed: {
        classes() {
            return {
                'v-avatar--left': this.left,
                'v-avatar--right': this.right,
                ...this.roundedClasses,
            };
        },
        styles() {
            return {
                height: convertToUnit(this.size),
                minWidth: convertToUnit(this.size),
                width: convertToUnit(this.size),
                ...this.measurableStyles,
            };
        },
    },

    render(h) {
        const data = {
            staticClass: 'v-avatar',
            class: this.classes,
            style: this.styles,
            on: this.$listeners,
        };

        return h('div', this.setBackgroundColor(this.color, data), this.$slots.default);
    },
});

</script>
<style lang="scss">
    @import './_variables.scss';

    .v-avatar {
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: $avatar-border-radius;
        vertical-align: middle;
        text-align: center;
        line-height: normal;

        img,
        svg,
        .v-icon,
        .v-image,
        .v-responsive__content {
            display: inline-flex;
            width: inherit;
            height: inherit;
            border-radius: inherit;
        }
    }

</style>
