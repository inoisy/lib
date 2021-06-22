<script>
// Components
import VIcon from '../VIcon';

// Mixins
import PickerButton from '../../../mixins/picker-button';

// Utils
import mixins from '../../../utils/mixins';

export default mixins(PickerButton).extend({
    name: 'VDatePickerTitle',

    props: {
        date: {
            type: String,
            default: '',
        },
        disabled: Boolean,
        readonly: Boolean,
        selectingYear: Boolean,
        value: {
            type: String,
        },
        year: {
            type: [Number, String],
            default: '',
        },
        yearIcon: {
            type: String,
        },
    },

    data: () => ({
        isReversing: false,
    }),

    computed: {
        computedTransition() {
            return this.isReversing ? 'picker-reverse-transition' : 'picker-transition';
        },
    },

    watch: {
        value(val, prev) {
            this.isReversing = val < prev;
        },
    },

    methods: {
        genYearIcon() {
            return this.$createElement(VIcon, {
                props: {
                    dark: true,
                },
            }, this.yearIcon);
        },
        getYearBtn() {
            return this.genPickerButton('selectingYear', true, [
                String(this.year),
                this.yearIcon ? this.genYearIcon() : null,
            ], false, 'v-date-picker-title__year');
        },
        genTitleText() {
            return this.$createElement('transition', {
                props: {
                    name: this.computedTransition,
                },
            }, [
                this.$createElement('div', {
                    domProps: { innerHTML: this.date || '&nbsp;' },
                    key: this.value,
                }),
            ]);
        },
        genTitleDate() {
            return this.genPickerButton('selectingYear', false, [this.genTitleText()], false, 'v-date-picker-title__date');
        },
    },

    render(h) {
        return h('div', {
            staticClass: 'v-date-picker-title',
            class: {
                'v-date-picker-title--disabled': this.disabled,
            },
        }, [
            this.getYearBtn(),
            this.genTitleDate(),
        ]);
    },
});

</script>
<style lang="scss">
    @import './VDatePickerTitle.scss';

    /* stylelint-disable declaration-no-important */
    .picker-transition,
    .picker-reverse-transition {
        &-enter-active,
        &-leave-active {
            transition: .3s map-get($transition, 'linear-out-slow-in');
        }

        &-enter,
        &-leave-to {
            opacity: 0;
        }

        &-leave,
        &-leave-active,
        &-leave-to {
            position: absolute !important;
        }
    }

    .picker-transition {
        &-enter {
            transform: translate(0, 100%);
        }

        &-leave-to {
            transform: translate(0, -100%);
        }
    }

    .picker-reverse-transition {
        &-enter {
            transform: translate(0, -100%);
        }

        &-leave-to {
            transform: translate(0, 100%);
        }
    }

    .picker-title-transition {
        &-enter-to,
        &-leave {
            transform: translate(0, 0);
        }

        &-enter {
            transform: translate(-100%, 0);
        }

        &-leave-to {
            opacity: 0;
            transform: translate(100%, 0);
        }

        &-leave,
        &-leave-to,
        &-leave-active {
            position: absolute !important;
        }
    }

</style>
