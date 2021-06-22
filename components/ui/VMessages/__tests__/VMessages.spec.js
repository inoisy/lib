// Components
import VMessages from '../index';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('VMessages.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VMessages, {
            ...options,
        });
    });

    it('should have a default array', () => {
        const wrapper = mountFunction();

        expect(Array.isArray(wrapper.vm.value)).toBe(true);
    });

    it('should show messages', async () => {
        const wrapper = mountFunction({
            propsData: {
                value: ['foo', 'bar'],
            },
        });

        expect(wrapper.html()).toMatchSnapshot();

        await wrapper.setProps({ value: [] });
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should allow HTML', () => {
        const wrapper = mountFunction({
            propsData: {
                value: ['<a href="#">a link</a>'],
            },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should not allow HTML', () => {
        const wrapper = mount(VMessages, {
            propsData: {
                value: ['<a href="#">a link</a>'],
            },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should accept a scoped slot', () => {
        const wrapper = mount(VMessages, {
            propsData: { value: ['Foo'] },
            scopedSlots: {
                default(props) {
                    return this.$createElement('div', props.message);
                },
            },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });
});
