import Vue from 'vue';

export function factory(prop = 'value', event = 'input') {
    return Vue.extend({
        name: 'Toggleable',

        model: { prop, event },

        props: {
            /* eslint-disable  vue/require-default-prop,vue/require-prop-types*/
            [prop]: { required: false },
            /* eslint-enable */
        },

        data() {
            return {
                isActive: Boolean(this[prop]),
            };
        },

        watch: {
            [prop](val) {
                this.isActive = Boolean(val);
            },
            isActive(val) {
                if (Boolean(val) !== this[prop]) {
                    this.$emit(event, val);
                }
            },
        },
    });
}

const Toggleable = factory();

export default Toggleable;
