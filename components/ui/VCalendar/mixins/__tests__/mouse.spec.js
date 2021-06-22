import Mouse from '../mouse';

import {
    mount,

} from '@vue/test-utils';


const Mock = Mouse.extend({
    render: h => h('div'),
});

describe('mouse.js', () => {
    let mountFunction;
    beforeEach(() => {
        mountFunction = options => mount(Mock, options);
    });

    it('should generate mouse event handlers', async () => {
        const noop = e => e;
        const wrapper = mount(Mock, {
            listeners: {
                click: noop,
            },
        });

        expect(typeof wrapper.vm.getMouseEventHandlers({ click: { event: 'click' } }, noop).click).toBe('function');
    });

    it('should generate default mouse event handlers', async () => {
        const noop = e => e;
        const wrapper = mount(Mock, {
            listeners: {
                click: noop,
            },
        });

        expect(typeof wrapper.vm.getDefaultMouseEventHandlers('', noop).click).toBe('function');
        expect(Object.keys(typeof wrapper.vm.getDefaultMouseEventHandlers('', noop))).toHaveLength(6);
    });

    it('should emit events', async () => {
        const fn = jest.fn();
        const wrapper = mount(Mock, {
            listeners: {
                click: fn,
            },
        });

        const { click } = wrapper.vm.getMouseEventHandlers({ click: { event: 'click' } }, () => {});
        Array.isArray(click) ? click[0](null) : click(null);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle prevent modifier', async () => {
        const fn = jest.fn();
        const wrapper = mount(Mock, {
            listeners: {
                click: fn,
            },
        });
        const event = { preventDefault: () => {} };
        const spy = jest.spyOn(event, 'preventDefault');

        const { click } = wrapper.vm.getMouseEventHandlers({ click: { event: 'click', prevent: true } }, () => {});
        Array.isArray(click) ? click[0](event) : click(event);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should handle stop modifier', async () => {
        const fn = jest.fn();
        const wrapper = mount(Mock, {
            listeners: {
                click: fn,
            },
        });
        const event = { stopPropagation: () => {} };
        const spy = jest.spyOn(event, 'stopPropagation');

        const { click } = wrapper.vm.getMouseEventHandlers({ click: { event: 'click', stop: true } }, () => {});
        Array.isArray(click) ? click[0](event) : click(event);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
