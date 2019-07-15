
import HebrewYear, {IHebDay} from "./HebrewYear";
import { MILISECONDINDAY } from './Common'

export function getHebDate(d): IHebDay{
    if(!d) {
        d = new Date();
    }
    let hebYear = new HebrewYear(d);
    let days = Math.floor((d - hebYear.rosh.getTime()) / MILISECONDINDAY);
    return hebYear.montes[days];
}
