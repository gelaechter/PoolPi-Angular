import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DataControllerService {
    //current state
    chlorineOn: boolean;
    heaterOn: boolean;
    filterOn: boolean;

    //current override state, true, false or null
    chlorineOverride: boolean = null;
    heaterOverride: boolean = null;
    filterOverride: boolean = null;

    //Timer toggles
    chlorineTimer: boolean;
    heaterTimer: boolean;
    filterTimer: boolean;

    //Timer timings
    chlorineTimings: {start: Time, stop: Time}[];
    heaterTimings: {start: Time, stop: Time}[];
    filterTimings: {start: Time, dosage: number, stop: Time}[]; //"stop" here being a calculated value

    constructor() {}
}


