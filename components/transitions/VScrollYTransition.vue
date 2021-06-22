<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('scroll-y-transition');
</script>
<style lang="scss">
    .scroll-y-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            opacity: 0;
        }

        &-enter {
            transform: translateY(-15px);
        }

        &-leave-to {
            transform: translateY(15px);
        }
    }
</style>
