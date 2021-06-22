/* eslint-disable no-prototype-builtins*/

import { deprecate } from '../../utils/console';
import Vue from 'vue';

export default Vue.extend({
    name: 'Mobile',

    props: {
        mobileBreakpoint: {
            type: [Number, String],
            default() {
                // Avoid destroying unit
                // tests for users
                return this.$breakpoint
                    ? this.$breakpoint.mobileBreakpoint
                    : undefined;
            },
            validator: v => !isNaN(Number(v)) ||
        ['xs', 'sm', 'md', 'lg', 'xl'].includes(String(v))
            ,
        },
    },

    computed: {
        isMobile() {
            const {
                mobile,
                width,
                name,
                mobileBreakpoint,
            } = this.$breakpoint;

            // Check if local mobileBreakpoint matches
            // the application's mobileBreakpoint
            if (mobileBreakpoint === this.mobileBreakpoint) {
                return mobile;
            }

            const mobileWidth = parseInt(this.mobileBreakpoint, 10);
            const isNumber = !isNaN(mobileWidth);

            return isNumber
                ? width < mobileWidth
                : name === this.mobileBreakpoint;
        },
    },

    created() {
    /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('mobile-break-point')) {
            deprecate('mobile-break-point', 'mobile-breakpoint', this);
        }
    },
});
