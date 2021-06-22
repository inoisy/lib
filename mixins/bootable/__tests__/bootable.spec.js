// Components
import Bootable from '../index';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('Bootable.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount({
            mixins: [Bootable],
            render: h => h('div'),
        }, {
            ...options,
        });
    });

    it('should be booted after activation', async () => {
        const wrapper = mountFunction({
            data: () => ({
                isActive: false,
            }),
        });

        expect(wrapper.vm.isBooted).toBe(false);
        wrapper.vm.isActive = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isBooted).toBe(true);
    });

    it('should return lazy content', async () => {
        const wrapper = mountFunction({
            propsData: {
                eager: true,
            },
        });

        expect(wrapper.vm.showLazyContent(() => 'content')).toBe('content');

        const wrapperLazy = mountFunction({
            data: () => ({
                isActive: false,
            }),
        });

        expect(wrapperLazy.vm.showLazyContent(() => 'content')).toMatchObject([{ isComment: true }]);
        wrapperLazy.vm.isActive = true;
        await wrapper.vm.$nextTick();
        expect(wrapperLazy.vm.showLazyContent(() => 'content')).toBe('content');
        wrapperLazy.vm.isActive = false;
        await wrapper.vm.$nextTick();
        expect(wrapperLazy.vm.showLazyContent(() => 'content')).toBe('content');
    });

    it('should show if lazy and active at boot', async () => {
        const wrapper = mountFunction({
            propsData: {
                eager: true,
            },
        });

        expect(wrapper.vm.showLazyContent(() => 'content')).toBe('content');
    });

    it('should boot', async () => {
        const wrapper = mountFunction({
            data: () => ({ isActive: false }),
        });

        expect(wrapper.vm.isActive).toBe(false);
        expect(wrapper.vm.isBooted).toBe(false);

        await wrapper.setData({ isActive: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isBooted).toBe(true);
    });
});
