<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('slide-x-transition');
</script>
<style lang="scss">
    .slide-x-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            opacity: 0;
            transform: translateX(-15px);
        }
    }
</style>
