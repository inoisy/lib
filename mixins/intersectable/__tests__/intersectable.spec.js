import intersectable from '../index';

import {
    mount,
} from '@vue/test-utils';

describe('intersectable.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = options => mount({
            render: h => h('div'),
            ...options,
        });
    });

    it('should call callbacks when element is intersected', () => {
        const callback = jest.fn();

        const wrapper = mountFunction({
            mixins: [intersectable({ onVisible: ['callback'] })],
            methods: { callback },
        });

        expect(callback).not.toHaveBeenCalled();

        wrapper.vm.onObserve([], null, false);

        expect(callback).not.toHaveBeenCalled();

        wrapper.vm.onObserve([], null, true);

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
