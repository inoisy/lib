import Vue from 'vue';
import SvgIcon from './components/SvgIcon';
import sprites from '~svgsprite/sprites.json';

const icons = sprites.reduce((acc, val) => {
    const namespace = val.defaultSprite ? '' : `${val.name}/`;
    acc.push(...val.symbols.map(symbol => `${namespace}${symbol}`));
    return acc;
}, []);

Vue.component('SvgIcon', SvgIcon);

function generateName(name) {
    return name
        .toLowerCase()
        .replace(/\.svg$/, '')
        .replace(/[^a-z0-9-]/g, '-');
}

export default function svgSprite(options) {
    async function getIcon(name) {
        let [sprite, icon] = name.split('/');

        if (!icon) {
            icon = sprite;
            sprite = options.defaultSprite;
        }

        /**
     * Find sprite file name after nuxt build
     * @param {string} sprite Name of a sprite
     */
        const spriteFile = await options.importSprite(sprite).then(res => res.default || res);

        return { sprite, icon, url: spriteFile + `#i-${generateName(icon)}` };
    }
    async function renderIcon(name) {
        const gettedIcon = await getIcon(name);
        return `
            <svg class="${options.spriteClass} ${options.spriteClassPrefix}${gettedIcon.sprite}">
                <use href="${gettedIcon.url}" />
            </svg>`;
    }
    return {
        icons,
        getIcon,
        renderIcon,
        modern: options.modern,
        spriteClassPrefix: options.spriteClassPrefix,
        spriteClass: options.spriteClass,
    };
}
