<script>
import Vue from 'vue';

export default Vue.extend({
    name: 'VListItemAction',

    functional: true,

    render(h, { data, children = [] }) {
        data.staticClass = data.staticClass ? `v-list-item__action ${data.staticClass}` : 'v-list-item__action';
        const filteredChild = children.filter(VNode => VNode.isComment === false && VNode.text !== ' ');
        if (filteredChild.length > 1) {
            data.staticClass += ' v-list-item__action--stack';
        }

        return h('div', data, children);
    },
});
</script>
