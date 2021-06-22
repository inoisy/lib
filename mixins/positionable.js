import Vue from 'vue';
import { filterObjectOnKeys } from '../utils/helpers';

const availableProps = {
    absolute: Boolean,
    bottom: Boolean,
    fixed: Boolean,
    left: Boolean,
    right: Boolean,
    top: Boolean,
};

export function factory(selected = []) {
    return Vue.extend({
        name: 'Positionable',
        props: selected.length ? filterObjectOnKeys(availableProps, selected) : availableProps,
    });
}

export default factory();
