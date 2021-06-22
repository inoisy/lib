import Vue from 'vue';

import Clickoutside from './click-outside';
import Intersect from './intersect';
import Resize from './resize';
import Scroll from './scroll';
import Ripple from './ripple';
import Hover from './hover';
import IntersectGroup from './intersect-group';
import TouchPan from './touch-pan';
import TouchSwipe from './touch-swipe';
import TouchHold from './touch-hold';
import TouchRepeat from './touch-repeat';

Vue.directive('click-outside', Clickoutside);
Vue.directive('intersect', Intersect);
Vue.directive('resize', Resize);
Vue.directive('scroll', Scroll);
Vue.directive('ripple', Ripple);
Vue.directive('hover', Hover);
Vue.directive('intersect-group', IntersectGroup);

Vue.directive('touch-pan', TouchPan);
Vue.directive('touch-swipe', TouchSwipe);
Vue.directive('touch-hold', TouchHold);
Vue.directive('touch-repeat', TouchRepeat);
