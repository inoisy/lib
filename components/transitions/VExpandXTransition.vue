<script>
import {
    createJavascriptTransition,
} from '../../utils/transitions/createTransition';
import expandTransitionGenerator from '../../utils/transitions/expand-transition';

export default createJavascriptTransition('expand-x-transition', expandTransitionGenerator('', true));
</script>
<style lang="scss">
    .expand-x-transition {
        @include transition-default();
    }
</style>
