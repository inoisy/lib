<script>
// Mixins
import Measurable from '../../../mixins/measurable';

// Utils
import mixins from '../../../utils/mixins';

/* eslint-disable no-unused-expressions,vue/require-default-prop,no-eq-null */

export default mixins(Measurable).extend({
    name: 'VResponsive',

    props: {
        aspectRatio: [String, Number],
        contentClass: String,
    },

    computed: {
        computedAspectRatio() {
            return Number(this.aspectRatio);
        },
        aspectStyle() {
            return this.computedAspectRatio
                ? { paddingBottom: 1 / this.computedAspectRatio * 100 + '%' }
                : undefined;
        },
        __cachedSizer() {
            if (!this.aspectStyle) {
                return [];
            }

            return this.$createElement('div', {
                style: this.aspectStyle,
                staticClass: 'v-responsive__sizer',
            });
        },
    },

    methods: {
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-responsive__content',
                class: this.contentClass,
            }, this.$slots.default);
        },
    },

    render(h) {
        return h('div', {
            staticClass: 'v-responsive',
            style: this.measurableStyles,
            on: this.$listeners,
        }, [
            this.__cachedSizer,
            this.genContent(),
        ]);
    },
});

</script>
<style lang="scss">
    @import './VResponsive.scss';
</style>
