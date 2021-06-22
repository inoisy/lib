import Vue from 'vue';


export default Vue.extend({
    name: 'Filterable',

    props: {
        noDataText: {
            type: String,
            default: '$vuetify.noDataText',
        },
    },
});
