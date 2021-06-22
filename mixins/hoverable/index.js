/* eslint-disable new-cap */

// import Vue from 'vue';
// Mixins
import mixins from '../../utils/mixins';
import Delayable from '../delayable';
// import Toggleable from '../toggleable';
import { factory as ToggleableFactory } from '../toggleable';

// import { consoleWarn } from '../../utils/console';

export default mixins(Delayable, ToggleableFactory('hoverValue', 'hover')).extend({
    name: 'Hoverable',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        hoverValue: {
            type: Boolean,
            default: undefined,
        },
    },
    // created() {
    //     let element;
    //     if (this.$scopedSlots.default) {
    //         element = this.$scopedSlots.default({ hover: this.isActive });
    //     }
    //     this._g(element.data, {
    //         mouseenter: this.onMouseEnter,
    //         mouseleave: this.onMouseLeave,
    //     });
    // },
    methods: {
        onMouseEnter() {
            this.runDelay('open');
        },
        onMouseLeave() {
            this.runDelay('close');
        },
    },
});

// Utilities
// import mixins from '../../../utils/mixins';
// import { consoleWarn } from '../../../utils/console';

// export default mixins(Delayable, Toggleable).extend({
//     name: 'VHover',

//     props: {
//         disabled: {
//             type: Boolean,
//             default: false,
//         },
//         value: {
//             type: Boolean,
//             default: undefined,
//         },
//     },

//     methods: {
//         onMouseEnter() {
//             this.runDelay('open');
//         },
//         onMouseLeave() {
//             this.runDelay('close');
//         },
//     },

//     render() {
//         if (!this.$scopedSlots.default && this.value === undefined) {
//             consoleWarn('v-hover is missing a default scopedSlot or bound value', this);

//             return null;
//         }

//         let element;

//         /* istanbul ignore else */
//         if (this.$scopedSlots.default) {
//             element = this.$scopedSlots.default({ hover: this.isActive });
//         }

//         if (Array.isArray(element) && element.length === 1) {
//             element = element[0];
//         }

//         if (!element || Array.isArray(element) || !element.tag) {
//             consoleWarn('v-hover should only contain a single element', this);

//             return element;
//         }

//         if (!this.disabled) {
//             element.data = element.data || {};
//             this._g(element.data, {
//                 mouseenter: this.onMouseEnter,
//                 mouseleave: this.onMouseLeave,
//             });
//         }

//         return element;
//     },
// });
