import Vue from 'vue';
import { isCssColor } from '../../utils/colorUtils';
import { consoleError } from '../../utils/console';
export default Vue.extend({
    props: {
        /* eslint-disable-next-line vue/require-default-prop */
        color: String,
    },
    methods: {
        setBackgroundColor(color = false, data = {}) {
            if (typeof data.style === 'string') {
                // istanbul ignore next
                consoleError('style must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (typeof data.class === 'string') {
                // istanbul ignore next
                consoleError('class must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    'background-color': `${color}`,
                    'border-color': `${color}`,
                };
            } else if (color) {
                data.class = {
                    ...data.class,
                    [color]: true,
                };
            }

            return data;
        },

        setTextColor(color = false, data= {}) {
            if (typeof data.style === 'string') {
            // istanbul ignore next
                consoleError('style must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (typeof data.class === 'string') {
            // istanbul ignore next
                consoleError('class must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    color: `${color}`,
                    'caret-color': `${color}`,
                };
            } else if (color) {
                const [colorName, colorModifier] = color.toString().trim()
                    .split(' ', 2);
                data.class = {
                    ...data.class,
                    [colorName + '--text']: true,
                };
                if (colorModifier) {
                    data.class['text--' + colorModifier] = true;
                }
            }
            return data;
        },
    },
});
