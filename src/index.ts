
import HebrewYear, {IHebDay} from "./HebrewYear";

export function getHebDate(d): IHebDay{
    if(!d) {
        d = new Date();
    }
    let hebYear = new HebrewYear(d);
    const hebDay = hebYear.getDay(d);
    if(hebDay === undefined) {
        throw new Error('unexpected error');
    }

    return hebDay;
}

export function createHebYear(year?: number): HebrewYear {
    let now = new Date();
    if(year) {
        now.setFullYear(year, 9);
    }
    return new HebrewYear(now);
}
