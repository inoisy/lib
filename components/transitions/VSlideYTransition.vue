<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('slide-y-transition');
</script>
<style lang="scss">
    .slide-y-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            opacity: 0;
            transform: translateY(-15px);
        }
    }
</style>
