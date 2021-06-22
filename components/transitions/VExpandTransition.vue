<script>
import {
    createJavascriptTransition,
} from '../../utils/transitions/createTransition';
import expandTransitionGenerator from '../../utils/transitions/expand-transition';

export default createJavascriptTransition('expand-transition', expandTransitionGenerator());
</script>
<style lang="scss">
    .expand-transition {
        @include transition-default();
    }
</style>
