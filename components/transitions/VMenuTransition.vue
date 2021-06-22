<script>
import {
    createSimpleTransition,
} from '../../utils/transitions/createTransition';
export default createSimpleTransition('menu-transition');
</script>
<style lang="scss">
    /* stylelint-disable declaration-no-important */
    .v-menu-transition-enter {
        &.v-menu__content--auto {
            transition: none !important;

            .v-list-item {
                opacity: 0;
                transform: translateY(-15px);
            }

            .v-list-item--active {
                opacity: 1;
                transform: none !important;
                pointer-events: auto;
            }
        }
    }
</style>
