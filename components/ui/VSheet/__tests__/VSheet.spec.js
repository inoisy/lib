// Components
import VSheet from '../index.vue';

// Utilities
import {
    shallowMount,
    // Wrapper,
} from '@vue/test-utils';
/* eslint-disable quotes */
describe('VSheet.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => shallowMount(VSheet, options);
    });

    it('should render component and match snapshot', async () => {
        const wrapper = mountFunction();

        expect(wrapper.html()).toMatchInlineSnapshot(`
            <div class="v-sheet theme--light">
            </div>
        `);
    });

    it('should render a colored paper', () => {
        const wrapper = mountFunction({
            propsData: {
                color: 'blue lighten-1',
            },
        });
        expect(wrapper.element.classList).toContain('blue');
        expect(wrapper.element.classList).toContain('lighten-1');
    });

    it('should render a tile paper', () => {
        const wrapper = mountFunction({
            propsData: {
                tile: true,
            },
        });

        expect(wrapper.html()).toMatchInlineSnapshot(`
            <div class="v-sheet theme--light rounded-0">
            </div>
        `);
    });
});
