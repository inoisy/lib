<script>

import Vue from 'vue';

export default Vue.extend({
    name: 'VListItemIcon',

    functional: true,

    render(h, { data, children }) {
        data.staticClass = `v-list-item__icon ${data.staticClass || ''}`.trim();

        return h('div', data, children);
    },
});

</script>
