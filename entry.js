'use strict';

require("!style-loader!css-loader!./style.css");
require("!style-loader!css-loader!./tooltip.css");

$.fn.show = function (speed, oldCallback) {
    return $(this).each(function () {
        var obj = $(this),
            newCallback = function () {
                if ($.isFunction(oldCallback)) {
                    oldCallback.apply(obj);
                }
                obj.trigger('afterShow');
            };

        // you can trigger a before show if you want
        obj.trigger('beforeShow');

        // now use the old function to show the element passing the new callback
        _oldShow.apply(obj, [speed, newCallback]);
    });
}

module.exports.init = function (selector, data, settings, callback) {
    var mc = require('./matrix.js');
    $(function () {
        let containers = $(`.${selector}`);
        let items = [];

        for (let i = 0; i < containers.length; i++)
        {
            let c = containers[i];
            let m = mc.create(data, settings);
            $(c).append(m.dom);
            items.push(m);
        }
        if (callback) {
            callback(items);
        }
    });
    return;
}