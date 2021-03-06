import Vue from 'vue';
import Ripple from '../../directives/ripple';
// import Hover from '../../directives/hover';

import { getObjectValueByPath } from '../../utils/helpers';

export default Vue.extend({
    name: 'Routable',

    directives: {
        Ripple,
        // Hover,
    },

    props: {
        /* eslint-disable  vue/require-default-prop */
        activeClass: String,
        append: Boolean,
        disabled: Boolean,
        exact: {
            type: Boolean,
            default: undefined,
        },
        exactActiveClass: String,
        link: Boolean,
        href: [String, Object],
        to: [String, Object],
        // nuxt: Boolean,
        replace: Boolean,
        ripple: {
            type: [Boolean, Object],
            default: null,
        },
        hover: {
            type: [Boolean, Object],
            default: null,
        },
        tag: String,
        target: String,
        /* eslint-enable */
    },

    data: () => ({
        isActive: false,
        proxyClass: '',
    }),

    computed: {
        classes() {
            const classes = {};

            if (this.to) {
                return classes;
            }

            if (this.activeClass) {
                classes[this.activeClass] = this.isActive;
            }
            if (this.proxyClass) {
                classes[this.proxyClass] = this.isActive;
            }

            return classes;
        },
        // computedHover() {
        //     return this.hover ?? (!this.disabled && this.isHoverable);
        // },
        computedRipple() {
            return this.ripple ?? (!this.disabled && this.isClickable);
        },
        // isHoverable() {
        //     if (this.disabled) {
        //         return false;
        //     }
        //     return true;
        // },
        isClickable() {
            if (this.disabled) {
                return false;
            }

            return Boolean(this.isLink ||
        this.$listeners.click ||
        this.$listeners['!click'] ||
        this.$attrs.tabindex);
        },
        isLink() {
            return this.to || this.href || this.link;
        },
        styles: () => ({}),
    },

    watch: {
        $route: 'onRouteChange',
    },

    methods: {
        click(e) {
            this.$emit('click', e);
        },
        generateRouteLink() {
            let exact = this.exact;
            let tag;

            const data = {
                attrs: {
                    tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : false,
                },
                class: this.classes,
                style: this.styles,
                props: {},
                directives: [{
                    name: 'ripple',
                    value: this.computedRipple,
                }],
                // , {
                //     name: 'hover',
                //     value: this.computedHover,
                // }
                [this.to ? 'nativeOn' : 'on']: {
                    ...this.$listeners,
                    click: this.click,
                },
                ref: 'link',
            };

            if (typeof this.exact === 'undefined') {
                exact = this.to === '/' ||
          this.to === Object(this.to) && this.to.path === '/';
            }

            if (this.to) {
                // Add a special activeClass hook
                // for component level styles
                let activeClass = this.activeClass;
                let exactActiveClass = this.exactActiveClass || activeClass;

                if (this.proxyClass) {
                    activeClass = `${activeClass} ${this.proxyClass}`.trim();
                    exactActiveClass = `${exactActiveClass} ${this.proxyClass}`.trim();
                }

                tag = 'nuxt-link';
                // this.nuxt ? : 'router-link';
                Object.assign(data.props, {
                    to: this.to,
                    exact,
                    activeClass,
                    exactActiveClass,
                    append: this.append,
                    replace: this.replace,
                });
            } else {
                tag = this.href && 'a' || this.tag || 'div';

                if (tag === 'a' && this.href) {
                    data.attrs.href = this.href;
                }
            }

            if (this.target) {
                data.attrs.target = this.target;
            }

            return { tag, data };
        },
        onRouteChange() {
            if (!this.to || !this.$refs.link || !this.$route) {
                return;
            }
            const activeClass = `${this.activeClass} ${this.proxyClass || ''}`.trim();

            const path = `_vnode.data.class.${activeClass}`;

            this.$nextTick(() => {
                /* istanbul ignore else */
                if (getObjectValueByPath(this.$refs.link, path)) {
                    this.toggle();
                }
            });
        },
        toggle: () => { /* noop */ },
    },
});
