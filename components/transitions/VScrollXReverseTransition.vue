<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('scroll-x-reverse-transition');
</script>
<style lang="scss">
    .scroll-x-reverse-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            opacity: 0;
        }

        &-enter {
            transform: translateX(15px);
        }

        &-leave-to {
            transform: translateX(-15px);
        }
    }
</style>
