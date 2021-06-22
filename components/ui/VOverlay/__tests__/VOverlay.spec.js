// Components
import VOverlay from '../';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('VOverlay.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VOverlay, {
            ...options,
        });
    });

    it('should have a conditional opacity', async () => {
        const wrapper = mountFunction({
            propsData: { value: false },
        });

        expect(wrapper.vm.computedOpacity).toBe(0);

        await wrapper.setProps({ value: true });
        expect(wrapper.vm.computedOpacity).toBe(0.46);

        await wrapper.setProps({ opacity: 0.55 });
        expect(wrapper.vm.computedOpacity).toBe(0.55);

        await wrapper.setProps({ value: false });
        expect(wrapper.vm.computedOpacity).toBe(0);
    });
});
