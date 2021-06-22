<script>
// Styles
// import './VSubheader.sass'

// Mixins
import Themeable from '../../../mixins/themeable';
import mixins from '../../../utils/mixins';


export default mixins(Themeable).extend({
    name: 'VSubheader',

    props: {
        inset: Boolean,
    },

    render(h) {
        return h('div', {
            staticClass: 'v-subheader',
            class: {
                'v-subheader--inset': this.inset,
                ...this.themeClasses,
            },
            attrs: this.$attrs,
            on: this.$listeners,
        }, this.$slots.default);
    },
});

</script>
<style lang="scss">
    // @import './_variables.scss';

    $subheader-inset-margin: 56px !default;
    $subheader-item-single-height: 48px !default;
    $subheader-left-padding: 16px !default;
    $subheader-right-padding: 16px !default;

    @include theme(v-subheader) using ($material) {
        color: map-deep-get($material, 'text', 'secondary');
    }

    .v-subheader {
        display: flex;
        align-items: center;
        height: $subheader-item-single-height;
        padding: 0 $subheader-right-padding 0 $subheader-left-padding;
        font-size: map-deep-get($headings, 'body-2', 'size');
        font-weight: map-deep-get($headings, 'body-2', 'weight');

        &--inset {
            margin-left: $subheader-inset-margin;
        }
    }

</style>
