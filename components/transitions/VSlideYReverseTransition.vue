<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('slide-y-reverse-transition');
</script>
<style lang="scss">
    .slide-y-reverse-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            opacity: 0;
            transform: translateY(15px);
        }
    }
</style>
