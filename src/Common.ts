export const YEARBETWEENGEROGIANTOJEWISH = 3761;
export const MILISECONDINDAY = 1000 * 60 * 60 * 24;

enum YEAR_LENGTH {
    HASER = 'ח',
    SHLEMA = 'ש',
    KASEDER = 'כ'
}

export enum YEAR_MONTHS {
    TESHRI = 'תשרי',
    HESVAN = 'חשון',
    KESLEV = 'כסלו',
    TEVET = 'טבת',
    SHVAT = 'שבט',
    ADAR = 'אדר',
    ADARA = `אדר א'`,
    ADARB = `אדר ב'`,
    NISAN = 'ניסן',
    IAR = 'אייר',
    SIVAN = 'סיון',
    TAMUZ = 'תמוז',
    AV = 'אב',
    ELOL = 'אלול'
}

export enum DAYS_WEEK {
    RESON = 'ראשון',
    SHENI = 'שני',
    SHLISHI = 'שלישי',
    REVEI = 'רביעי',
    HAMESHI = 'חמישי',
    SHISHI = 'שישי',
    SHABAT = 'שבת'
}

export type WEEK_DAY_LETTER = 'א' | 'ב' | 'ג' | 'ד' | 'ה' | 'ו' | 'ז'

export const MONTHES: Array<'' | YEAR_MONTHS> = ['', YEAR_MONTHS.TESHRI, YEAR_MONTHS.HESVAN, YEAR_MONTHS.KESLEV,
    YEAR_MONTHS.TEVET, YEAR_MONTHS.SHVAT, YEAR_MONTHS.ADAR, YEAR_MONTHS.ADARB,
    YEAR_MONTHS.NISAN, YEAR_MONTHS.IAR, YEAR_MONTHS.SIVAN, YEAR_MONTHS.TAMUZ,
    YEAR_MONTHS.AV, YEAR_MONTHS.ELOL];

export const WEEKDAY = [DAYS_WEEK.RESON, DAYS_WEEK.SHENI, DAYS_WEEK.SHLISHI,
    DAYS_WEEK.REVEI, DAYS_WEEK.HAMESHI, DAYS_WEEK.SHISHI, DAYS_WEEK.SHABAT];

/**
 * find the day in September that Rosh Hashana occour.
 * @param {number} year a georigian year
 * @returns {Date} the georgian date of rosh hashana
 * @see calculate rosh hashana day https://quasar.as.utexas.edu/BillInfo/ReligiousCalendars.html
 */
export function dayOfRoshHashana(year) {
    let gn = (year % 19) + 1;
    let n = Math.floor(year / 100) - Math.floor(year / 400) - 2 + 765433 / 492480 * ((12 * gn) % 19) + (year % 4) / 4 - (313 * year + 89081) / 98496
    let r = n % 1;
    n = Math.floor(n);
    let d = new Date(year, 8, n).getDay();
    let r1 = (12 * gn) % 19;

    if (d == 0 || d == 3 || d == 5) {
        n += 1;
    }
    else if (d == 1 && r >= (23269 / 25920) && r1 > 11) {
        n += 1;
    }
    else if (d == 2 && r >= (1367 / 2160) && r1 > 6) {
        n += 2;
    }
    return fixedDate(new Date(year, 8, n));

}

/**
 * return the Gimatria value of a number
 * @param {number} num a number to as gimatria value
 */
export function gimatria(num) {
    if (typeof (num) == typeof ('1')) {
        num = parseInt(num)
    }
    const to10 = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
    const to100 = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
    const to1000 = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
    num = Math.floor(num);
    if (num > 1000) {
        return gimatria(Math.floor(num / 1000)) + "'" + gimatria(num % 1000);
    }
    let g = to1000[Math.floor(num / 100)] + to100[Math.floor((num % 100) / 10)] + to10[num % 10];
    g = '' + g;
    g = g.replace('יה', 'טו').replace('יו', 'טז');
    return g;
}

/**
 * return the days in hebew year
 * @param {number} year hebrew year to find her length
 */
export function daysInYear(year){
    let rosh = dayOfRoshHashana(year - YEARBETWEENGEROGIANTOJEWISH);
    let nextYear = dayOfRoshHashana(year - YEARBETWEENGEROGIANTOJEWISH + 1);

    return (nextYear.getTime() - rosh.getTime()) / MILISECONDINDAY;
}


export function daysInMonth(month: YEAR_MONTHS, isLeap: boolean, daysInYear: number) {
    switch (month) {
        case YEAR_MONTHS.KESLEV:
            return daysInYear % 10 === 3 ? 29 : 30;
        case YEAR_MONTHS.HESVAN:
            return daysInYear % 10 === 5 ? 30 : 29;
        case YEAR_MONTHS.ADAR:
            return isLeap ? 30 : 29;
        case YEAR_MONTHS.TESHRI:
        case YEAR_MONTHS.SHVAT:
        case YEAR_MONTHS.NISAN:
        case YEAR_MONTHS.SIVAN:
        case YEAR_MONTHS.AV:
            return 30;
        case YEAR_MONTHS.TEVET:
        case YEAR_MONTHS.ADARB:
        case YEAR_MONTHS.IAR:
        case YEAR_MONTHS.TAMUZ:
        case YEAR_MONTHS.ELOL:
            return 29;
        default:
            throw new Error(`no such month ${month}`);
    }
}

export function fixedDate(d){
    //d.setHours(d.getHours() + 3) // fixed to GMC +3
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 3);
}

export class YearType {
    rosh: Date;
    pesah: Date;
    daysInYear: number;
    leap: boolean;
    length: YEAR_LENGTH;
    constructor(_rosh, _daysInYear, _leap) {
        this.rosh = _rosh;
        this.daysInYear = _daysInYear;
        this.leap = _leap;
        this.findType();
        this.findPesahDate();
    }

    private findPesahDate() {
        if (this.length === YEAR_LENGTH.HASER) {
            this.pesah = new Date(this.rosh.getTime() + ((this.leap ? 220 : 190) * MILISECONDINDAY))
        }
        else if (this.length == YEAR_LENGTH.KASEDER) {
            this.pesah = new Date(this.rosh.getTime() + ((this.leap ? 221 : 191) * MILISECONDINDAY))
        }
        else {
            this.pesah = new Date(this.rosh.getTime() + ((this.leap ? 222 : 192) * MILISECONDINDAY))
        }
    }

    private findType() {
        if (this.daysInYear % 10 == 3) this.length = YEAR_LENGTH.HASER;
        else if (this.daysInYear % 10 == 4) this.length = YEAR_LENGTH.KASEDER;
        else this.length = YEAR_LENGTH.SHLEMA;
    }
    getRoshHashanaDayInWeek(): WEEK_DAY_LETTER {
        return gimatria(this.rosh.getDay() + 1);
    }

    getPesahDayInWeek() {
        return gimatria( this.pesah.getDay() + 1);
    }

    getYearLength() {
        return this.length;
    }

    toString() {
        return this.getRoshHashanaDayInWeek() + this.getYearLength() + this.getPesahDayInWeek();
    }

}
