import Roundable from '../';
import {
    mount,
} from '@vue/test-utils';

describe('rippleable.js', () => {
    const Mock = Roundable.extend({
        render(h) {
            return h('div', {
                class: this.roundableClasses,
            });
        },
    });

    //
    let mountFunction;
    beforeEach(() => {
        mountFunction = options => mount(Mock, options);
    });

    it.each([
        [undefined, {}],
        [{ tile: true }, { 'rounded-0': true }],
        [{ rounded: true, tile: true }, { 'rounded-0': true }],
        [{ rounded: '0' }, { 'rounded-0': true }],
        [{ rounded: true }, { rounded: true }],
        [{ rounded: false }, {}],
        [{ rounded: 'tr-xl br-lg' }, { 'rounded-tr-xl rounded-br-lg': true }],
    ])('should return correct rounded classes', (propsData, expected) => {
        const wrapper = mountFunction({ propsData });

        expect(wrapper.vm.roundedClasses).toEqual(expected);
    });
});
