<script>
import { template as templateCompiler } from 'lodash';
export default {
    name: 'VTemplateCompiler',
    props: {
        html: {
            type: String,
            default: '',
        },
        variables: {
            type: Object,
            default: () => ({ property: null, address: null }),
        },
        isCompile: {
            type: Boolean,
            default: true,
        },
    },

    methods: {
        genCompiledContent() {
            let html = this.html;
            try {
                const compiledTemplate = templateCompiler(html);
                html = compiledTemplate({ ...this.variables });
            } catch (error) {
                console.log('ERROR WHILE COMPILING TEMPLATE: ', error);
            }
            return html;
        },
    },

    render: function(createElement) {
        const html = this.isCompile ? this.genCompiledContent() : this.html;
        return createElement('div', {
            key: 'contentWrapper',
            class: 'contentWrapper',
            domProps: {
                innerHTML: html,
            },
        });
    },
};
</script>
