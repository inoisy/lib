// Components
import VListItemGroup from '../VListItemGroup';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('VListItemGroup.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VListItemGroup, {
            ...options,
        });
    });

    it('should have the correct role', () => {
        const wrapper = mountFunction();

        expect(wrapper.element.getAttribute('role')).toBe('listbox');
    });
});
