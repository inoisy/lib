// Utilities
import { removed } from '../../utils/console';

import Vue from 'vue';

/**
 * Bootable
 * @mixin
 *
 * Used to add lazy content functionality to components
 * Looks for change in "isActive" to automatically boot
 * Otherwise can be set manually
 */

export default Vue.extend({
    name: 'Bootable',

    props: {
        eager: Boolean,
    },

    data: () => ({
        isBooted: false,
    }),

    computed: {
        hasContent() {
            return this.isBooted || this.eager || this.isActive;
        },
    },

    watch: {
        isActive() {
            this.isBooted = true;
        },
    },

    created() {
    /* istanbul ignore next */
        if ('lazy' in this.$attrs) {
            removed('lazy', this);
        }
    },

    methods: {
        showLazyContent(content) {
            return this.hasContent && content ? content() : [this.$createElement()];
        },
    },
});
