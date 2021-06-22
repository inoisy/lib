import Vue from 'vue';
/* eslint-disable vue/require-default-prop*/
export default Vue.extend({
    name: 'Localable',

    props: {
        locale: String,
    },

    computed: {
        currentLocale() {
            return this.locale || 'ru';
            // || this.$vuetify.lang.current;
        },
    },
});
