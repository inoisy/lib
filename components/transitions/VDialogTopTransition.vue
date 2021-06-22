<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('dialog-top-transition');
</script>
<style lang="scss">
    .dialog-top-transition {
        &-enter,
        &-leave-to {
            transform: translateY(-100%);
        }
    }
</style>
