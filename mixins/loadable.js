import Vue from 'vue';
import VProgressLinear from '../components/ui/VProgressLinear';

/**
 * Loadable
 *
 * @mixin
 *
 * Used to add linear progress bar to components
 * Can use a default bar with a specific color
 * or designate a custom progress linear bar
 */

export default Vue.extend({
    name: 'Loadable',

    props: {
        loading: {
            type: [Boolean, String],
            default: false,
        },
        loaderHeight: {
            type: [Number, String],
            default: 2,
        },
    },

    methods: {
        genProgress() {
            if (this.loading === false) {
                return null;
            }

            return this.$slots.progress || this.$createElement(VProgressLinear, {
                props: {
                    absolute: true,
                    color: this.loading === true || this.loading === ''
                        ? this.color || 'primary'
                        : this.loading,
                    height: this.loaderHeight,
                    indeterminate: true,
                },
            });
        },
    },
});
