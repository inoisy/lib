// import { getFileExtension } from '~/assets/js/file-utils';
import { createHmac } from 'crypto';
import { memoize } from 'decko';
// bind, debounce
function getFileExtension(file) {
    return file.split('.').pop();
}

const urlSafeBase64 = string => Buffer.from(string).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const hexDecode = hex => Buffer.from(hex, 'hex');

const sign = (salt, target, secret) => {
    const hmac = createHmac('sha256', hexDecode(secret));
    hmac.update(hexDecode(salt));
    hmac.update(target);
    return urlSafeBase64(hmac.digest());
};


// const s3Url = url => `s3://${process.env.S3_BUCKET_NAME}/${url}`;
export class ImgProxy {
    constructor({ IMGPROXY_KEY, IMGPROXY_SALT,IMGPROXY_SITE_HOST,IMGPROXY_S3_ENDPOINT }) {
        if (!IMGPROXY_KEY) {
            console.warn('[imgProxy] NO IMGPROXY_KEY');
            return;
        }
        if (!IMGPROXY_SALT) {
            console.warn('[imgProxy] NO IMGPROXY_SALT');
            return;
        }
        if (!IMGPROXY_SITE_HOST) {
            console.warn('[imgProxy] NO IMGPROXY_SITE_HOST');
            return;
        }
        this.IMGPROXY_KEY = IMGPROXY_KEY;
        this.IMGPROXY_SALT = IMGPROXY_SALT;
        this.IMGPROXY_SITE_HOST = IMGPROXY_SITE_HOST;
        this.IMGPROXY_S3_ENDPOINT = IMGPROXY_S3_ENDPOINT;
    }

    @memoize
    getSecure(url, options = {}) {
        // configs of resize: https://docs.imgproxy.net/#/generating_the_url_advanced?id=format-definition
        const resizing_type = options.resizingType || 'fill';
        const width = options.width || 300;
        const height = options.height || 300;

        const gravity = options.gravity || 'ce';
        const enlarge = options.enlarge || 1;
        const extension = options.extension || 'png';

        const encoded_url = urlSafeBase64(url);
        const path = `/${resizing_type}/${width}/${height}/${gravity}/${enlarge}/${encoded_url}.${extension}`;
        const signature = sign(this.IMGPROXY_SALT, path, this.IMGPROXY_KEY);
        return `${this.IMGPROXY_PROTOCOL || 'https'}://${this.IMGPROXY_SITE_HOST}/${signature}${path}`;
    }

    gen(url, options = {}) {
        if (!url) {
            return '';
        }

        const quality = `/q:${options.q || 85}`;
        const resize = `/rs:${options.fit ? 'fit' : 'fill'}:${options.w || 0}:${options.h || 0}`;
        const gravity = `/g:${options.g || 'ce'}`;
        const blur = `/bl:${options.bl || '0'}`;
        const background = options.bg ? `/bg:${options.bg}` : '';
        const ex = getFileExtension(url)[0].slice(1);
        const extension = `@${options.ex || ex}`;

        return `https://${process.env.IMGPROXY_SITE_HOST}/insecure${quality}${resize}${background}${gravity}${blur}/c:0/plain/${s3Url(url)}${extension}`;
    }

    cloudImage(path) {
        return `${process.env.IMGPROXY_S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${path}`;
    }
}
// import defu from 'defu';

export default ({ app }, inject) => {
    const  options = <%= serialize(options) %>;
    const imageProxy = new ImgProxy(options);
    app.$img = imageProxy;
    inject('img', imageProxy);
};
