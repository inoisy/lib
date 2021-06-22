// Components
import VOverlay from '../../components/ui/VOverlay';

// Utilities
import {
    keyCodes,
    addOnceEventListener,
    addPassiveEventListener,
    getZIndex,
} from '../../utils/helpers';

import Vue from 'vue';

/* eslint-disable no-unused-expressions,vue/require-default-prop */
export default Vue.extend({
    name: 'Overlayable',

    props: {
        hideOverlay: Boolean,
        overlayColor: String,
        overlayOpacity: [Number, String],
    },

    data() {
        return {
            animationFrame: 0,
            overlay: null,
        };
    },

    watch: {
        hideOverlay(value) {
            if (!this.isActive) {
                return;
            }

            if (value) {
                this.removeOverlay();
            } else {
                this.genOverlay();
            }
        },
    },

    beforeDestroy() {
        this.removeOverlay();
    },

    methods: {
        createOverlay() {
            const overlay = new VOverlay({
                propsData: {
                    absolute: this.absolute,
                    value: false,
                    color: this.overlayColor,
                    opacity: this.overlayOpacity,
                },
            });

            overlay.$mount();

            const parent = this.absolute
                ? this.$el.parentNode
                : document.querySelector('[data-app]');

            parent && parent.insertBefore(overlay.$el, parent.firstChild);

            this.overlay = overlay;
        },
        genOverlay() {
            this.hideScroll();

            if (this.hideOverlay) {
                return;
            }

            if (!this.overlay) {
                this.createOverlay();
            }

            this.animationFrame = requestAnimationFrame(() => {
                if (!this.overlay) {
                    return;
                }

                if (this.activeZIndex !== undefined) {
                    this.overlay.zIndex = String(this.activeZIndex - 1);
                } else if (this.$el) {
                    this.overlay.zIndex = getZIndex(this.$el);
                }

                this.overlay.value = true;
            });

            return true;
        },
        /** removeOverlay(false) will not restore the scollbar afterwards */
        removeOverlay(showScroll = true) {
            if (this.overlay) {
                addOnceEventListener(this.overlay.$el, 'transitionend', () => {
                    if (
                        !this.overlay ||
            !this.overlay.$el ||
            !this.overlay.$el.parentNode ||
            this.overlay.value
                    ) {
                        return;
                    }

                    this.overlay.$el.parentNode.removeChild(this.overlay.$el);
                    this.overlay.$destroy();
                    this.overlay = null;
                });

                // Cancel animation frame in case
                // overlay is removed before it
                // has finished its animation
                cancelAnimationFrame(this.animationFrame);

                this.overlay.value = false;
            }

            showScroll && this.showScroll();
        },
        scrollListener(e) {
            if (e.type === 'keydown') {
                if (
                    ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
          // https://github.com/vuetifyjs/vuetify/issues/4715
          e.target.isContentEditable
                ) {
                    return;
                }

                const up = [keyCodes.up, keyCodes.pageup];
                const down = [keyCodes.down, keyCodes.pagedown];

                if (up.includes(e.keyCode)) {
                    e.deltaY = -1;
                } else if (down.includes(e.keyCode)) {
                    e.deltaY = 1;
                } else {
                    return;
                }
            }

            if (e.target === this.overlay ||
        e.type !== 'keydown' && e.target === document.body ||
        this.checkPath(e)) {
                e.preventDefault();
            }
        },
        hasScrollbar(el) {
            if (!el || el.nodeType !== Node.ELEMENT_NODE) {
                return false;
            }

            const style = window.getComputedStyle(el);
            // ['auto', 'scroll'].includes(style.overflowY!)
            return style.overflowY && ['auto', 'scroll'].includes(style.overflowY) && el.scrollHeight > el.clientHeight;
        },
        shouldScroll(el, delta) {
            if (el.scrollTop === 0 && delta < 0) {
                return true;
            }
            return el.scrollTop + el.clientHeight === el.scrollHeight && delta > 0;
        },
        isInside(el, parent) {
            if (el === parent) {
                return true;
            } else if (el === null || el === document.body) {
                return false;
            } else {
                return this.isInside(el.parentNode, parent);
            }
        },
        checkPath(e) {
            const path = e.path || this.composedPath(e);
            const delta = e.deltaY;

            if (e.type === 'keydown' && path[0] === document.body) {
                const dialog = this.$refs.dialog;
                // getSelection returns null in firefox in some edge cases, can be ignored
                const selected = window.getSelection()?.anchorNode;
                if (dialog && this.hasScrollbar(dialog) && this.isInside(selected, dialog)) {
                    return this.shouldScroll(dialog, delta);
                }
                return true;
            }

            for (let index = 0; index < path.length; index++) {
                const el = path[index];

                if (el === document) {
                    return true;
                }
                if (el === document.documentElement) {
                    return true;
                }
                if (el === this.$refs.content) {
                    return true;
                }

                if (this.hasScrollbar(el)) {
                    return this.shouldScroll(el, delta);
                }
            }

            return true;
        },
        /**
     * Polyfill for Event.prototype.composedPath
     */
        composedPath(e) {
            if (e.composedPath) {
                return e.composedPath();
            }

            const path = [];
            let el = e.target;

            while (el) {
                path.push(el);

                if (el.tagName === 'HTML') {
                    path.push(document);
                    path.push(window);

                    return path;
                }

                el.parentElement && (el = el.parentElement);
            }
            return path;
        },
        hideScroll() {
            if (this.$breakpoint.smAndDown) {
                document.documentElement?.classList.add('overflow-y-hidden');
            } else {
                addPassiveEventListener(window, 'wheel', this.scrollListener, { passive: false });
                window.addEventListener('keydown', this.scrollListener);
            }
        },
        showScroll() {
            document.documentElement?.classList.remove('overflow-y-hidden');
            window.removeEventListener('wheel', this.scrollListener);
            window.removeEventListener('keydown', this.scrollListener);
        },
    },
});
