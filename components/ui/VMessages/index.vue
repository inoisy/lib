<script>

// Mixins
import Colorable from '../../../mixins/colorable';
import Themeable from '../../../mixins/themeable';

import mixins from '../../../utils/mixins';

// Utilities
import { getSlot } from '../../../utils/helpers';


export default mixins(Colorable, Themeable).extend({
    name: 'VMessages',

    props: {
        value: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        genChildren() {
            return this.$createElement('transition-group', {
                staticClass: 'v-messages__wrapper',
                attrs: {
                    name: 'message-transition',
                    tag: 'div',
                },
            }, this.value.map(this.genMessage));
        },
        genMessage(message, key) {
            return this.$createElement('div', {
                staticClass: 'v-messages__message',
                key: key,
            }, getSlot(this, 'default', { message, key }) || [message]);
        },
    },

    render(h) {
        return h('div', this.setTextColor(this.color, {
            staticClass: 'v-messages',
            class: this.themeClasses,
        }), [this.genChildren()]);
    },
});

</script>
<style lang="scss">


    $messages-font-size: 12px !default;
    $messages-line-height: $messages-font-size !default;
    $messages-min-height: 14px !default;
    // $messages-font-size: 12px;
    $messages-min-height: unset;

    /* Theme */
    @include theme(v-messages) using ($material) {
        color: map-deep-get($material, 'text', 'secondary');
    }

    .v-messages {
        position: relative;
        flex: 1 1 auto;
        min-width: 1px; // Ensure takes up space with no messages and inside of flex
        min-height: $messages-min-height;

        //   +ltr()
        text-align: left;
        font-size: $messages-font-size;

        //   +rtl()
        //     text-align: right

        &__message {
            word-wrap: break-word;
            line-height: $messages-line-height;
            word-break: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
        }
    }

</style>
