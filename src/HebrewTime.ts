export interface IHebrewTime {
    sunrise: Date | undefined;
    sunset: Date | undefined;
}

export interface ISunTime {
    hour: number;
    minute: number;
}

const deg2rad = (deg) => Math.PI / 180 * deg;
const rad2deg = (rad) => 180 / Math.PI * rad;
const adjust = (val, min = 0, max = 360) => {
    let inBound = val;
    while (inBound < min) {
        inBound += max;
    }
    while (inBound >= max) {
        inBound -= max;
    }
    return inBound;
}

const approximateTime = (lngHour: number, dayOfYear: number, sunrise = true) => {
    return sunrise ? dayOfYear + ((6 - lngHour) / 24) : dayOfYear + ((18 - lngHour) / 24);
}

const sunMeanAnomaly = (approximateTime) => {
    return (0.9856 * approximateTime) - 3.289;
}

const sunTrueLongitude = (sunMean: number) => {
    const sin = Math.sin;
    const sunMeadInRad = deg2rad(sunMean);
    return adjust(sunMean + (1.916 * sin(sunMeadInRad)) + (0.020 * sin(2 * sunMeadInRad)) + 282.634);
}

const sunRightAscension = (sunTrueLongitude: number) => {
    const atan = Math.atan;
    const tan = Math.tan;
    const tempRA = adjust(rad2deg(atan(0.91764 * tan(deg2rad(sunTrueLongitude)))));
    const Lquadrant = (Math.floor(sunTrueLongitude / 90)) * 90;
    const RAquardant = (Math.floor(tempRA / 90)) * 90;
    const sameQuardantRA = tempRA + (Lquadrant - RAquardant);
    return sameQuardantRA / 15;
}

const sunDeclination = (trueLongitude: number) => {
    const sin = Math.sin;
    const cos = Math.cos;
    const asin = Math.asin;
    const sinDec = 0.39782 * sin(deg2rad(trueLongitude));
    const cosDec = cos(asin(sinDec));
    return { sin: sinDec, cos: cosDec };
}

const localHourAngle = (zenith: number, latitude: number, sunDec: any) => {
    const sin = Math.sin;
    const cos = Math.cos;
    const latitudeInRad = deg2rad(latitude);
    const cosZenith = cos(deg2rad(zenith));
    return (cosZenith - (sunDec.sin * sin(latitudeInRad))) / (sunDec.cos * cos(latitudeInRad));
}

const getHour = (cosH: number, sunrise = true) => {
    const acosH = rad2deg(Math.acos(cosH));
    const H = sunrise ? 360 - acosH : acosH;
    return H / 15;
}

const meanTIme = (hour: number, RA: number, apx: number) => {
    return hour + RA - (0.06571 * apx) - 6.622;
}

const UTCTime = (meanTime: number, lngHour: number): ISunTime => {
    const time = adjust(meanTime - lngHour, 0, 24);
    const hour = Math.floor(time);
    const minute = Math.abs(hour - time) * 60;
    return { hour, minute };
}

/**
 * Calculate the sunrise and sunset of a date
 * base on: http://edwilliams.org/sunrise_sunset_algorithm.htm
 */
export default class HebrewTime implements IHebrewTime {
    static dayOfYear(date: Date): number {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const N1 = Math.floor(275 * month / 9);
        const N2 = Math.floor((month + 9) / 12);
        const N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3));
        return N1 - (N2 * N3) + day - 30;
    }

    sunrise: Date | undefined;
    sunset: Date | undefined;

    constructor(date: Date, lat: number, long: number, zenith: number) {
        this.sunrise = new Date(date);
        this.sunset = new Date(date);
        const utcTimeSunrise: ISunTime | undefined = this.calcTime(date, lat, long, zenith, true);
        const utcTimeSunset: ISunTime | undefined = this.calcTime(date, lat, long, zenith, false);
        if (utcTimeSunrise) {
            this.sunrise.setUTCHours(utcTimeSunrise.hour, utcTimeSunrise.minute);
        }
        else {
            this.sunrise = undefined;
        }
        if( utcTimeSunset) {
            this.sunset.setUTCHours(utcTimeSunset.hour, utcTimeSunset.minute);
        }
        else {
            this.sunset = undefined;
        }
    }

    private calcTime(date: Date, lat: number, long: number, zenith: number, sunrise: boolean): ISunTime | undefined {
        const dayOfYear = HebrewTime.dayOfYear(date);
        const lngHour = long / 15;
        const apxTime = approximateTime(lngHour, dayOfYear, sunrise);
        const sunMean = sunMeanAnomaly(apxTime);
        const sunTrueLng = sunTrueLongitude(sunMean);
        const sunRA = sunRightAscension(sunTrueLng);
        const sunDec = sunDeclination(sunTrueLng);
        const cosH = localHourAngle(zenith, lat, sunDec);
        if (sunrise && cosH > 1) return undefined;
        if (!sunrise && cosH < -1) return undefined;
        const H = getHour(cosH, sunrise);
        const meanTime = meanTIme(H, sunRA, apxTime);
        const utc = UTCTime(meanTime, lngHour);
        return utc;

    }
}