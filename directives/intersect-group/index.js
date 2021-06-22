/* eslint-disable no-unused-vars */
function inserted(element, binding) {
    const modifiers = binding.modifiers || {};
    const value = binding.value;
    const isChildIntersection = modifiers.child;
    const { handler, options } = typeof value === 'object'
        ? value
        : { handler: value, options: { threshold: 1 } };

    if (isChildIntersection) {
        const children = Array.from(element.children);
        if (!children?.length) {
            console.warn('THERE IS NO CHILDREN');
            return;
        }
        const childrenLength = children.length;
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    const currentIndex = el._observe.index;
                    const persent = Math.round(currentIndex * 100 / childrenLength);
                    const isEnded = currentIndex === childrenLength;
                    handler({ currentProgress: persent, currentIndex: currentIndex, isEnded: isEnded });
                    el._observe.init = true;
                    if (modifiers.once && isEnded) {
                        unbind(element, binding);
                    }
                } else if (el._observe.init && modifiers.once) {
                    unbindOne(el, binding);
                }
            });
        }, options);
        children.forEach((el, i) => {
            el._observe = { init: false, index: i + 1, observer };
            observer.observe(el);
        });
    } else {
        const children = Array.from(element.children);
        if (!children?.length) {
            console.warn('THERE IS NO CHILDREN');
            return;
        }
        const intersectedElement = children[children.length-1];

        const handleIntersect = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    handler({ currentProgress: 100, isEnded: true });
                    intersectedElement._observe.init = true;
                    if (modifiers.once) {
                        unbind(element, binding);
                    }
                } else if (intersectedElement._observe.init) {
                    handler({ currentProgress: 0, isEnded: false });
                }
            });
        };
        const observer = new IntersectionObserver(handleIntersect, options);
        intersectedElement._observe = { init: false, observer };
        observer.observe(intersectedElement);
    }
}
function unbindOne(el) {
    /* istanbul ignore if */
    if (!el._observe) {
        return;
    }
    el._observe.observer.unobserve(el);
    delete el._observe;
}
function unbind(element, binding) {
    const isChildIntersection = Boolean(binding?.modifiers?.child);
    if (isChildIntersection) {
        const children = Array.from(element.children);
        for (const el of children) {
            unbindOne(el);
        }
    } else {
        const children = Array.from(element.children);
        const intersectedElement = children[children.length-1];
        unbindOne(intersectedElement);
    }
}

export const Intersect = {
    inserted,
    unbind,
};

export default Intersect;
