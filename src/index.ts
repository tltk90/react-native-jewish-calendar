
import HebrewYear, {IHebDay} from "./HebrewYear";
import { MILISECONDINDAY } from './Common'
import HebrewTime from "./HebrewTime";

export function getHebDate(d): IHebDay{
    if(!d) {
        d = new Date();
    }
    let hebYear = new HebrewYear(d);
    let days = Math.floor((d - hebYear.rosh.getTime()) / MILISECONDINDAY);
    return hebYear.montes[days];
}

export function getHebTime(date: Date = new Date(), lat: number = 31.778453, lng: number = 35.224872, zenith: number = 90.83333333333333){
    return new HebrewTime(date, lat, lng, zenith);
}
