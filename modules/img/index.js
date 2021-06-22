import defu from 'defu';
import { resolve } from 'path';
/* eslint-disable no-extra-parens */

export default async function module(_moduleOptions) {
    const DEFAULT_CONFIGS = {
        IMGPROXY_KEY: process.env.IMGPROXY_KEY,
        IMGPROXY_S3_ENDPOINT: process.env.IMGPROXY_S3_ENDPOINT,
        IMGPROXY_SALT: process.env.IMGPROXY_SALT,
        IMGPROXY_SITE_HOST: process.env.IMGPROXY_SITE_HOST,
    };
    const { nuxt } = this;
    const moduleOptions = {
        ...nuxt.options.imgProxy,
        ..._moduleOptions,
        ...(nuxt.options.runtimeConfig && nuxt.options.runtimeConfig.imgProxy),
    };

    const options = defu(moduleOptions, DEFAULT_CONFIGS);
    // Transpile defu (IE11)
    if (nuxt.options.build.transpile /* nuxt 1 */) {
        nuxt.options.build.transpile.push(({ isClient }) => isClient && 'defu');
    }

    if (!nuxt.options.build.babel.plugins) {
        nuxt.options.build.babel.plugins = [];
    }
    nuxt.options.build.babel.plugins.unshift(['@babel/plugin-proposal-decorators', { legacy: true }]);
    this.addPlugin({
        src: resolve(__dirname, './plugin.js'),
        fileName: 'img-plugin.js',
        options,
    });
}
