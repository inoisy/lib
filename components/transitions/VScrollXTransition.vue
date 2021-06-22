<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('scroll-x-transition');
</script>
<style lang="scss">
    .scroll-x-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            opacity: 0;
        }

        &-enter {
            transform: translateX(-15px);
        }

        &-leave-to {
            transform: translateX(15px);
        }
    }
</style>
