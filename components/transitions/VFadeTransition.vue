<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('fade-transition');
</script>
<style lang="scss">
    .fade-transition {
        @include transition-default();

        &-enter,
        &-leave-to {
            opacity: 0;
        }
    }
</style>
