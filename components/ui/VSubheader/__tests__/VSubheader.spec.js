// Components
import VSubheader from '../';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('VSubheader.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VSubheader, {
            ...options,
        });
    });

    it('should have custom class', () => {
        const wrapper = mount({
            render: h => h(VSubheader, { staticClass: 'foo' }),
        });

        expect(wrapper.element.classList.contains('foo')).toBe(true);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should be light', () => {
        const wrapper = mountFunction({
            propsData: { light: true },
        });

        expect(wrapper.element.classList.contains('theme--light')).toBe(true);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should be dark', () => {
        const wrapper = mountFunction({
            propsData: { dark: true },
        });

        expect(wrapper.element.classList.contains('theme--dark')).toBe(true);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should be inset', () => {
        const wrapper = mountFunction({
            propsData: { inset: true },
        });

        expect(wrapper.element.classList.contains('v-subheader--inset')).toBe(true);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
