
import getDeviceFromRequest from '~platfrom/device.js'
import Breakpoint from '~platfrom/breakpoint.js'
import Application from '~platfrom/application.js'

export default ({req,app}, inject) => {
    const  options = <%= serialize(options) %>;

    const device = getDeviceFromRequest(req,options)
    const breakpoint = new Breakpoint(options, device);

    app.$device = device;
    inject('device', device);

    app.$breakpoint = breakpoint;
    inject('breakpoint', breakpoint);


    const application = new Application();

    app.$application = application;
    inject('application', application);
};
// ctx.$device = device;
// ctx.$breakpoint = breakpoint;
