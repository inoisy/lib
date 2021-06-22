<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('scale-transition');
</script>
<style lang="scss">
    .scale-transition {
        @include transition-default();

        &-enter,
        &-leave,
        &-leave-to {
            opacity: 0;
            transform: scale(0);
        }
    }
</style>
