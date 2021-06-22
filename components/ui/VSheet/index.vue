<script>
// Mixins
import BindsAttrs from '../../../mixins/binds-attrs';
import Colorable from '../../../mixins/colorable';
import Elevatable from '../../../mixins/elevatable';
import Measurable from '../../../mixins/measurable';
import Roundable from '../../../mixins/roundable';
import Themeable from '../../../mixins/themeable';

// Helpers
import mixins from '../../../utils/mixins';

export default mixins(BindsAttrs, Colorable, Elevatable, Measurable, Roundable, Themeable).extend({
    name: 'VSheet',

    props: {
        outlined: Boolean,
        shaped: Boolean,
        tag: {
            type: String,
            default: 'div',
        },
    },

    computed: {
        classes() {
            return {
                'v-sheet': true,
                'v-sheet--outlined': this.outlined,
                'v-sheet--shaped': this.shaped,
                ...this.themeClasses,
                ...this.elevationClasses,
                ...this.roundedClasses,
            };
        },
        styles() {
            return this.measurableStyles;
        },
    },

    render(h) {
        const data = {
            class: this.classes,
            style: this.styles,
            on: this.listeners$,
        };

        return h(this.tag, this.setBackgroundColor(this.color, data), this.$slots.default);
    },
});
</script>

<style lang="scss">

    $sheet-border-radius: 0 !default;
    $sheet-elevation: 0 !default;
    $sheet-outlined-border-width: thin !default;
    $sheet-shaped-border-radius: map-get($rounded, 'xl') $sheet-border-radius !default;

    @include theme(v-sheet) using ($material) {
        border-color: map-get($material, 'cards');
        background-color: map-get($material, 'cards');
        color: map-deep-get($material, 'text', 'primary');

        &--outlined {
            border: $sheet-outlined-border-width solid map-get($material, 'dividers');
        }
    }
    // Sheet
    .v-sheet {
        @include paper($sheet-elevation, $sheet-border-radius, $sheet-shaped-border-radius);
    }

</style>
