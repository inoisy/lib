import Vue from 'vue';

/* eslint-disable vue/require-default-prop */
export default Vue.extend({
    name: 'Returnable',

    props: {
        returnValue: null,
    },

    data: () => ({
        isActive: false,
        originalValue: null,
    }),

    watch: {
        isActive(val) {
            if (val) {
                this.originalValue = this.returnValue;
            } else {
                this.$emit('update:return-value', this.originalValue);
            }
        },
    },

    methods: {
        save(value) {
            this.originalValue = value;
            setTimeout(() => {
                this.isActive = false;
            });
        },
    },
});
