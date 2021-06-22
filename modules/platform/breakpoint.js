export default class Breakpoint {
    constructor(config, device = {}) {
        const {
            mobileBreakpoint,
            scrollBarWidth,
            thresholds,
        } = config;

        this.mobileBreakpoint = mobileBreakpoint;
        this.scrollBarWidth = scrollBarWidth;
        this.thresholds = thresholds;
        if (device && device?.isTablet && device?.isDesktop) {
            const { isTablet, isDesktop } = device;
            if (isTablet) {
                this.defaultWidth = thresholds.md;
            } else if (isDesktop) {
                this.defaultWidth = thresholds.lg;
            } else {
                this.defaultWidth = thresholds.xs;
            }
        } else {
            this.defaultWidth = 0;
        }
        this.init();
    }

    init() {
        this.update();

        /* istanbul ignore if */
        if (typeof window === 'undefined') {
            return;
        }

        window.addEventListener('resize', this.onResize.bind(this), { passive: true });
    }

    /* eslint-disable-next-line max-statements */
    update() {
        const height = this.getClientHeight();
        const width = this.getClientWidth();
        const xs = width < this.thresholds.xs;
        const sm = width < this.thresholds.sm && !xs;
        const md = width <= this.thresholds.md && !(sm || xs);
        const lg = width < this.thresholds.lg - this.scrollBarWidth && !(md || sm || xs);
        const xl = width >= this.thresholds.lg - this.scrollBarWidth;

        this.height = height;
        this.width = width;

        this.xs = xs;
        this.sm = sm;
        this.md = md;
        this.lg = lg;
        this.xl = xl;

        this.xsOnly = xs;
        this.smOnly = sm;
        this.smAndDown = (xs || sm) && !(md || lg || xl);
        this.smAndUp = !xs && (sm || md || lg || xl);
        this.mdOnly = md;
        this.mdAndDown = (xs || sm || md) && !(lg || xl);
        this.mdAndUp = !(xs || sm) && (md || lg || xl);
        this.lgOnly = lg;
        this.lgAndDown = (xs || sm || md || lg) && !xl;
        this.lgAndUp = !(xs || sm || md) && (lg || xl);
        this.xlOnly = xl;

        switch (true) {
            case xs:
                this.name = 'xs';
                break;
            case sm:
                this.name = 'sm';
                break;
            case md:
                this.name = 'md';
                break;
            case lg:
                this.name = 'lg';
                break;
            default:
                this.name = 'xl';
                break;
        }

        if (typeof this.mobileBreakpoint === 'number') {
            this.mobile = width < parseInt(this.mobileBreakpoint, 10);

            return;
        }

        const breakpoints = {
            xs: 0,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 4,
        };

        const current = breakpoints[this.name];
        const max = breakpoints[this.mobileBreakpoint];

        this.mobile = current <= max;
    }

    onResize() {
        clearTimeout(this.resizeTimeout);

        // Added debounce to match what
        // v-resize used to do but was
        // removed due to a memory leak
        this.resizeTimeout = window.setTimeout(this.update.bind(this), 200);
    }

    // Cross-browser support as described in:
    // https://stackoverflow.com/questions/1248081
    getClientWidth() {
        /* istanbul ignore if */
        if (typeof document === 'undefined') {
            if (this.defaultWidth) {
                return this.defaultWidth;
            }
            return 0;
        }
        // if (!this.defaultWidth) {
        //     return 0;
        // } // SSR
        return Math.max(document.documentElement?.clientWidth, window.innerWidth || 0);
    }

    getClientHeight() {
    /* istanbul ignore if */
        if (typeof document === 'undefined') {
            return 0;
        } // SSR
        return Math.max(document.documentElement?.clientHeight, window.innerHeight || 0);
    }
}
