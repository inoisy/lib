<script>
// Mixins
import Themeable from '../../../mixins/themeable';

// Utilities
import mixins from '../../../utils/mixins';


export default mixins(Themeable).extend({
    name: 'VApp',

    props: {
        dark: {
            type: Boolean,
            default: undefined,
        },
        id: {
            type: String,
            default: 'app',
        },
        light: {
            type: Boolean,
            default: undefined,
        },
    },

    computed: {
        isDark() {
            return this?.$nuxt?.$theme?.dark || false;
        },
    },

    // beforeCreate() {
    //     if (!this.$vuetify || this.$vuetify === this.$root) {
    //         throw new Error('Vuetify is not properly initialized, see https://vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object');
    //     }
    // },

    render(h) {
        const wrapper = h('div', { staticClass: 'v-application--wrap' }, this.$slots.default);

        return h('div', {
            staticClass: 'v-application',
            class: {
                // 'v-application--is-rtl': this?.$vuetify?.rtl,
                // 'v-application--is-ltr': !this?.$vuetify?.rtl,
                ...this.themeClasses,
            },
            attrs: { 'data-app': true },
            domProps: { id: this.id },
        }, [wrapper]);
    },
});
</script>
<style lang="scss">
    // @include theme(v-application) using ($material) {
    //     background: map-get($material, 'background');
    //     color: map-deep-get($material, 'text', 'primary');

    //     // .text {
    //     //     &--primary {
    //     //         color: map-deep-get($material, 'text', 'primary') !important;
    //     //     }

    //     //     &--secondary {
    //     //         color: map-deep-get($material, 'text', 'secondary') !important;
    //     //     }

    //     //     &--disabled {
    //     //         color: map-deep-get($material, 'text', 'disabled') !important;
    //     //     }
    //     // }
    // }

    .v-application {
        // display: flex;

        // a {
        //     cursor: pointer;
        // }

        // &--is-rtl {
        //     direction: rtl;
        // }

        &--wrap {
            position: relative;
            flex: 1 1 auto;
            max-width: 100%;
            // display: flex;
            height: 100%;
            min-height: 100%;
            backface-visibility: hidden;
            flex-direction: column;
        }
    }
    // Firefox overrides
    @-moz-document url-prefix() {
        @media print {
            .v-application {
                display: block;

                &--wrap {
                    display: block;
                }
            }
        }
    }

</style>
