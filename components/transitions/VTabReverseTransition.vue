<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('tab-reverse-transition');
</script>
<style lang="scss">
    .tab-reverse-transition {
        &-enter {
            transform: translate(-100%, 0);
        }

        &-leave,
        &-leave-to {
            position: absolute;
            top: 0;
            transform: translate(100%, 0);
        }
    }
</style>
