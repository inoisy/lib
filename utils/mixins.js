import Vue from 'vue';
/**
 * Returns the instance type from a VueConstructor
 * Useful for adding types when using mixins().extend()
 */
export default function mixins(...args) {
    return Vue.extend({ mixins: args });
}
