// Components
import VListItemAvatar from '../VListItemAvatar';

// Utilities
import {
    mount,
} from '@vue/test-utils';


describe('VListItemAvatar.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VListItemAvatar, {
            ...options,
        });
    });

    it('should render component and match snapshot', () => {
        const wrapper = mountFunction();

        expect(wrapper.html()).toMatchSnapshot();
    });
});
