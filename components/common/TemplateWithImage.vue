<script>
import VImg from '~~/common/components/ui/VImg/VImg';

export default {
    name: 'TemplateWithImage',
    props: {
        imgUrl: {
            type: String,
            default: null,
        },
    },
    methods: {
        genImg() {
            const img = this.$createElement(VImg, {
                props: {
                    src: this.imgUrl,
                    height: '100%',
                },
            });
            return this.$createElement('div', {
                staticClass: 'template-with-image__img',
            }, [img]);
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'template-with-image__content',
            }, this.$slots.default);
        },
    },
    render(h, ctx) {
        return h('div', { staticClass: 'template-with-image' }, [this.genImg(), this.genContent()]);
    },
};
</script>

<style lang="scss">
    $img-width: 33.33%;
    $content-width: #{100% - $img-width};

    /* stylelint-disable declaration-no-important */
    .template-with-image {
        display: flex;
        width: 100%;
        min-height: 100%;

        &__img {
            position: fixed;
            display: block;
            flex: 0 0 $img-width;
            width: $img-width;
            max-width: $img-width;
            height: 100%;

            @include respond-to(md) {
                display: none;
            }
        }

        &__content {
            display: flex;
            flex: 1 0 #{100% - $img-width};
            width: 100%;
            max-width: 100%;
            height: auto;
            padding-top: 55px;
            padding-right: 120px;
            padding-bottom: 40px;
            padding-left: calc(#{$img-width} + 120px);
            flex-direction: column;

            @include respond-to(lg) {
                padding-right: 56px;
                padding-left: calc(#{$img-width} + 56px);
            }

            @include respond-to(md) {
                padding-top: var(--gap-increased);
                padding-right: var(--gap);
                padding-bottom: var(--gap-increased);
                padding-left: var(--gap);
            }
        }
    }

</style>
