<script>
// Mixins
import Colorable from '../../../mixins/colorable';
import Elevatable from '../../../mixins/elevatable';
import Themeable from '../../../mixins/themeable';

// Helpers
import { convertToUnit } from '../../../utils/helpers';

import mixins from '../../../utils/mixins';


export default mixins(Colorable, Elevatable, Themeable).extend({
    name: 'VPicker',

    props: {
        flat: Boolean,
        fullWidth: Boolean,
        landscape: Boolean,
        noTitle: Boolean,
        transition: {
            type: String,
            default: 'fade-transition',
        },
        width: {
            type: [Number, String],
            default: 290,
        },
    },

    computed: {
        computedTitleColor() {
            const defaultTitleColor = this.isDark ? false : this.color || 'primary';
            return this.color || defaultTitleColor;
        },
    },

    methods: {
        genTitle() {
            return this.$createElement('div', this.setBackgroundColor(this.computedTitleColor, {
                staticClass: 'v-picker__title',
                class: {
                    'v-picker__title--landscape': this.landscape,
                },
            }), this.$slots.title);
        },
        genBodyTransition() {
            return this.$createElement('transition', {
                props: {
                    name: this.transition,
                    mode: 'out-in',
                },
            }, this.$slots.default);
        },
        genBody() {
            return this.$createElement('div', {
                staticClass: 'v-picker__body',
                class: {
                    'v-picker__body--no-title': this.noTitle,
                    ...this.themeClasses,
                },
                style: this.fullWidth
                    ? undefined
                    : {
                        width: convertToUnit(this.width),
                    },
            }, [
                this.genBodyTransition(),
            ]);
        },
        genActions() {
            return this.$createElement('div', {
                staticClass: 'v-picker__actions v-card__actions',
                class: {
                    'v-picker__actions--no-title': this.noTitle,
                },
            }, this.$slots.actions);
        },
    },

    render(h) {
        return h('div', {
            staticClass: 'v-picker v-card',
            class: {
                'v-picker--flat': this.flat,
                'v-picker--landscape': this.landscape,
                'v-picker--full-width': this.fullWidth,
                ...this.themeClasses,
                ...this.elevationClasses,
            },
        }, [
            this.$slots.title ? this.genTitle() : null,
            this.genBody(),
            this.$slots.actions ? this.genActions() : null,
        ]);
    },
});

</script>
<style lang="scss">
    // @import './VPicker.scss';
    @import '../VCard/VCard.scss';
    $picker-border-radius: $border-radius-root !default;
    $picker-title-padding: 16px !default;
    $picker-inactive-btn-opacity: .6 !default;
    $picker-active-btn-opacity: 1 !default;
    $picker-landscape-title-width: 170px !default;
    $picker-font-size: 1rem !default;

    // Theme
    @include theme(v-picker__title) using ($material) {
        background: map-deep-get($material, 'picker', 'title');
    }

    @include theme(v-picker__body) using ($material) {
        background: map-deep-get($material, 'picker', 'body');
    }

    .v-picker {
        position: relative;
        display: inline-flex;
        border-radius: $picker-border-radius;
        vertical-align: top;
        font-size: $picker-font-size;
        contain: layout style;
        flex-direction: column;
    }

    .v-picker--full-width {
        display: flex;
        width: 100%;

        > .v-picker__body {
            margin: initial;
        }
    }

    .v-picker__title {
        padding: $picker-title-padding;
        color: map-get($shades, 'white');
        border-top-left-radius: $picker-border-radius;
        border-top-right-radius: $picker-border-radius;
    }

    .v-picker__title__btn {
        transition: $primary-transition;

        &:not(.v-picker__title__btn--active) {
            opacity: $picker-inactive-btn-opacity;
            cursor: pointer;
        }

        &:hover:not(:focus) {
            opacity: 1;
        }
    }

    .v-picker__title__btn--readonly {
        pointer-events: none;
    }

    .v-picker__title__btn--active {
        opacity: $picker-active-btn-opacity;
    }

    .v-picker__body {
        position: relative;
        z-index: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex: 1 0 auto;
        height: auto;
        margin: 0 auto;
        flex-direction: column;

        > div {
            width: 100%;
        }

        &.fade-transition-leave-active {
            position: absolute;
        }
    }

    .v-picker--landscape {
        .v-picker__title {
            position: absolute;
            top: 0;

            // +ltr()
            left: 0;
            z-index: 1;
            width: $picker-landscape-title-width;
            height: 100%;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        // +rtl()
        //   right: 0

        .v-picker__body:not(.v-picker__body--no-title),
        .v-picker__actions:not(.v-picker__actions--no-title) {
            margin-right: 0;
            // +ltr()
            margin-left: $picker-landscape-title-width;
        }
        // +rtl()
        //   margin-right: $picker-landscape-title-width
        //   margin-left: 0
    }

    .v-picker--flat {
        @include elevation(0);
    }

</style>
