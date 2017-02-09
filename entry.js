'use strict';

require("!style-loader!css-loader!./style.css");

module.exports.init = function (selector, data) {
    var mc = require('./matrix.js');
    var m = mc.create(data);

    $(function () {
        $(`.${selector}`).append(m.render());
    });
    return m;
}