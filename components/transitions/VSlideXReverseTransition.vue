<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('slide-x-reverse-transition');
</script>
<style lang="scss">
    .slide-x-reverse-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            opacity: 0;
            transform: translateX(15px);
        }
    }
</style>
