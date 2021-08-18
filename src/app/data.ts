// Dosage pump dosing speed
const litres_per_hour: number = 0.96;

// Class modeling a time passed since 00:00
export class Time {
    //This should be in minutes since 00:00
    private time: number = 0;

    // new Time based on either minutes, text or a Date
    constructor(time: any) {
        if (typeof (time) === "number") { this.minutes = time; }
        else if (typeof (time) === "string") { this.text = time; }
        else if (time.constructor.name === "Date") {
            this.text =
                (time as Date).getHours() + ":" + (time as Date).getMinutes();
        }
    }

    public get minutes() {
        return this.time;
    }

    public get text() {
        var hours = Math.floor(this.minutes / 60);
        var minutes = this.minutes % 60;
        return String(hours).padStart(2, "0") + ':' + String(minutes).padStart(2, "0")
    }

    public set minutes(minutes: number) {
        if (minutes < 0 || minutes > 1440) {
            throw new Error('Invalid amount of minutes');
        }
        this.time = minutes;
    }

    public set text(time: string) {
        var hours: number = parseInt(time.split(':')[0]);
        var minutes: number = parseInt(time.split(':')[1]);

        this.time = minutes + hours * 60;
    }

    // adds this Time to another
    public add(time: Time): Time {
        var time: Time = new Time(this.minutes + time.minutes);
        if (time.minutes > 1440) time = new Time(time.minutes - 1440);
        return time;
    }

    public subtract(time: Time): Time {
        var minutes: number = this.minutes - time.minutes;
        if (minutes < 0) minutes = 1440 - time.minutes;
        return new Time(minutes);
    }

    public fromNow(): Time {
        return this.subtract(Time.now())
    }

    public static now(): Time {
        return new Time(new Date());
    }
}

// class to configure the pins for the different IOs
export class PinConfig {
    // pool
    public pool_chlorinePump: number = 10;
    public pool_filter: number = 8;
    public pool_heater: number = 12;

    // hot tub
    public hottub_heater: number = 16;
    public hottub_pump: number = 18;
    public hottub_filterPump: number = 22;
    public hottub_UVLamp: number = 24;
    public hottub_chlorinePump: number = 26;
    // public hottub_LED: number = 0;

    public tempSensors: number = 7;
}

export class HotTubData { }

export enum Section {
    Chlorine,
    Heater,
    Filter,
}

/**
 * Function to check if a point in time is scheduled by a timing Map.
 * Basically checks all timeframes of a map if they include the time.
 *
 * @param  {Time} time The time to check
 * @param  {Map<Time, Time>} timings The timing map to check against
 * @return {boolean} True if time is contained in a timing map, false if not
 */
export function isScheduled(time: Time, timings: Map<Time, Time>): boolean {
    for (const [startTime, stopTime] of timings.entries()) {
        if (isInTimeframe(time, startTime, stopTime)) return true;
    }
    return false;
}

/**
 * Function to check if a Time is within a timeframe, hence inbetween start and stop
 *
 * @param  {Time} time The time to check
 * @param  {Time} start The start Time of the timeframe to check against
 * @param  {Time} stop The stop Time of the timeframe to check against
 * @returns {boolean} True if time is within the timeframe, false if not
 */
export function isInTimeframe(time: Time, start: Time, stop: Time): boolean {
    //Check if the timeframe is simple or loops around a day
    if (start.minutes > stop.minutes) { // if stop is before start it loops
        //check if the point in time happens after start or before stop
        return (time.minutes >= start.minutes || time.minutes <= stop.minutes);
    } else {
        //Check if the point in time is inbetween
        return (time.minutes >= start.minutes && time.minutes <= stop.minutes);
    }
}

/**
 * Function to convert a ml dose into a Time
 * Add this to the start time to receive the stop time
 * @param  {any} object - Any of the Data classes.
 */
export function doseToTime(dosis_ml: number): Time {
    var ml_per_hour = litres_per_hour * 1000;
    var ml_per_minute = ml_per_hour / 60; // At the rate of 0.96 L/h this should be 16 mL/min

    return new Time(dosis_ml / ml_per_minute);
}

export function toJSON(object: any): string {
    return JSON.stringify(object, replacer);
}

export function fromJSON(json: string): any {
    var object: any = new Object();
    return Object.assign(object, JSON.parse(json, reviver));
}

//function for map serialization to JSON
function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else if (value instanceof Time) {
        return {
            dataType: 'Time',
            minutes: value.minutes,
        };
    } else {
        return value;
    }
}

//function for map serialization from JSON
function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }else if(value.dataType === 'Time') {
            return new Time(value.minutes);
        }
    }
    return value;
}
