<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('tab-transition');
</script>
<style lang="scss">
    .tab-transition {
        &-enter {
            transform: translate(100%, 0);
        }

        &-leave,
        &-leave-active {
            position: absolute;
            top: 0;
        }

        &-leave-to {
            position: absolute;
            transform: translate(-100%, 0);
        }
    }
</style>
