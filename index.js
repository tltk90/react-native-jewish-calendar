const Parasha = require('./ParashatShavoa')

const MONTHES = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', "אדר ב'", 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
const WEEKDAY = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת',]
const YEARBETWEENGEROGIANTOJEWISH = 3761
const MILISECONDINDAY = 1000 * 60 * 60 * 24

function buildYear(rosh, daysInYear, isLeap) {
    let days = [];
    let month = 0;
    let curr = rosh;

    for (let i = 0; i < daysInYear;) {
        let dim = daysInMonth(MONTHES[month])
        for (let j = 1; j <= dim; j++) {
            days.push(createDay(j, MONTHES[month]))
            curr.setTime(curr.getTime() + MILISECONDINDAY);
        }
        i += dim
        month++;
    }

    return days;
    
    function daysInMonth(month) {
        if (month === 'כסלו') {
            return daysInYear % 10 == 3 ? 29 : 30
        }
        else if (month === 'חשון') {
            return daysInYear % 10 == 5 ? 30 : 29
        }
        else if (month === "אדר ב'") {
            return isLeap ? 29 : 0
        }
        else if (month === 'אדר') {
            return isLeap ? 30 : 29
        }
        else if (['תשרי', 'שבט', 'ניסן', 'סיון', 'אב'].includes(month)) {
            return 30
        }
        else if (['טבת', "אדר ב'", 'אייר', 'תמוז', 'אלול'].includes(month)) {
            return 29
        }
        else {
            return 0;
        }
    }

    function createDay(d, m) {
        let o = {}
        o['day'] = gim(d)
        o['month'] = m
        o['year'] = gim(rosh.getFullYear() + YEARBETWEENGEROGIANTOJEWISH)
        o['date'] = new Date(curr);
        o['weekDay'] = WEEKDAY[curr.getDay()]
        return o;
    }
}
class JewishCalendar {
    constructor() {
        let today = new Date();
        let rsh = gaussroshhashanacalculater(today.getFullYear())
        if (rsh - today > 0) {
            rsh = gaussroshhashanacalculater(today.getFullYear() - 1)
        }

        let nextYear = gaussroshhashanacalculater(rsh.getFullYear() + 1)

        this.__Rosh = new Date(rsh)
        this.yearDays = Math.ceil((nextYear - rsh) / MILISECONDINDAY)
        this.leap = this.yearDays > 380
        this.georDate = today;
        //this.hebDate = {}
        this.type = this.getType();
        this.hebYear = buildYear(this.__Rosh, this.yearDays, this.leap);
    }


    /* getParasha() {
         let dayToShabat = 6 - this.__Rosh.getDay();
         let shabatShelHoshana = new Date(this.__Rosh.getTime() + ((dayToShabat + 21) * MILISECONDINDAY))
         let shabat = new Date(this.georDate.getTime() + ((6 - this.georDate.getDay()) * MILISECONDINDAY))
         shabat.setHours(0, 0, 0)
         console.log(dayToShabat)
         console.log(shabatShelHoshana.toLocaleString())
         console.log(shabat.toLocaleString())
 
         let weeks = Math.floor((shabat - shabatShelHoshana) / (MILISECONDINDAY * 7))
         let type = getType(this);
         return Parasha.getParasha(type, weeks)
 
 
         function getType(jc) {
             let r = gim(jc.Rosh.getDay() + 1)
             let t;
             if (jc.yearDays % 10 == 3) t = 'ח'
             else if (jc.yearDays % 10 == 4) t = 'כ'
             else t = 'ש'
             let p;
             if (t === 'ח') {
                 p = gim(new Date(jc.Rosh.getTime() + ((jc.leap ? 207 : 177) * MILISECONDINDAY)).getDay() + 1)
             }
             else if (t == 'כ') {
                 p = gim(new Date(jc.Rosh.getTime() + ((jc.leap ? 208 : 178) * MILISECONDINDAY)).getDay() + 1)
             }
             else {
                 p = gim(new Date(jc.Rosh.getTime() + ((jc.leap ? 209 : 179) * MILISECONDINDAY)).getDay() + 1)
             }
 
             return r + t + p
         }
     } */

    getType() {
        let r = gim(this.__Rosh.getDay() + 1)
        let t;
        if (this.yearDays % 10 == 3) t = 'ח'
        else if (this.yearDays % 10 == 4) t = 'כ'
        else t = 'ש'
        let p;
        if (t === 'ח') {
            p = gim(new Date(this.__Rosh.getTime() + ((this.leap ? 207 : 177) * MILISECONDINDAY)).getDay() + 1)
        }
        else if (t == 'כ') {
            p = gim(new Date(this.__Rosh.getTime() + ((this.leap ? 208 : 178) * MILISECONDINDAY)).getDay() + 1)
        }
        else {
            p = gim(new Date(this.__Rosh.getTime() + ((this.leap ? 209 : 179) * MILISECONDINDAY)).getDay() + 1)
        }

        return r + t + p
    }
}

/**
 * find the day in September that Rosh Hashana occour.
 * @param {number} year a georigian year
 * @returns {Date} the georgian date of rosh hashana
 */
function gaussroshhashanacalculater(year) {
    let gn = (year % 19) + 1
    let n = Math.floor(year / 100) - Math.floor(year / 400) - 2 + 765433 / 492480 * ((12 * gn) % 19) + (year % 4) / 4 - (313 * year + 89081) / 98496
    let r = n % 1;
    n = Math.floor(n)
    let d = new Date(year, 8, n).getDay()
    let r1 = (12 * gn) % 19

    if (d == 0 || d == 3 || d == 5) {
        n += 1
    }
    else if (d == 1 && r >= (23269 / 25920) && r1 > 11) {
        n += 1
    }
    else if (d == 2 && r >= (1367 / 2160) && r1 > 6) {
        n += 2
    }
    return new Date(year, 8, n);

}

function gim(num) {
    if (typeof (num) == typeof ('1')) {
        num = parseInt(num)
    }
    to10 = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט']
    to100 = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ']
    to1000 = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק']
    num = Math.floor(num)
    if (num > 1000) {
        return gim(Math.floor(num / 1000)) + "'" + gim(num % 1000)
    }
    g = to1000[Math.floor(num / 100)] + to100[Math.floor((num % 100) / 10)] + to10[num % 10]
    g = '' + g
    g = g.replace('יה', 'טו').replace('יו', 'טז')
    return g
}

module.exports = {
    JewishCalendar
}
/*
        let daysFromRosh = Math.round((today - rsh) / MILISECONDINDAY)
        MONTHES.some((month, index) => {
            let daysInMonth;
            if (month === 'כסלו') {
                daysInMonth = this.yearDays % 10 == 3 ? 29 : 30
            }
            else if (month === 'חשון') {
                daysInMonth = this.yearDays % 10 == 5 ? 30 : 29
            }
            else if (month === "אדר ב'") {
                daysInMonth = this.leap ? 29 : 0
            }
            else if (month === 'אדר') {
                daysInMonth = this.leap ? 30 : 29
            }
            else if (['תשרי', 'שבט', 'ניסן', 'סיון', 'אב'].includes(month)) {
                daysInMonth = 30
            }
            else if (['טבת', "אדר ב'", 'אייר', 'תמוז', 'אלול'].includes(month)) {
                daysInMonth = 29
            }
            if (daysFromRosh < daysInMonth) {
                this.hebDate = {
                    year: rsh.getFullYear() + YEARBETWEENGEROGIANTOJEWISH,
                    month: MONTHES[index],
                    day: daysFromRosh + 1
                }
                return true;
            }
            else {
                daysFromRosh -= daysInMonth
            }
        })

        this.hebDate['parasha'] = this.getParasha() */