import Rippleable from '../';
import {
    mount,
} from '@vue/test-utils';

describe('rippleable.js', () => {
    const Mock = Rippleable.extend({
        render() {
            return this.genRipple();
        },
    });

    let mountFunction;
    beforeEach(() => {
        mountFunction = options => mount(Mock, options);
    });

    it('should match snapshot', () => {
        const wrapper = mountFunction();

        expect(wrapper.html()).toMatchSnapshot();
    });
});
