// Components
import Selectable from '../index';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('Selectable.js', () => {
    const Mock = Selectable.extend({
        render: h => h('div'),
    });

    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(Mock, {
            ...options,
        });
    });

    it('should update lazyValue and hasColor data when value changes', async () => {
        const wrapper = mountFunction();

        expect(wrapper.vm.lazyValue).toBeUndefined();
        expect(wrapper.vm.hasColor).toBeUndefined();

        await wrapper.setProps({ inputValue: true });

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.lazyValue).toBe(true);
        expect(wrapper.vm.hasColor).toBe(true);
    });
});
