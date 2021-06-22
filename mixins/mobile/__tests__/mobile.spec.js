// Mixins
import Mobile from '../';

// Utilities
import { mount } from '@vue/test-utils';
import { preset } from '../../../presets/default';
import { resizeWindow } from '../../../../test';

import { Breakpoint } from '../../../services/breakpoint';

describe('mobile.js', () => {
    let mountFunction;

    beforeEach(() => {
        const Mock = {
            mixins: [Mobile],
            render: h => h('div'),
        };

        mountFunction = (options = {}) => mount(Mock, {
            ...options,
            mocks: {
                $vuetify: { breakpoint: new Breakpoint(preset) },
            },
        });
    });

    it.each([
        [1263, undefined, true],
        [1263, 1264, true],
        [1263, 'xl', false],
        [1920, 'md', false],
        [1263, 1400, true],
    ])('should conditionally be mobile using a breakpoint of %s', async (...item) => {
        const [
            resizeTo,
            mobileBreakpoint,
            isMobile,
        ] = item;

        await resizeWindow(resizeTo);

        const wrapper = mountFunction({
            propsData: { mobileBreakpoint },
        });

        expect(wrapper.vm.isMobile).toBe(isMobile);
    });
});
