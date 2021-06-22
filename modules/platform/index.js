import { resolve } from 'path';
import defu from 'defu';
/* eslint-disable no-extra-parens */
const DEFAULT_CONFIGS = {
    mobileBreakpoint: 1024,
    scrollBarWidth: 16,
    thresholds: {
        xs: 412,
        sm: 812,
        md: 1024,
        lg: 1440,
    },
    defaultUserAgent: 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Mobile Safari/537.36',
    // refreshDeviceOnResize: false,
};
export default async function module(_moduleOptions) {
    const { nuxt } = this;
    const moduleOptions = {
        ...nuxt.options.platform,
        ..._moduleOptions,
        ...(nuxt.options.runtimeConfig && nuxt.options.runtimeConfig.platform),
    };
    const options = defu(moduleOptions, DEFAULT_CONFIGS);
    // Transpile defu (IE11)
    if (nuxt.options.build.transpile /* nuxt 1 */) {
        nuxt.options.build.transpile.push(({ isClient }) => isClient && 'defu');
    }
    this.options.alias['~platfrom'] = resolve(__dirname);
    this.addPlugin({
        src: resolve(__dirname, './plugin.js'),
        fileName: 'platform-plugin.js',
        options,
    });
}
