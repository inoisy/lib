// Components
import VRadio from '../VRadio';
import VRadioGroup from '../VRadioGroup';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('VRadioGroup.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VRadioGroup, options);
    });

    it('should match snapshot', async () => {
        const wrapper = mountFunction();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should match dense snapshot', async () => {
        const wrapper = mountFunction({
            propsData: {
                dense: true,
            },
            slots: {
                default: [VRadio],
            },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });
});
