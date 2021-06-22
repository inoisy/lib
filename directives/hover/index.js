// Styles
import './VHover.scss';

// // Utilities
import { consoleWarn } from '../../utils/console';

// const hoverStop = Symbol('hoverStop');
function isTouchEvent(e) {
    return e.constructor.name === 'TouchEvent';
}
/* eslint-disable no-unused-expressions */
// function isKeyboardEvent(e) {
//     return e.constructor.name === 'KeyboardEvent';
// }
const calculate = (
    e,
    el,
    // value = {},
) => {
    let localX = 0;
    let localY = 0;

    const offset = el.getBoundingClientRect();
    const target = e;

    localX = target.clientX - offset.left;
    localY = target.clientY - offset.top;

    let radius = 0;
    let scale = 0.3;
    if (el._hover && el._hover.circle) {
        scale = 0.15;
        radius = el.clientWidth / 2;
        radius = el._hover.center ? radius : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;
    } else {
        radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
    }

    const centerX = `${el.clientWidth / 2}`;
    const centerY = `${el.clientHeight / 2}`;

    const x = el._hover.center ? centerX : `${localX}`;
    const y = el._hover.center ? centerY : `${localY}`;
    return { radius, scale, x, y, centerX, centerY };
};
function setPosition(e, el) {
    const { radius, scale, x, y } = calculate(e, el);
    el._hover.animation.style.top = `${y}px`;
    el._hover.animation.style.left = `${x}px`;
    return { radius, scale, x, y };
}
const hovers = {
    /* eslint-disable max-statements */
    show(
        e,
        el,
        // value = {},
    ) {
        if (!el._hover || !el._hover.enabled) {
            // || el._hover.wasEnabled
            return;
        }
        let container; let animation;
        if (el._hover.wasEnabled && el._hideTimer) {
            clearTimeout(el._hideTimer);
            container = el._hover.container;
            animation = el._hover.animation;
        } else {
            container = document.createElement('span');
            animation = document.createElement('span');
            container.appendChild(animation);
            container.className = 'v-hover__container';
            animation.className = 'v-hover__animation';
            el._hover.container = container;
            el._hover.animation = animation;
            el.appendChild(container);
        }


        if (el._hover.class) {
            for (const [key, val] of Object.entries(el._hover.class)) {
                if (val) {
                    animation.className += ` ${key}`;
                }
            }
        }
        if (el._hover.style) {
            for (const [key, val] of Object.entries(el._hover.style)) {
                animation.style[key] = val;
            }
        }
        const { radius, scale } = setPosition(e, el);

        animation.style.width = '1px';
        animation.style.height = '1px';
        animation.classList.add('v-hover__animation--enter');
        animation.classList.add('v-hover__animation--visible');
        animation.style.boxShadow = `0 0 0 ${radius*scale}px currentColor`;

        setTimeout(() => {
            animation.classList.remove('v-hover__animation--enter');
            animation.classList.add('v-hover__animation--in');
            animation.style.boxShadow = `0 0 0 ${radius*2}px currentColor`;
            el._hover.wasEnabled = true;
        }, 0);
    },

    hide(e, el) {
        // console.log('🚀 ~ file: index.js ~ line 99 ~ hide ~ el._hover', el);

        if (!el || !el._hover || !el._hover.enabled) {
            return;
        }
        setPosition(e, el);
        const animation = el._hover.animation;
        animation.classList.remove('v-hover__animation--in');
        animation.classList.add('v-hover__animation--out');
        animation.style.boxShadow = '0 0 0 0px currentColor';
        const hideTimer = setTimeout(() => {
            const hovers = el.querySelectorAll('.v-hover__container');
            for (const hover of hovers) {
                hover.remove();
            }
            // el?._hover?.container && el._hover.container.remove();
            el._hover.wasEnabled = false;
        }, 400);
        el._hideTimer = hideTimer;
    },
};

function isHoverEnabled(value) {
    return typeof value === 'undefined' || Boolean(value);
}

function hoverShow(e) {
    const element = e.currentTarget;
    if (isTouchEvent(e)) {
        return;
    }
    if (!element || !element._hover) {
        return;
    }

    hovers.show(e, element);
}

function hoverHide(e) {
    const element = e.currentTarget || null;
    if (!element) {
        // || !element._hover
        return;
    }

    hovers.hide(e, element);
}


function updateHover(el, binding, wasEnabled) {
    const enabled = isHoverEnabled(binding.value);
    if (!enabled) {
        return hovers.hide(el);
    }
    el._hover = el._hover || {};
    el._hover.enabled = enabled;
    const value = binding.value || {};
    if (value.center) {
        el._hover.centered = true;
    }
    if (value.class) {
        el._hover.class = binding.value.class;
    }
    if (value.style) {
        el._hover.style = binding.value.style;
    }
    if (value.circle) {
        el._hover.circle = value.circle;
    }
    if (enabled && !wasEnabled) {
        el.addEventListener('mouseenter', hoverShow, { passive: true });
        el.addEventListener('mouseleave', hoverHide);
    } else if (!enabled && wasEnabled) {
        removeListeners(el);
    }
}

function removeListeners(el) {
    el.removeEventListener('mouseenter', hoverShow, { passive: true });

    el.removeEventListener('mouseleave', hoverHide);
}

function directive(el, binding, node) {
    updateHover(el, binding, false);

    if (process.env.NODE_ENV === 'development') {
    // warn if an inline element is used, waiting for el to be in the DOM first
        if (node.context) {
            node.context.$nextTick(() => {
                const computed = window.getComputedStyle(el);
                if (computed && computed.display === 'inline') {
                    const context = node.fnOptions ? [node.fnOptions, node.context] : [node.componentInstance];
                    consoleWarn('v-hover can only be used on block-level elements', ...context);
                }
            });
        }
    }
}

function unbind(el) {
    delete el._hover;
    removeListeners(el);
}

function update(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }

    const wasEnabled = isHoverEnabled(binding.oldValue);
    updateHover(el, binding, wasEnabled);
}

export const Hover = {
    bind: directive,
    unbind,
    update,
};

export default Hover;
