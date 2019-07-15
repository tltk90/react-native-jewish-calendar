import * as Common from './Common'
import parshatShavoa from './ParashatShavoa'


export interface IHebDay {
    year: number;
    day: Date;
    hebDay: number;
    hebMonth: number;
    parasha: string;
    leapYear: boolean;
    weekDay: number;
    isFullMonth: () => boolean;
    toString: () => string;
}
const MONTHES = ['', 'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', "אדר ב'", 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
const WEEKDAY = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת',];

function findRoshHashana(d): Date {
    let r = Common.dayOfRoshHashana(d.getFullYear());
    if (r.getTime() - d > 0) r = Common.dayOfRoshHashana(d.getFullYear() - 1);
    return r;
}

export default class HebrewYear {
    rosh: Date;
    year: number;
    days: number;
    leap: boolean;
    type: string;
    montes: HebrewDay[];


    constructor(date) {
        this.rosh = findRoshHashana(Common.fixedDate(new Date(date)));
        this.year = this.rosh.getFullYear() + Common.YEARBETWEENGEROGIANTOJEWISH;
        this.days = Common.daysInYear(this.year);
        this.leap = this.days > 380;
        this.type = Common.getYearType(this.year);
        this.montes = createYear(this.rosh, this.leap, this.days, this.type, this.year);


        function createYear(_rosh, leap, days, type, year): IHebDay[] {
            let roshHashhanaDay = _rosh.getDay();
            let day = new Date(_rosh);
            let a: IHebDay[] = [];
            let w = 0;
            MONTHES.forEach( (month, m) => {
                if(m == 0 || (month == MONTHES[7] && !leap)) return;
                let dayInMonth = Common.daysInMonth(month, leap, days);
                for( let i = 1; i<= dayInMonth; i++){
                    let p = getParasha(i, month);
                    a.push(new HebrewDay(day, i, m, year, p, leap, dayInMonth ));
                    day.setDate(day.getDate() + 1)
                }
            });
            return a;

            function getParasha(d: number, m: string) {
                if(m == MONTHES[1] && d < 23) return getParashaBeforeBershit(d);
                if (m == MONTHES[8]) {
                    switch (type[2]) {
                        case 'א': {
                            if (d >= 15 && d <= 21) return 'פסח';
                            break;
                        }
                        case 'ג': {
                            if (d >= 13 && d <= 19) return 'פסח';
                            break;
                        }
                        case 'ה': {
                            if (d >= 11 && d <= 17) return 'פסח';
                            break;
                        }
                        case 'ז': {
                            if (d >= 9 && d <= 15) return 'פסח';
                            break;
                        }
                        default: {
                            if (day.getDay() == 0) { w++; }
                            return parshatShavoa(type, w)
                        }
                    }
                }
                if(type[0] === 'ז' && (m == MONTHES[13] && d >= 24)) return 'ראש השנה'
                if (day.getDay() == 0) { w++; }
                return parshatShavoa(type, w)

            }
            /**
             * get parasha from rosh hashana to simhat tora
             */
            function getParashaBeforeBershit(d): string {
                switch (roshHashhanaDay) {
                    case 1: {
                        if (d >= 1 && d <= 6) return 'וילך';
                        else if (d >= 7 && d <= 13) return 'האזינו';
                        else if (d >= 14 && d <= 20) return 'סוכות';
                        else return 'בראשית';
                    }
                    case 2: {
                        if (d >= 1 && d <= 5) return 'וילך';
                        else if (d >= 6 && d <= 12) return 'האזינו';
                        else if (d >= 13 && d <= 19) return 'סוכות';
                        else return 'בראשית';
                    }
                    case 4: {
                        if (d >= 1 && d <= 3) return 'האזינו';
                        else if (d >= 4 && d <= 10) return 'יום הכיפורים';
                        else if (d >= 11 && d <= 17) return 'סוכות';
                        else return 'בראשית';
                    }

                    case 6: {
                        if (d == 1) return 'ראש השנה';
                        else if (d >= 2 && d <= 8) return 'האזינו';
                        else if (d >= 9 && d <= 15) return 'סוכות';
                        else return 'בראשית';
                    }
                    default: return '';
                }
            }
        }
    }
    
}


class HebrewDay implements IHebDay{
    year: number;
    day: Date;
    hebDay: number;
    hebMonth: number;
    parasha: string;
    leapYear: boolean;
    weekDay: number;
    isFullMonth: () => boolean;
    constructor(d, d1, m, y, p, l, dim) {
        this.year = y;
        this.day = new Date(d)
        this.hebDay = d1;
        this.hebMonth = m;
        this.parasha = p;
        this.leapYear = l;
        this.weekDay = this.day.getDay() ;
        this.isFullMonth = () => {
            return dim == 30;
        }
    }

    toString(): string {
        return `יום ${WEEKDAY[this.weekDay]}, ${Common.gim(this.hebDay)} ב${MONTHES[this.hebMonth]} ${Common.gim(this.year)}`;
    }
}
