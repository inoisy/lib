import {
    mount,
} from '@vue/test-utils';
import VSimpleCheckbox from '../VSimpleCheckbox';

describe('VSimpleCheckbox.js', () => {
    let mountFunction;
    beforeEach(() => {
        mountFunction = options => mount(VSimpleCheckbox, options);
    });

    it('should pass down listeners', () => {
        const mouseleave = jest.fn();
        const wrapper = mountFunction({
            propsData: { disabled: true },
            listeners: {
                mouseleave,
            },
        });

        const element = wrapper.find('.v-simple-checkbox');

        element.trigger('mouseleave');

        expect(mouseleave).toHaveBeenCalledTimes(1);
    });
});
