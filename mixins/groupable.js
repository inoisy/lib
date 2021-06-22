/* eslint-disable no-unused-expressions,new-cap */
import { inject as RegistrableInject } from './registrable';


export function factory(
    namespace,
    child,
    parent,
) {
    return RegistrableInject(namespace, child, parent).extend({
        name: 'groupable',

        props: {
            activeClass: {
                type: String,
                default() {
                    if (!this[namespace]) {
                        return undefined;
                    }

                    return this[namespace].activeClass;
                },
            },
            disabled: Boolean,
        },

        data() {
            return {
                isActive: false,
            };
        },

        computed: {
            groupClasses() {
                if (!this.activeClass) {
                    return {};
                }

                return {
                    [this.activeClass]: this.isActive,
                };
            },
        },

        created() {
            this[namespace] && this[namespace].register(this);
        },

        beforeDestroy() {
            this[namespace] && this[namespace].unregister(this);
        },

        methods: {
            toggle() {
                this.$emit('change');
            },
        },
    });
}

const Groupable = factory('itemGroup');

export default Groupable;

// // Mixins
// import { inject as registrableInject } from './registrable';

// /* eslint-disable no-unused-expressions */
// export function factory(
//     namespace,
//     child,
//     parent,
// ) {
//     return registrableInject(namespace, child, parent).extend({
//         name: 'groupable',

//         props: {
//             activeClass: {
//                 type: String,
//                 default() {
//                     if (!this[namespace]) {
//                         return undefined;
//                     }

//                     return this[namespace].activeClass;
//                 },
//             },
//             disabled: Boolean,
//         },

//         data() {
//             return {
//                 isActive: false,
//             };
//         },

//         computed: {
//             groupClasses() {
//                 if (!this.activeClass) {
//                     return {};
//                 }

//                 return {
//                     [this.activeClass]: this.isActive,
//                 };
//             },
//         },

//         created() {
//             this[namespace] && this[namespace].register(this);
//         },

//         beforeDestroy() {
//             this[namespace] && this[namespace].unregister(this);
//         },

//         methods: {
//             toggle() {
//                 this.$emit('change');
//             },
//         },
//     });
// }

// const Groupable = factory('itemGroup');

// export default Groupable;
