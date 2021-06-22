<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('fab-transition', 'center center', 'out-in');
</script>
<style lang="scss">
    .fab-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            transform: scale(0) rotate(-45deg);
        }
    }
</style>
