// Directives
import ripple from '../../directives/ripple';

import Vue from 'vue';

export default Vue.extend({
    name: 'Rippleable',

    directives: { ripple },

    props: {
        ripple: {
            type: [Boolean, Object],
            default: true,
        },
    },

    methods: {
        genRipple(data = {}) {
            if (!this.ripple) {
                return null;
            }

            data.staticClass = 'v-input--selection-controls__ripple';

            data.directives = data.directives || [];
            data.directives.push({
                name: 'ripple',
                value: { center: true },
            });

            return this.$createElement('div', data);
        },
    },
});
