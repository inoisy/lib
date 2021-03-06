/* eslint-disable new-cap */
import Proxyable, { factory as Proxy } from '../';
import {
    mount,
} from '@vue/test-utils';

describe('proxyable.js', () => {
    const Mock = Proxyable.extend({
        render: h => h('div'),
    });

    let mountFunction;
    beforeEach(() => {
        mountFunction = options => mount(Mock, options);
    });

    it('should watch prop and emit event', async () => {
        const change = jest.fn();
        const wrapper = mountFunction({
            propsData: { value: 'foo' },
        });

        wrapper.vm.$on('change', change);

        expect(wrapper.vm.internalValue).toBe('foo');

        // Change by prop
        await wrapper.setProps({ value: 'bar' });

        expect(wrapper.vm.internalValue).toBe('bar');
        expect(change).not.toHaveBeenCalled();

        // Change internal
        wrapper.vm.internalValue = 'fizzbuzz';

        expect(wrapper.vm.internalValue).toBe('fizzbuzz');

        expect(change).toHaveBeenCalledWith('fizzbuzz');
    });

    it('should use provided prop and event arguments', () => {
        const input = jest.fn();
        const wrapper = mount({
            mixins: [Proxy('input', 'update:input-value')],
            render: h => h('div'),
        }, {
            propsData: {
                input: 'foo',
            },
        });

        wrapper.vm.$on('update:input-value', input);

        expect(wrapper.vm.input).toBe('foo');

        wrapper.vm.internalValue = 'bar';

        expect(input).toHaveBeenCalledWith('bar');
    });
});
