// Directives
import Intersect from '../';
// const Intersect = require('../')

describe('intersect', () => {
    it('should bind event on inserted', () => {
        const callback = jest.fn();
        const el = document.createElement('div');
        document.body.appendChild(el);

        Intersect.inserted(el, {
            value: callback,
            modifiers: { quiet: true },
        });

        expect(el._observe).toBeTruthy();
        expect(callback).not.toHaveBeenCalled();

        document.body.removeChild(el);

        Intersect.unbind(el);

        expect(el._observe).toBeFalsy();
    });

    it('should invoke callback once and unbind', () => {
        const el = document.createElement('div');

        document.body.appendChild(el);

        const callback = jest.fn();

        Intersect.inserted(el, {
            value: callback,
            modifiers: { once: true },
        });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(el._observe).toBeTruthy();
        el._observe.observer.callback([{ isIntersecting: false }]);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(el._observe).toBeTruthy();
        el._observe.observer.callback([{ isIntersecting: true }]);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(el._observe).toBeFalsy();
    });
});
