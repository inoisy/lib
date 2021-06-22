import Vue from 'vue';

// export function convertToUnit(str, unit = 'px') {
//     if (str === null || str === undefined || str === '') {
//         return false;
//     } else if (isNaN(Number(str))) {
//         return String(str);
//     } else {
//         return `${Number(str)}${unit}`;
//     }
// }
export function convertToUnit(str, unit = 'px') {
    if (str === undefined || str === null || str === '') {
        return undefined;
    } else if (isNaN(Number(str))) {
        return String(str);
    } else {
        return `${Number(str)}${unit}`;
    }
}

export function createSimpleFunctional(
    c,
    el = 'div',
    name,
) {
    return Vue.extend({
        name: name || c.replace(/__/g, '-'),

        functional: true,

        render(h, { data, children }) {
            data.staticClass = `${c} ${data.staticClass || ''}`.trim();

            return h(el, data, children);
        },
    });
}


export function deepEqual(a, b) {
    if (a === b) {
        return true;
    }

    if (
        a instanceof Date &&
      b instanceof Date &&
      a.getTime() !== b.getTime()
    ) {
        // If the values are Date, compare them as timestamps
        return false;
    }

    if (a !== Object(a) || b !== Object(b)) {
        // If the values aren't objects, they were already checked for equality
        return false;
    }

    const props = Object.keys(a);

    if (props.length !== Object.keys(b).length) {
        // Different number of props, don't bother to check
        return false;
    }

    return props.every(p => deepEqual(a[p], b[p]));
}

// KeyboardEvent.keyCode aliases
export const keyCodes = Object.freeze({
    enter: 13,
    tab: 9,
    delete: 46,
    esc: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    end: 35,
    home: 36,
    del: 46,
    backspace: 8,
    insert: 45,
    pageup: 33,
    pagedown: 34,
    shift: 16,
});


export function debounce(fn, delay) {
    let timeoutId = 0;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

export function throttle(fn, limit) {
    let throttling = false;
    return (...args) => {
        if (!throttling) {
            throttling = true;
            setTimeout(() => throttling = false, limit);
            return fn(...args);
        }
    };
}
export function upperFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function filterObjectOnKeys(obj, keys) {
    const filtered = {};

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof obj[key] !== 'undefined') {
            filtered[key] = obj[key];
        }
    }

    return filtered;
}
const camelizeRE = /-(\w)/g;
export const camelize = str => str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');

export function getSlot(vm, name = 'default', data, optional = false) {
    if (vm.$scopedSlots[name]) {
        return vm.$scopedSlots[name]&& vm.$scopedSlots[name](data instanceof Function ? data() : data);
    } else if (vm.$slots[name] && (!data || optional)) {
        return vm.$slots[name];
    }
    return undefined;
}

export function wrapInArray(v = null) {
    return v !== null ? Array.isArray(v) ? v : [v] : [];
}
// export function getObjectValueByPath(obj, path, fallback) {
//     // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
//     if (obj === null || !path || typeof path !== 'string') {
//         return fallback;
//     }
//     if (obj[path] !== undefined) {
//         return obj[path];
//     }
//     path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
//     path = path.replace(/^\./, ''); // strip a leading dot
//     return getNestedValue(obj, path.split('.'), fallback);
// }
/* eslint-disable no-eq-null */
export function getObjectValueByPath(obj, path, fallback) {
    // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
    if (obj == null || !path || typeof path !== 'string') {
        return fallback;
    }
    if (obj[path] !== undefined) {
        return obj[path];
    }
    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, ''); // strip a leading dot
    return getNestedValue(obj, path.split('.'), fallback);
}


export function getNestedValue(obj, path, fallback) {
    const last = path.length - 1;

    if (last < 0) {
        return obj === undefined ? fallback : obj;
    }

    for (let i = 0; i < last; i++) {
        if (obj === null) {
            return fallback;
        }
        obj = obj[path[i]];
    }

    if (obj === null || obj === undefined) {
        return fallback;
    }

    return obj[path[last]] === undefined ? fallback : obj[path[last]];
}

export function keys(o) {
    return Object.keys(o);
}
export function kebabCase(str) {
    return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function isUnset(val) {
    return typeof val === 'undefined' || val === null;
}

export function isSet(val) {
    return !isUnset(val);
}
/* eslint-disable no-console,getter-return,no-var */

export function addOnceEventListener(
    el,
    eventName,
    cb,
    options = false,
) {
    var once = event => {
        cb(event);
        el.removeEventListener(eventName, once, options);
    };

    el.addEventListener(eventName, once, options);
}

let passiveSupported = false;
try {
    if (typeof window !== 'undefined') {
        const testListenerOpts = Object.defineProperty({}, 'passive', {
            get: () => {
                passiveSupported = true;
            },
        });

        window.addEventListener('testListener', testListenerOpts, testListenerOpts);
        window.removeEventListener('testListener', testListenerOpts, testListenerOpts);
    }
} catch (e) {
    console.warn(e);
}
export { passiveSupported };

export function addPassiveEventListener(
    el,
    event,
    cb,
    options = {},
) {
    el.addEventListener(event, cb, passiveSupported ? options : false);
}

const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
};

export function escapeHTML(str) {
    return str.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag);
}

export function getZIndex(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
        return 0;
    }

    const index = Number(window.getComputedStyle(el).getPropertyValue('z-index'));

    if (!index) {
        return getZIndex(el.parentNode);
    }
    return index;
}

export function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

export function padEnd(str, length, char = '0') {
    return str + char.repeat(Math.max(0, length - str.length));
}

export function chunk(str, size = 1) {
    const chunked = [];
    let index = 0;
    while (index < str.length) {
        chunked.push(str.substr(index, size));
        index += size;
    }
    return chunked;
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function isObjectEmpty(obj) {
    if (isUnset(obj) || typeof obj !== 'object') {
        return true;
    }
    return Object.keys(obj).length === 0;
}


export function mergeDeep(
    source,
    target,
) {
    for (const key in target) {
        const sourceProperty = source[key];
        const targetProperty = target[key];

        // Only continue deep merging if
        // both properties are objects
        if (
            isObject(sourceProperty) &&
        isObject(targetProperty)
        ) {
            source[key] = mergeDeep(sourceProperty, targetProperty);

            continue;
        }

        source[key] = targetProperty;
    }

    return source;
}

const iconsPreset = {
    complete: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z',
    cancel: 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z',
    close: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
    delete: 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z', // delete (e.g. v-chip close)
    clear: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
    success: 'M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z',
    info: 'M13,9H11V7H13M13,17H11V11H13M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z',
    warning: 'M11,4.5H13V15.5H11V4.5M13,17.5V19.5H11V17.5H13Z',
    error: 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z',
    prev: 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z',
    next: 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
    checkboxOn: 'M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z',
    checkboxOff: 'M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z',
    checkboxIndeterminate: 'M17,13H7V11H17M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z',
    delimiter: 'M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z', // for carousel
    sort: 'M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z',
    expand: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
    menu: 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z',
    subgroup: 'M7,10L12,15L17,10H7Z',
    dropdown: 'M7,10L12,15L17,10H7Z',
    radioOn: 'M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,7C9.24,7 7,9.24 7,12C7,14.76 9.24,17 12,17C14.76,17 17,14.76 17,12C17,9.24 14.76,7 12,7Z',
    radioOff: 'M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z',
    edit: 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z',
    ratingEmpty: 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z',
    ratingFull: 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z',
    ratingHalf: 'M12,15.4V6.1L13.71,10.13L18.09,10.5L14.77,13.39L15.76,17.67M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z',
    loading: 'M19,8L15,12H18C18,15.31 15.31,18 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20C16.42,20 20,16.42 20,12H23M6,12C6,8.69 8.69,6 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4C7.58,4 4,7.58 4,12H1L5,16L9,12',
    first: 'M18.41,16.59L13.82,12L18.41,7.41L17,6L11,12L17,18L18.41,16.59M6,6H8V18H6V6Z',
    last: 'M5.59,7.41L10.18,12L5.59,16.59L7,18L13,12L7,6L5.59,7.41M16,6H18V18H16V6Z',
    unfold: 'M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z',
    file: 'M16.5,6V17.5C16.5,19.71 14.71,21.5 12.5,21.5C10.29,21.5 8.5,19.71 8.5,17.5V5C8.5,3.62 9.62,2.5 11,2.5C12.38,2.5 13.5,3.62 13.5,5V15.5C13.5,16.05 13.05,16.5 12.5,16.5C11.95,16.5 11.5,16.05 11.5,15.5V6H10V15.5C10,16.88 11.12,18 12.5,18C13.88,18 15,16.88 15,15.5V5C15,2.79 13.21,1 11,1C8.79,1 7,2.79 7,5V17.5C7,20.54 9.46,23 12.5,23C15.54,23 18,20.54 18,17.5V6H16.5Z',
    plus: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
    minus: 'M19,13H5V11H19V13Z',
};


export function remapInternalIcon(vm, iconName) {
    // const iconPath = iconName.split('$').pop();
    // return iconPath;
    // Look for custom component in the configuration
    const component = 'svg-icon';

    // Look for overrides
    if (iconName.startsWith('$')) {
        const iconPath = iconName.split('$').pop();
        // Get the target icon name
        // const iconPath = `icons.values.${iconName.split('$').pop()
        //     ?.split('.')
        //     .pop()}`;
        return iconsPreset[iconPath];
        // iconsPreset
        // Now look up icon indirection name,
        // e.g. 'icons.values.cancel'
        // const override = getObjectValueByPath(vm, iconPath, iconName);

        // if (typeof override === 'string') {
        //     iconName = override;
        // } else {
        //     return override;
        // }
    }

    if (component === null) {
        return iconName;
    }

    return {
        component,
        key: iconName,
        props: {
            name: iconName,
        },
    };
}

export function humanReadableFileSize(bytes, binary = false) {
    const base = binary ? 1024 : 1000;
    if (bytes < base) {
        return `${bytes} B`;
    }

    const prefix = binary ? ['Ki', 'Mi', 'Gi'] : ['k', 'M', 'G'];
    let unit = -1;
    while (Math.abs(bytes) >= base && unit < prefix.length - 1) {
        bytes /= base;
        ++unit;
    }
    return `${bytes.toFixed(1)} ${prefix[unit]}B`;
}


export function sortItems(
    items,
    sortBy,
    sortDesc,
    locale,
    customSorters,
) {
    if (sortBy === null || !sortBy.length) {
        return items;
    }
    const stringCollator = new Intl.Collator(locale, { sensitivity: 'accent', usage: 'sort' });

    return items.sort((a, b) => {
        for (let i = 0; i < sortBy.length; i++) {
            const sortKey = sortBy[i];

            let sortA = getObjectValueByPath(a, sortKey);
            let sortB = getObjectValueByPath(b, sortKey);

            if (sortDesc[i]) {
                [sortA, sortB] = [sortB, sortA];
            }

            if (customSorters && customSorters[sortKey]) {
                const customResult = customSorters[sortKey](sortA, sortB);

                if (!customResult) {
                    continue;
                }

                return customResult;
            }

            // Check if both cannot be evaluated
            if (sortA === null && sortB === null) {
                continue;
            }

            [sortA, sortB] = [sortA, sortB].map(s => (s || '').toString().toLocaleLowerCase());

            if (sortA !== sortB) {
                if (!isNaN(sortA) && !isNaN(sortB)) {
                    return Number(sortA) - Number(sortB);
                }
                return stringCollator.compare(sortA, sortB);
            }
        }

        return 0;
    });
}

/**
 * Returns:
 *  - 'normal' for old style slots - `<template slot="default">`
 *  - 'scoped' for old style scoped slots (`<template slot="default" slot-scope="data">`) or bound v-slot (`#default="data"`)
 *  - 'v-slot' for unbound v-slot (`#default`) - only if the third param is true, otherwise counts as scoped
 */
export function getSlotType(vm, name, split) {
    if (vm.$slots[name] && vm.$scopedSlots[name] && vm.$scopedSlots[name].name) {
        return split ? 'v-slot' : 'scoped';
    }
    if (vm.$slots[name]) {
        return 'normal';
    }
    if (vm.$scopedSlots[name]) {
        return 'scoped';
    }
}

/**
 * Returns the set difference of B and A, i.e. the set of elements in B but not in A
 */
export function arrayDiff(a, b) {
    const diff = [];
    for (let i = 0; i < b.length; i++) {
        if (a.indexOf(b[i]) < 0) {
            diff.push(b[i]);
        }
    }
    return diff;
}

export function getPropertyFromItem(
    item,
    property,
    fallback,
) {
    if (property === null) {
        return item === undefined ? fallback : item;
    }

    if (item !== Object(item)) {
        return fallback === undefined ? item : fallback;
    }

    if (typeof property === 'string') {
        return getObjectValueByPath(item, property, fallback);
    }

    if (Array.isArray(property)) {
        return getNestedValue(item, property, fallback);
    }

    if (typeof property !== 'function') {
        return fallback;
    }

    const value = property(item, fallback);

    return typeof value === 'undefined' ? fallback : value;
}

export function createRange(length) {
    return Array.from({ length }, (v, k) => k);
}
