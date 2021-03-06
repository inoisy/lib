// Components
import VItem from '../VItem';

// Utilities
import {
    createLocalVue,
    mount,
} from '@vue/test-utils';

const itemWarning = 'The v-item component must be used inside a v-item-group';

describe('VItem', () => {
    let mountFunction;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();

        mountFunction = (options = {}) => mount(VItem, {
            localVue,
            ...options,
        });
    });

    it('should warn if missing default scopedSlot', () => {
        mountFunction();

        expect('v-item is missing a default scopedSlot').toHaveBeenTipped();
        expect(itemWarning).toHaveBeenTipped();
    });

    it('should warn if multiple elements', () => {
        const Mock = {
            name: 'test',

            render: h => h(VItem, {
                scopedSlots: {
                    default: () => '<div>foo</div>',
                },
            }),
        };

        mount(Mock);

        expect('v-item should only contain a single element').toHaveBeenTipped();
        expect(itemWarning).toHaveBeenTipped();
    });

    it('should match snapshot activeClass', async () => {
        const Mock = {
            name: 'test',

            render: h => h(VItem, {
                props: { activeClass: 'foo' },
                scopedSlots: {
                    default: () => h('div'),
                },
            }),
        };

        const wrapper = mount(Mock);

        expect(wrapper.html()).toMatchSnapshot();

        wrapper.vm.$children[0].isActive = true;

        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
        expect(itemWarning).toHaveBeenTipped();
    });
});
