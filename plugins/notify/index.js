import Vue from 'vue';
import Notifications from './Notify.vue';

const defaults = {};
/* eslint-disable no-unused-expressions,no-use-before-define,brace-style */

const notifTypes = {
    positive: {
        icon() {
            return 'error';
        },
        color: 'positive',
    },

    negative: {
        icon() {
            return 'error';
        },
        color: 'negative',
    },

    warning: {
        icon() {
            return 'error';
        },
        color: 'warning',
        textColor: 'dark',
    },

    info: {
        icon() {
            return 'error';
        },
        color: 'info',
    },

    ongoing: {
        group: false,
        timeout: 0,
        spinner: true,
        color: 'grey-8',
    },
};

class Notify {
    constructor() {
        this.__vm = new Vue(Notifications);
        this.create = function(opts) {
            return this.__vm.add(opts);
        };
        this.setDefaults = function(opts) {
            opts === Object(opts) && Object.assign(defaults, opts);
        };
        this.registerType = function(typeName, typeOpts) {
            notifTypes[typeName] = typeOpts;
        };
        this.setDefaults({});
    }
}

export default function(ctx, inject) {
    const notifyPlugin = new Notify();
    ctx.$notify = notifyPlugin;
    inject('notify', notifyPlugin);
    if (!ctx.app.mixins) {
        ctx.app.mixins = [];
    }
    ctx.app.mixins.push({
        mounted() {
            const node = document.createElement('div');
            document.body.appendChild(node);
            notifyPlugin.__vm.$mount(node);
        },
    });
}
