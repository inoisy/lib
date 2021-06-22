<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('dialog-transition');
</script>
<style lang="scss">
    .dialog-transition {
        &-enter,
        &-leave-to {
            opacity: 0;
            transform: scale(.5);
        }

        &-enter-to,
        &-leave {
            opacity: 1;
        }
    }
</style>
