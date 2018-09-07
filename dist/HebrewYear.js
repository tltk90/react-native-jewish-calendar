'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = require('./Common');

var Common = _interopRequireWildcard(_Common);

var _ParashatShavoa = require('./ParashatShavoa');

var _ParashatShavoa2 = _interopRequireDefault(_ParashatShavoa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MONTHES = ['', 'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', "אדר ב'", 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
var WEEKDAY = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

function findRoshHashana(d) {
    var r = Common.dayOfRoshHashana(d.getFullYear());
    if (r - d > 0) r = Common.dayOfRoshHashana(d.getFullYear() - 1);
    return r;
}

var HebrewYear = function HebrewYear(date) {
    _classCallCheck(this, HebrewYear);

    this.rosh = findRoshHashana(Common.fixedDate(new Date(date)));
    this.year = this.rosh.getFullYear() + Common.YEARBETWEENGEROGIANTOJEWISH;
    this.days = Common.daysInYear(this.year);
    this.leap = this.days > 380;
    this.type = Common.getYearType(this.year);
    this.montes = createYear(this.rosh, this.leap, this.days, this.type, this.year);

    function createYear(_rosh, leap, days, type, year) {
        var roshHashhanaDay = _rosh.getDay();
        var day = new Date(_rosh);
        var a = [];
        var w = 0;
        for (var i = 1; i < 23; i++) {
            var p = getParashaBeforeBershit(i);
            a.push(new HebrewDay(day, i, 1, year, p, leap, 30));
            day.setDate(day.getDate() + 1);
        }
        MONTHES.forEach(function (month, m) {
            if (m == 0) return;
            if (month == MONTHES[7] && !leap) return;
            var dayInMonth = Common.daysInMonth(month, leap, days);
            for (var _i = m == 1 ? 23 : 1; _i <= dayInMonth; _i++) {
                var _p = getParasha(_i, month);
                a.push(new HebrewDay(day, _i, m, year, _p, leap, dayInMonth));
                day.setDate(day.getDate() + 1);
            }
        });

        return a;

        function getParasha(i, m) {
            if (m == MONTHES[8]) {
                switch (type[2]) {
                    case 'א':
                        {
                            if (i >= 15 && i <= 21) return 'פסח';
                            break;
                        }
                    case 'ג':
                        {
                            if (i >= 13 && i <= 19) return 'פסח';
                            break;
                        }
                    case 'ה':
                        {
                            if (i >= 11 && i <= 17) return 'פסח';
                            break;
                        }
                    case 'ז':
                        {
                            if (i >= 9 && i <= 15) return 'פסח';
                            break;
                        }
                    default:
                        {
                            if (day.getDay() == 0) {
                                w++;
                            }
                            return (0, _ParashatShavoa2.default)(type, w);
                        }
                }
            }
            if (type[0] === 'ז' && m == MONTHES[13] && i >= 24) return 'ראש השנה';
            if (day.getDay() == 0) {
                w++;
            }
            return (0, _ParashatShavoa2.default)(type, w);
        }
        /**
         * get parasha from rosh hashana to simhat tora
         */
        function getParashaBeforeBershit(d) {
            switch (roshHashhanaDay) {
                case 1:
                    {
                        if (d >= 1 && d <= 6) return 'וילך';else if (d >= 7 && d <= 13) return 'האזינו';else if (d >= 14 && d <= 20) return 'סוכות';else return 'בראשית';
                    }
                case 2:
                    {
                        if (d >= 1 && d <= 5) return 'וילך';else if (d >= 6 && d <= 12) return 'האזינו';else if (d >= 13 && d <= 19) return 'סוכות';else return 'בראשית';
                    }
                case 4:
                    {
                        if (d >= 1 && d <= 3) return 'האזינו';else if (d >= 4 && d <= 10) return 'יום הכיפורים';else if (d >= 11 && d <= 17) return 'סוכות';else return 'בראשית';
                    }

                case 6:
                    {
                        if (d == 1) return 'ראש השנה';else if (d >= 2 && d <= 8) return 'האזינו';else if (d >= 9 && d <= 15) return 'סוכות';else return 'בראשית';
                    }
            }
        }
    }
};

exports.default = HebrewYear;

var HebrewDay = function () {
    function HebrewDay(d, d1, m, y, p, l, dim) {
        _classCallCheck(this, HebrewDay);

        this.year = y;
        this.day = new Date(d);
        this.hebDay = d1;
        this.hebMonth = m;
        this.parasha = p;
        this.leapYear = l;
        this.weekDay = this.day.getDay();
        this.isFullMonth = function () {
            //console.log('day in month' + dim)
            return dim == 30;
        };
    }

    _createClass(HebrewDay, [{
        key: 'toString',
        value: function toString() {
            return '\u05D9\u05D5\u05DD ' + WEEKDAY[this.weekDay] + ', ' + Common.gim(this.hebDay) + ' \u05D1' + MONTHES[this.hebMonth] + ' ' + Common.gim(this.year);
        }
    }]);

    return HebrewDay;
}();