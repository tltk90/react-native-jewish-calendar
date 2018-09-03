
import HebrewYear from "./HebrewYear";
import { MILISECONDINDAY } from './Common'

export function getHebDate(d){
    if(!d) {
        d = new Date()
    }
    let hebYear = new HebrewYear(d)
    //console.log(hebYear.montes[0])
    let days = Math.floor((d - hebYear.rosh) / MILISECONDINDAY)
    console.log(`${days} of ${hebYear.days}`)
    return hebYear.montes[days]
}