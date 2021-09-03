import { gimatria, WEEKDAY, YEAR_MONTHS, MONTHES } from './Common';
import parshatShavoa from './ParashatShavoa';
import HebrewYear, { IHebDay } from './HebrewYear';


export class HebrewDay implements IHebDay{
	day: Date;
	year: number;
	hebDay: number;
	hebMonth: number;
	parasha: string;
	weekDay: number;
	isFullMonth: () => boolean;
	constructor(date: Date, day: number, month: number, y: HebrewYear) {
		const isFullMonth = y.checkIfMonthIsFull(month);
		this.year = y.hebYear;
		this.day = new Date(date);
		this.hebDay = day;
		this.hebMonth = month;
		this.weekDay = this.day.getDay() ;
		this.parasha = this.getParasha(y);

		/**
		 * @deprecated use checkIfMonthIsFull from the year instance
		 */
		this.isFullMonth = () => isFullMonth;
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
		if(HebYear.getNextYearRoshHashana() === 'ז' && (month == MONTHES[13] && this.hebDay >= 24)) return 'ראש השנה';
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
