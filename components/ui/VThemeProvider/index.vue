<script>
// Mixins
import Themeable from '../../../mixins/themeable';


export default Themeable.extend({
    name: 'VThemeProvider',

    props: { root: Boolean },

    computed: {
        isDark() {
            return this.root
                ? this.rootIsDark
                : Themeable.options.computed.isDark.call(this);
        },
    },

    render() {
        /* istanbul ignore next */
        return (
            this.$slots.default && this.$slots.default.find(node => node && node.isComment && node.text !== ' ')
        );
    },
});

</script>
