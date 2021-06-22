// Components
import VCounter from '../';

// Utilities
import {
    createLocalVue,
    mount,
} from '@vue/test-utils';

describe('VCounter.js', () => {
    let mountFunction;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();

        mountFunction = (ctx = {}, name = 'add') => mount(VCounter, {
            localVue,
            context: Object.assign({
                children: [name],
                data: {},
                props: {},
            }, ctx),
        });
    });

    it('should render component', () => {
        const wrapper = mountFunction({
            props: { value: 5, max: 10 },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render component in error state', () => {
        const wrapper = mountFunction({
            props: { value: 15, max: 10 },
        });

        expect(wrapper.classes('error--text')).toBe(true);
    });

    it('should render component if max is not provided', () => {
        const wrapper = mountFunction({
            props: { value: 15 },
        });

        expect(wrapper.element.textContent).toBe('15');
    });
});
