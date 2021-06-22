<template>
    <component :is="componentObj.tag"
               v-bind="componentObj.props"
               class="headerLink"
               :class="Boolean($slots.icon) && 'withIcon'"
               :style="styles"
    >
        <span
            v-if="$slots.text || text"
            class="headerLink__currentValue"
        >
            <slot name="text">{{ text }}</slot>
        </span>
        <span v-if="$slots.text || text"
              class="headerLink__hoverValue"
        >
            <slot name="text">{{ text }}</slot>
        </span>
        <span v-if="$slots.icon"
              class="headerLink__icon"
        >
            <slot name="icon"></slot>
        </span>
    </component>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            default: '',
        },
        href: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: '',
        },
        fontSize: {
            type: String,
            default: '1.4rem',
        },
    },
    computed: {
        componentObj() {
            if (this.href) {
                return {
                    tag: 'a',
                    props: {
                        href: this.href,
                    },
                };
            }
            return {
                tag: 'n-link',
                props: {
                    to: this.to,
                },
            };
        },
        styles() {
            return {
                height: this.fontSize,
                'font-size': this.fontSize,
            };
        },
    },
};
</script>

<style lang="scss">
    /* eslint-disable declaration-no-important */
    .headerLink {
        position: relative;
        overflow: hidden;
        // height: 1.4rem;
        // font-size: 1.4rem;
        line-height: 1;
        cursor: pointer;
        font-weight: 500;
        $block: &;

        &:before {
            content: '';
            display: block;
        }

        &__currentValue {
            display: inline-block;
            color: $base-500;
            transform: translateY(0) translateZ(0);
            transition: transform .6s $text-bezier;
            will-change: transform;
        }

        &__hoverValue {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            color: $base-200;
            transform: translateY(100%) translateZ(0);
            transition: transform .6s $text-bezier;
            will-change: transform;
        }

        &:hover,
        &.is-active:not(._no-active) {
            #{$block}__currentValue {
                transform: translateY(-100%) translateZ(0);
            }

            #{$block}__hoverValue {
                z-index: 0;
                transform: translateY(0) translateZ(0);
            }
        }

        &.withIcon {
            #{$block}__icon {
                display: none;
            }

            /* stylelint-disable declaration-no-important */
            @include respond-to(xs) {
                overflow: unset;
                display: flex;
                height: unset !important;

                #{$block}__hoverValue {
                    display: none;
                }

                #{$block}__currentValue {
                    display: none;
                }

                #{$block}__icon {
                    display: inline-flex;
                }
            }
        }
    }

</style>
