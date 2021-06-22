import Vue from 'vue';
export function factory(
    prop = 'value',
    event = 'change',
) {
    return Vue.extend({
        name: 'Proxyable',

        model: {
            prop,
            event,
        },
        props: {
            /* eslint-disable-next-line vue/require-default-prop,vue/require-prop-types */
            [prop]: {
                required: false,
            },
        },

        data() {
            return {
                internalLazyValue: this[prop],
            };
        },

        computed: {
            internalValue: {
                get() {
                    return this.internalLazyValue;
                },
                set(val) {
                    if (val === this.internalLazyValue) {
                        return;
                    }

                    this.internalLazyValue = val;

                    this.$emit(event, val);
                },
            },
        },

        watch: {
            [prop](val) {
                this.internalLazyValue = val;
            },
        },
    });
}

const Proxyable = factory();

export default Proxyable;
