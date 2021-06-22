<script>
/* eslint-disable no-empty-function,no-unused-vars,vue/require-prop-types,no-prototype-builtins,new-cap,vue/require-default-prop,no-unused-expressions */

// Mixins
import { factory as GroupableFactory } from '../../../mixins/groupable';

// Utilities
import mixins from '../../../utils/mixins';
import { consoleWarn } from '../../../utils/console';

import Vue from 'vue';

export const BaseItem = Vue.extend({
    props: {
        activeClass: String,
        value: {
            required: false,
        },
    },

    data: () => ({
        isActive: false,
    }),

    methods: {
        toggle() {
            this.isActive = !this.isActive;
        },
    },

    render() {
        if (!this.$scopedSlots.default) {
            consoleWarn('v-item is missing a default scopedSlot', this);

            return null;
        }

        let element;

        /* istanbul ignore else */
        if (this.$scopedSlots.default) {
            element = this.$scopedSlots.default({
                active: this.isActive,
                toggle: this.toggle,
            });
        }

        if (Array.isArray(element) && element.length === 1) {
            element = element[0];
        }

        if (!element || Array.isArray(element) || !element.tag) {
            consoleWarn('v-item should only contain a single element', this);

            return element;
        }

        element.data = this._b(element.data || {}, element.tag, {
            class: { [this.activeClass]: this.isActive },
        });

        return element;
    },
});

export default mixins(BaseItem, GroupableFactory('itemGroup', 'v-item', 'v-item-group')).extend({
    name: 'v-item',
});

</script>
