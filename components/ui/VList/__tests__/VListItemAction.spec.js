// Components
import VListItemAction from '../VListItemAction';

// Utilities
import Vue from 'vue';
import {
    mount,
} from '@vue/test-utils';
import { functionalContext } from '../../../../../test';
/* eslint-disable vue/one-component-per-file */
describe('VListItemAction.js', () => {
    let mountFunction;

    beforeEach(() => {
        mountFunction = (options = {}) => mount(VListItemAction, {
            ...options,
        });
    });

    it('should render component and match snapshot', () => {
        const wrapper = mountFunction(functionalContext());

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render component with static class and match snapshot', () => {
        const wrapper = mountFunction(functionalContext({
            staticClass: 'static-class',
        }));

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render component with many children and match snapshot', () => {
        const content1 = mount(Vue.component('Content1', {
            render: h => h('div'),
        })).vNode;
        const content2 = mount(Vue.component('Content2', {
            render: h => h('span'),
        })).vNode;
        const wrapper = mountFunction(functionalContext({}, [content1, content2]));

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render component with one children and match snapshot', () => {
        const visible = mount(Vue.component('Visible', {
            render: h => h('div') || h(),
        })).vNode;
        const notVisible = mount(Vue.component('NotVisible', {
            render: h => h() || h('span'),
        })).vNode;

        const wrapper = mountFunction(functionalContext({}, [visible, notVisible]));

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should work with v-html', () => {
        const wrapper = mountFunction({
            context: Object.assign({
                domProps: {
                    innerHTML: '<b>something</b>',
                },
                data: {},
                props: {},
            }),
        });

        expect(wrapper.html()).toMatchSnapshot();
    });
});
