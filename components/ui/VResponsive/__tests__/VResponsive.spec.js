// Components
import VResponsive from '../';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('VResponsive.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VResponsive, {
            ...options,
        });
    });

    it('should force aspect ratio', () => {
        const wrapper = mountFunction({
            propsData: { aspectRatio: 16 / 9 },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render content', () => {
        const wrapper = mountFunction({
            slots: {
                default: { render: h => h('div', ['content']) },
            },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should set height', () => {
        const wrapper = mountFunction({
            propsData: { height: 100, maxHeight: 200 },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });
});
