// Components
import VAvatar from '../';

// Utilities
import {
    createLocalVue,
    mount,
} from '@vue/test-utils';

describe('VAvatar', () => {
    let mountFunction;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();

        mountFunction = (options = {}) => mount(VAvatar, {
            localVue,
            ...options,
        });
    });

    it('should have an v-avatar class', () => {
        const wrapper = mountFunction();

        expect(wrapper.classes()).toContain('v-avatar');
        expect(wrapper.html()).toMatchSnapshot();
    });
});
