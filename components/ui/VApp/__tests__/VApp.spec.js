// Components
import VApp from '../';

// Utilities
import {
    mount,
} from '@vue/test-utils';

describe('VApp.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VApp, {
            ...options,
        });
    });

    it('should match a snapshot', () => {
        const wrapper = mountFunction({
            mocks: {
                $vuetify: {
                    rtl: false,
                    theme: {
                        dark: false,
                    },
                },
            },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should have data-app attribute', () => {
        const wrapper = mountFunction({
            mocks: {
                $vuetify: {
                    rtl: false,
                    theme: {
                        dark: false,
                    },
                },
            },
        });

        const app = wrapper.find('.v-application');
        expect(app.attributes()['data-app']).toBe('true');
    });

    it('should allow a custom id', () => {
        const wrapper = mountFunction({
            propsData: {
                id: 'inspire',
            },
            mocks: {
                $vuetify: {
                    rtl: false,
                    theme: {
                        dark: false,
                    },
                },
            },
        });
        const app = wrapper.find('.v-application');
        expect(app.attributes().id).toBe('inspire');

        expect(wrapper.html()).toMatchSnapshot();
    });
});
