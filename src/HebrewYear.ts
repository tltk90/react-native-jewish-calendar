import {
    dayOfRoshHashana,
    DAYS_WEEK,
    daysInMonth,
    daysInYear,
    fixedDate,
    gimatria,
    YEAR_MONTHS,
    YEARBETWEENGEROGIANTOJEWISH,
    YearType
} from './Common'
import parshatShavoa from './ParashatShavoa'


export interface IHebDay {
    year: number;
    day: Date;
    hebDay: number;
    hebMonth: number;
    parasha: string;
    weekDay: number;
    toString: () => string;
}
const MONTHES: Array<'' | YEAR_MONTHS> = ['', YEAR_MONTHS.TESHRI, YEAR_MONTHS.HESVAN, YEAR_MONTHS.KESLEV,
    YEAR_MONTHS.TEVET, YEAR_MONTHS.SHVAT, YEAR_MONTHS.ADAR, YEAR_MONTHS.ADARB,
    YEAR_MONTHS.NISAN, YEAR_MONTHS.IAR, YEAR_MONTHS.SIVAN, YEAR_MONTHS.TAMUZ,
    YEAR_MONTHS.AV, YEAR_MONTHS.ELOL];
const WEEKDAY = [DAYS_WEEK.RESON, DAYS_WEEK.SHENI, DAYS_WEEK.SHLISHI,
    DAYS_WEEK.REVEI, DAYS_WEEK.HAMESHI, DAYS_WEEK.SHISHI, DAYS_WEEK.SHABAT];

function findRoshHashana(d): Date {
    let r = dayOfRoshHashana(d.getFullYear());
    if (r.getTime() - d > 0) r = dayOfRoshHashana(d.getFullYear() - 1);
    return r;
}

export default class HebrewYear {
    rosh: Date;
    hebYear: number;
    daysInYear: number;
    leap: boolean;
    type: YearType;
    weeksWithParash: number;
    days: Map<string, HebrewDay>;


    constructor(date) {
        this.createYear(date)
    }

    private createYear(date) {
        this.rosh = findRoshHashana(fixedDate(new Date(date)));
        this.hebYear = this.rosh.getFullYear() + YEARBETWEENGEROGIANTOJEWISH;
        this.daysInYear = daysInYear(this.hebYear);
        this.leap = this.daysInYear > 380;
        this.type = new YearType(this.rosh, this.daysInYear, this.leap);
        this.days = new Map();
        this.weeksWithParash = 0;
        let day = new Date(this.rosh);
        for(let m = 1; m <= MONTHES.length - 1; m++) {
            const month: YEAR_MONTHS = MONTHES[m] as YEAR_MONTHS;
            if(month === YEAR_MONTHS.ADARB && !this.leap) continue;
            let _daysInMonth = daysInMonth(month, this.leap, this.daysInYear);
            for( let i = 1; i <= _daysInMonth; i++) {
                const hebDay = new HebrewDay(day, i, m, this);
                this.days.set(day.toDateString(), hebDay);
                day.setDate(day.getDate() + 1);
            }
        }
    }

    getDay(date: Date | string): HebrewDay | undefined {
        if(typeof date === 'string') {
            date = new Date(date);
        }
        if(!this.days.has(date.toDateString())) {
            this.createYear(date);
        }
        return this.days.get(date.toDateString());
    }

    getPesahDay() {
        return this.type.getPesahDayInWeek();
    }

    getRoshHashanaDay() {
        return this.type.getRoshHashanaDayInWeek();
    }

    getYearLength() {
        return this.type.getYearLength();
    }

    checkIfMonthIsFull(month: number) {
        if( month < 1 || month > 13) {
            throw new Error('no such month');
        }
        let _daysInMonth = daysInMonth(MONTHES[month] as YEAR_MONTHS, this.leap, this.daysInYear);
        return _daysInMonth === 30;
    }
}

class HebrewDay implements IHebDay{
    day: Date;
    year: number;
    hebDay: number;
    hebMonth: number;
    parasha: string;
    weekDay: number;
    _isFullMonth: boolean;
    constructor(date, day, month, y) {
        this.year = y.hebYear;
        this.day = new Date(date);
        this.hebDay = day;
        this.hebMonth = month;
        this.weekDay = this.day.getDay() ;
        this.parasha = this.getParasha(y);
        this._isFullMonth = y.checkIfMonthIsFull(this.hebMonth);
    }

    /**
     * @deprecated use checkIfMonthIsFull from the year instance
     */
    isFullMonth() {
        return this._isFullMonth;
    }
    toString(): string {
        return `יום ${WEEKDAY[this.weekDay]}, ${gimatria(this.hebDay)} ב${MONTHES[this.hebMonth]} ${gimatria(this.year)}`;
    }

    private getParasha(HebYear) {
        const month = MONTHES[this.hebMonth];
        if(month === YEAR_MONTHS.TESHRI) {
            if(this.hebDay < 23) return this.getParashaBeforeBershit(HebYear);
            else if(HebYear.rosh.getDay() === 6 && this.hebDay < 29) {
                return 'בראשית'
            }
        }
        if (month === YEAR_MONTHS.NISAN) {
            switch (HebYear.getPesahDay()) {
                case 'א': {
                    if (this.hebDay >= 15 && this.hebDay <= 21) return 'פסח';
                    break;
                }
                case 'ג': {
                    if (this.hebDay >= 13 && this.hebDay <= 19) return 'פסח';
                    break;
                }
                case 'ה': {
                    if (this.hebDay >= 11 && this.hebDay <= 17) return 'פסח';
                    break;
                }
                case 'ז': {
                    if (this.hebDay >= 9 && this.hebDay <= 15) return 'פסח';
                    break;
                }
                default: {
                    if (this.day.getDay() == 0) { HebYear.weeksWithParash++; }
                    return parshatShavoa(HebYear.type.toString(), HebYear.weeksWithParash);
                }
            }
        }
        if(HebYear.getRoshHashanaDay() === 'ז' && (month == MONTHES[13] && this.hebDay >= 24)) return 'ראש השנה';
        if (this.day.getDay() == 0) { HebYear.weeksWithParash++; }
        return parshatShavoa(HebYear.type.toString(), HebYear.weeksWithParash)

    }

    /**
     * get parasha from rosh hashana to simhat tora
     */
    private getParashaBeforeBershit(HebYear): string {
        switch (HebYear.getRoshHashanaDay()) {
            case 'ב': {
                if (this.hebDay >= 1 && this.hebDay <= 6) return 'וילך';
                else if (this.hebDay >= 7 && this.hebDay <= 13) return 'האזינו';
                else if (this.hebDay >= 14 && this.hebDay <= 20) return 'סוכות';
                else return 'בראשית';
            }
            case 'ג': {
                if (this.hebDay >= 1 && this.hebDay <= 5) return 'וילך';
                else if (this.hebDay >= 6 && this.hebDay <= 12) return 'האזינו';
                else if (this.hebDay >= 13 && this.hebDay <= 19) return 'סוכות';
                else return 'בראשית';
            }
            case 'ה': {
                if (this.hebDay >= 1 && this.hebDay <= 3) return 'האזינו';
                else if (this.hebDay >= 4 && this.hebDay <= 10) return 'יום הכיפורים';
                else if (this.hebDay >= 11 && this.hebDay <= 17) return 'סוכות';
                else return 'בראשית';
            }

            case 'ז': {
                if (this.hebDay == 1) return 'ראש השנה';
                else if (this.hebDay >= 2 && this.hebDay <= 8) return 'האזינו';
                else if (this.hebDay >= 9 && this.hebDay <= 22) return 'סוכות';
                else return 'בראשית';
            }
            default: return '';
        }
    }

}
