export default {
    features: [
        {
            require: 'intersection-observer',
            detect: () => 'IntersectionObserver' in window,
        },
        {
            require: 'smoothscroll-polyfill',
            detect: () => 'scrollBehavior' in document.documentElement.style &&
                window.__forceSmoothScrollPolyfill__ !== true,
            install: smoothscroll => smoothscroll.polyfill(),
        },
    ],
};
