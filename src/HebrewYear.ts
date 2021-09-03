import {
    dayOfRoshHashana,
    daysInMonth,
    daysInYear,
    fixedDate,
    YEAR_MONTHS,
    YEARBETWEENGEROGIANTOJEWISH,
    YearType,
    MONTHES, gimatria
} from './Common'
import { HebrewDay } from './HebrewDay';


export interface IHebDay {
    year: number;
    day: Date;
    hebDay: number;
    hebMonth: number;
    parasha: string;
    weekDay: number;
    toString: () => string;
}

function findRoshHashana(d): Date {
    let r = dayOfRoshHashana(d.getFullYear());
    if (r.getTime() - d > 0) r = dayOfRoshHashana(d.getFullYear() - 1);
    return r;
}

function findRoshHashanaForNextYear(d: Date): string {
    const r = dayOfRoshHashana(d.getFullYear() + 1);
    return gimatria(r.getDay() + 1);
}

export default class HebrewYear {
    rosh: Date;
    nextRoshHashanaDay: string;
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
        this.nextRoshHashanaDay = findRoshHashanaForNextYear(date);
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
                this.days.set(day.toLocaleDateString(), hebDay);
                day.setDate(day.getDate() + 1);
            }
        }
    }

    getDay(date: Date | string): HebrewDay | undefined {
        if(typeof date === 'string') {
            date = new Date(date);
        }
        if(!this.days.has(date.toLocaleDateString())) {
            this.createYear(date);
        }
        return this.days.get(date.toLocaleDateString());
    }

    getPesahDay() {
        return this.type.getPesahDayInWeek();
    }

    getRoshHashanaDay() {
        return this.type.getRoshHashanaDayInWeek();
    }

    getNextYearRoshHashana() {
        return this.nextRoshHashanaDay;
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
