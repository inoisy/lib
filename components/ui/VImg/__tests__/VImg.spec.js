// Components
import VImg from '../VImg';

// Utilities
import {
    mount,
} from '@vue/test-utils';
/* eslint-disable no-unused-expressions,vue/require-default-prop,no-eq-null,getter-return */
describe('VImg.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VImg, {
            ...options,
            propsData: {
                eager: true,
                ...options.propsData,
            },
        });
    });

    const LOAD_FAILURE_SRC = 'LOAD_FAILURE_SRC';
    const LOAD_SUCCESS_SRC = 'LOAD_SUCCESS_SRC';

    beforeAll(() => {
        jest.useFakeTimers();
        Object.defineProperty(global.Image.prototype, 'src', {
            get() {},
            set(src) {
                this._currentSrc = src;
                if (src === LOAD_FAILURE_SRC) {
                    setTimeout(() => this.onerror && this.onerror(new Error('mocked error')));
                } else {
                    setTimeout(() => {
                        this._naturalWidth = 1600;
                        this._naturalHeight = 900;
                        this.onload && this.onload();
                    });
                }
            },
        });
        Object.defineProperty(global.Image.prototype, 'currentSrc', {
            get() {
                return this._currentSrc;
            },
        });
        Object.defineProperty(global.Image.prototype, 'naturalWidth', {
            get() {
                return this._naturalWidth;
            },
        });
        Object.defineProperty(global.Image.prototype, 'naturalHeight', {
            get() {
                return this._naturalHeight;
            },
        });
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should load', async () => {
        const wrapper = mountFunction({
            propsData: { src: LOAD_SUCCESS_SRC },
        });

        expect(wrapper.html()).toMatchSnapshot();

        jest.runOnlyPendingTimers();
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should display placeholders', async () => {
        const wrapper = mountFunction({
            propsData: {
                src: 'full_src',
                lazySrc: 'lazy_src',
            },
            slots: {
                placeholder: { render: h => h('div', ['loading...']) },
            },
        });

        expect(wrapper.html()).toMatchSnapshot();

        jest.runOnlyPendingTimers();
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should emit errors', () => {
        const wrapper = mountFunction({
            propsData: {
                src: LOAD_FAILURE_SRC,
            },
        });

        const error = jest.fn();
        wrapper.vm.$on('error', error);

        jest.runOnlyPendingTimers();

        expect(error).toHaveBeenCalledTimes(2);
        expect(error).toHaveBeenCalledWith(LOAD_FAILURE_SRC);
    });

    it('should have aria attributes', async () => {
        const wrapper = mountFunction({
            propsData: {
                src: LOAD_SUCCESS_SRC,
                alt: 'this is not a decorative image',
            },
        });

        jest.runOnlyPendingTimers();
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should use vuetify-loader data', async () => {
        const wrapper = mountFunction({
            propsData: {
                src: {
                    src: LOAD_SUCCESS_SRC,
                    lazySrc: 'lazySrc_auto',
                    aspect: 1,
                },
            },
        });

        jest.runOnlyPendingTimers();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should override vuetify-loader values', async () => {
        const wrapper = mountFunction({
            propsData: {
                src: {
                    src: LOAD_SUCCESS_SRC,
                    lazySrc: 'lazySrc_auto',
                    aspect: 1,
                },
                lazySrc: 'lazySrc_manual',
                aspectRatio: 2,
            },
        });

        jest.runOnlyPendingTimers();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should update src', async () => {
        const wrapper = mountFunction({
            propsData: {
                src: LOAD_SUCCESS_SRC,
            },
        });

        jest.runOnlyPendingTimers();
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();

        await wrapper.setProps({ src: LOAD_SUCCESS_SRC + 1 });

        jest.runOnlyPendingTimers();
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should update src while still loading', async () => {
        const wrapper = mountFunction({
            propsData: {
                src: LOAD_SUCCESS_SRC,
            },
        });

        expect(wrapper.html()).toMatchSnapshot();

        await wrapper.setProps({ src: LOAD_SUCCESS_SRC + 1 });

        jest.runOnlyPendingTimers();
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
    });
});
