import { Time } from './data';
import { PoolSocketData } from './websocket.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    //current GPIO state
    public readonly _chlorineOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly _heaterOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly _filterOn: BehaviorSubject<boolean> = new BehaviorSubject(false);

    // Scheduler toggles
    public readonly _chlorineScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly _heaterScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly _filterScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);

    // Timing Maps consisting of the start time and the stop time
    public readonly _chlorineTimings: BehaviorSubject<Map<Time, number>> = new BehaviorSubject(new Map<Time, number>()); // Start time and dose; dose here measured in millilitres
    public readonly _heaterTimings: BehaviorSubject<Map<Time, Time>> = new BehaviorSubject(new Map<Time, Time>());
    public readonly _filterTimings: BehaviorSubject<Map<Time, Time>> = new BehaviorSubject(new Map<Time, Time>());

    // The stopTime of the current quickdose and the three doses for the buttons
    public readonly _quickDoseTime: BehaviorSubject<Time> = new BehaviorSubject(null);
    public readonly _doses: BehaviorSubject<number[]> = new BehaviorSubject([0, 0, 0]);;

    // pool class to execute pool actions
    constructor() { }

    // Updates all these subjects TODO: USE pipe(distinct) or something so that it only updates when it needs to
    public updatePool(data: PoolSocketData){
        this._chlorineOn.next(data.chlorineOn);
        this._heaterOn.next(data.heaterOn);
        this._filterOn.next(data.filterOn);

        this._chlorineScheduled.next(data.chlorineScheduled);
        this._heaterScheduled.next(data.heaterScheduled);
        this._filterScheduled.next(data.filterScheduled);

        this._chlorineTimings.next(data.chlorineTimings);
        this._heaterTimings.next(data.heaterTimings);
        this._filterTimings.next(data.filterTimings);

        this._quickDoseTime.next(data.quickDoseTime);
        this._doses.next(data.doses)
    }


}

