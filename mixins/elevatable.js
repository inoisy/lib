import Vue from 'vue';

export default Vue.extend({
    name: 'Elevatable',

    props: {
        /* eslint-disable  vue/require-default-prop */
        elevation: [Number, String],
        /* eslint-enable */
    },

    computed: {
        computedElevation() {
            return this.elevation;
        },
        elevationClasses() {
            const elevation = this.computedElevation;

            if (elevation === null) {
                return {};
            }
            if (isNaN(parseInt(elevation, 10))) {
                return {};
            }
            return { [`elevation-${this.elevation}`]: true };
        },
    },
});
