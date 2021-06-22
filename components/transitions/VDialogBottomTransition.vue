<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('dialog-bottom-transition');
</script>
<style lang="scss">
    .dialog-bottom-transition {
        &-enter,
        &-leave-to {
            transform: translateY(100%);
        }
    }
</style>
