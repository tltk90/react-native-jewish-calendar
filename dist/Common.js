'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.dayOfRoshHashana = dayOfRoshHashana;
exports.gim = gim;
exports.getYearType = getYearType;
exports.daysInYear = daysInYear;
exports.daysInMonth = daysInMonth;
exports.fixedDate = fixedDate;
var YEARBETWEENGEROGIANTOJEWISH = exports.YEARBETWEENGEROGIANTOJEWISH = 3761;
var MILISECONDINDAY = exports.MILISECONDINDAY = 1000 * 60 * 60 * 24;

/**
 * find the day in September that Rosh Hashana occour.
 * @param {number} year a georigian year
 * @returns {Date} the georgian date of rosh hashana
 * @see calculate rosh hashana day https://quasar.as.utexas.edu/BillInfo/ReligiousCalendars.html
 */
function dayOfRoshHashana(year) {
    var gn = year % 19 + 1;
    var n = Math.floor(year / 100) - Math.floor(year / 400) - 2 + 765433 / 492480 * (12 * gn % 19) + year % 4 / 4 - (313 * year + 89081) / 98496;
    var r = n % 1;
    n = Math.floor(n);
    var d = new Date(year, 8, n).getDay();
    var r1 = 12 * gn % 19;

    if (d == 0 || d == 3 || d == 5) {
        n += 1;
    } else if (d == 1 && r >= 23269 / 25920 && r1 > 11) {
        n += 1;
    } else if (d == 2 && r >= 1367 / 2160 && r1 > 6) {
        n += 2;
    }
    return fixedDate(new Date(year, 8, n));
}

/**
 * return the Gimatria value of a number
 * @param {number} num a number to as gimatria value
 */
function gim(num) {
    if ((typeof num === 'undefined' ? 'undefined' : _typeof(num)) == _typeof('1')) {
        num = parseInt(num);
    }
    var to10 = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
    var to100 = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
    var to1000 = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
    num = Math.floor(num);
    if (num > 1000) {
        return gim(Math.floor(num / 1000)) + "'" + gim(num % 1000);
    }
    var g = to1000[Math.floor(num / 100)] + to100[Math.floor(num % 100 / 10)] + to10[num % 10];
    g = '' + g;
    g = g.replace('יה', 'טו').replace('יו', 'טז');
    return g;
}

function getYearType(year) {
    var rosh = dayOfRoshHashana(year - YEARBETWEENGEROGIANTOJEWISH);
    var days = daysInYear(year);
    var leap = days > 380;
    var r = gim(rosh.getDay() + 1);
    var t = void 0;
    if (days % 10 == 3) t = 'ח';else if (days % 10 == 4) t = 'כ';else t = 'ש';
    var p = void 0;
    if (t === 'ח') {
        p = gim(new Date(rosh.getTime() + (leap ? 220 : 190) * MILISECONDINDAY).getDay() + 1);
    } else if (t == 'כ') {
        p = gim(new Date(rosh.getTime() + (leap ? 221 : 191) * MILISECONDINDAY).getDay() + 1);
    } else {
        p = gim(new Date(rosh.getTime() + (leap ? 222 : 192) * MILISECONDINDAY).getDay() + 1);
    }

    return r + t + p;
}

/**
 * return the days in hebew year
 * @param {number} year hebrew year to find her length
 */
function daysInYear(year) {
    var rosh = dayOfRoshHashana(year - YEARBETWEENGEROGIANTOJEWISH);
    var nextYear = dayOfRoshHashana(year - YEARBETWEENGEROGIANTOJEWISH + 1);

    return (nextYear - rosh) / MILISECONDINDAY;
}

function daysInMonth(month, isLeap, daysInYear) {
    if (month === 'כסלו') {
        return daysInYear % 10 == 3 ? 29 : 30;
    } else if (month === 'חשון') {
        return daysInYear % 10 == 5 ? 30 : 29;
    } else if (month === "אדר ב'") {
        return isLeap ? 29 : 0;
    } else if (month === 'אדר') {
        return isLeap ? 30 : 29;
    } else if (['תשרי', 'שבט', 'ניסן', 'סיון', 'אב'].includes(month)) {
        return 30;
    } else if (['טבת', "אדר ב'", 'אייר', 'תמוז', 'אלול'].includes(month)) {
        return 29;
    } else {
        return 0;
    }
}

function fixedDate(d) {
    //d.setHours(d.getHours() + 3) // fixed to GMC +3
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 3);
}