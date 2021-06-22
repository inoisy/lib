<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('carousel-reverse-transition');
</script>
<style lang="scss">
    .carousel-reverse-transition {
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
