// Components
import VThemeProvider from '../';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('VThemeProvider.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VThemeProvider, {
            ...options,
        });
    });

    it('should change based upon root $vuetify', async () => {
        const wrapper = mountFunction({
            provide: {
                theme: { isDark: true },
            },
            mocks: {
                $vuetify: {
                    theme: { dark: false },
                },
            },
        });

        expect(wrapper.vm.isDark).toBe(true);

        await wrapper.setProps({ root: true });

        expect(wrapper.vm.isDark).toBe(false);
    });
});
