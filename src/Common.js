export const YEARBETWEENGEROGIANTOJEWISH = 3761
export const MILISECONDINDAY = 1000 * 60 * 60 * 24

/**
 * find the day in September that Rosh Hashana occour.
 * @param {number} year a georigian year
 * @returns {Date} the georgian date of rosh hashana
 * @see calculate rosh hashana day https://quasar.as.utexas.edu/BillInfo/ReligiousCalendars.html
 */
export function dayOfRoshHashana(year) {
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
    return fixedDate(new Date(year, 8, n));

}

/**
 * return the Gimatria value of a number
 * @param {number} num a number to as gimatria value
 */
export function gim(num) {
    if (typeof (num) == typeof ('1')) {
        num = parseInt(num)
    }
    const to10 = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט']
    const to100 = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ']
    const to1000 = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק']
    num = Math.floor(num)
    if (num > 1000) {
        return gim(Math.floor(num / 1000)) + "'" + gim(num % 1000)
    }
    let g = to1000[Math.floor(num / 100)] + to100[Math.floor((num % 100) / 10)] + to10[num % 10]
    g = '' + g
    g = g.replace('יה', 'טו').replace('יו', 'טז')
    return g
}


export function getYearType(year) {
    let rosh = dayOfRoshHashana(year - YEARBETWEENGEROGIANTOJEWISH);
    let days = daysInYear(year)
    let leap = days > 380
    let r = gim(rosh.getDay() + 1)
    let t;
    if (days % 10 == 3) t = 'ח'
    else if (days % 10 == 4) t = 'כ'
    else t = 'ש'
    let p;
    if (t === 'ח') {
        p = gim(new Date(rosh.getTime() + ((leap ? 220 : 190) * MILISECONDINDAY)).getDay() + 1)
    }
    else if (t == 'כ') {
        p = gim(new Date(rosh.getTime() + ((leap ? 221 : 191) * MILISECONDINDAY)).getDay() + 1)
    }
    else {
        p = gim(new Date(rosh.getTime() + ((leap ? 222 : 192) * MILISECONDINDAY)).getDay() + 1)
    }

    return r + t + p
}


/**
 * return the days in hebew year
 * @param {number} year hebrew year to find her length
 */
export function daysInYear(year){
    let rosh = dayOfRoshHashana(year - YEARBETWEENGEROGIANTOJEWISH)
    let nextYear = dayOfRoshHashana(year - YEARBETWEENGEROGIANTOJEWISH + 1)

    return (nextYear - rosh) / MILISECONDINDAY;
}


export function daysInMonth(month, isLeap, daysInYear) {
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

export function fixedDate(d){
    //d.setHours(d.getHours() + 3) // fixed to GMC +3
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 3);
}