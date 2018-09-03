"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHebDate = getHebDate;

var _HebrewYear = require("./HebrewYear");

var _HebrewYear2 = _interopRequireDefault(_HebrewYear);

var _Common = require("./Common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHebDate(d) {
    if (!d) {
        d = new Date();
    }
    var hebYear = new _HebrewYear2.default(d);
    //console.log(hebYear.montes[0])
    var days = Math.floor((d - hebYear.rosh) / _Common.MILISECONDINDAY);
    console.log(days + " of " + hebYear.days);
    return hebYear.montes[days];
}