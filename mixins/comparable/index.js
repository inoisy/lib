import Vue from 'vue';
import { deepEqual } from '../../utils/helpers';

export default Vue.extend({
    name: 'Comparable',
    props: {
        valueComparator: {
            type: Function,
            default: deepEqual,
        },
    },
});
