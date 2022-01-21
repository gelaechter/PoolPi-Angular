import { Time } from "./data";
import { PoolSocketData, ConfigSocketData, HotTubSocketData } from "./websocket.service";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// DataService class containing the server data as observable objects which are updated when receiving new data from the websocket service
@Injectable({
    providedIn: "root",
})
export class DataService {
    // current application mode
    public readonly _poolMode: BehaviorSubject<boolean> = new BehaviorSubject(true);

    // GPIO Pins
    public readonly _gPoolChlorinePump: BehaviorSubject<number> = new BehaviorSubject(0)
    public readonly _gPoolFilter: BehaviorSubject<number> = new BehaviorSubject(0)
    public readonly _gPoolHeater: BehaviorSubject<number> = new BehaviorSubject(0)

    public readonly _gHotTubHeater_Pump: BehaviorSubject<number> = new BehaviorSubject(0)
    public readonly _gHotTubFilter_UV: BehaviorSubject<number> = new BehaviorSubject(0)
    public readonly _gHotTubChlorinePump: BehaviorSubject<number> = new BehaviorSubject(0)

    public readonly _gTempSensors: BehaviorSubject<number> = new BehaviorSubject(0)

    // ####################################################################################################################
    // is GPIO on
    public readonly _pChlorineOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly _pHeaterOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly _pFilterOn: BehaviorSubject<boolean> = new BehaviorSubject(false);

    // Scheduler toggles
    public readonly _pChlorineScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly _pHeaterScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly _pFilterScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);

    // Timing Maps consisting of the start time and the stop time
    public readonly _pChlorineTimings: BehaviorSubject<Map<Time, number>> = new BehaviorSubject(new Map<Time, number>()); // Start time and dose; dose here measured in millilitres
    public readonly _pHeaterTimings: BehaviorSubject<Map<Time, Time>> = new BehaviorSubject(new Map<Time, Time>());
    public readonly _pFilterTimings: BehaviorSubject<Map<Time, Time>> = new BehaviorSubject(new Map<Time, Time>());

    // The stopTime of the current quickdose and the three doses for the buttons
    public readonly _pQuickDoseTime: BehaviorSubject<Time> = new BehaviorSubject(null);
    public readonly _pDoses: BehaviorSubject<number[]> = new BehaviorSubject([0, 0, 0]);

    // ####################################################################################################################
    // is GPIO on
    public readonly _hChlorineOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly _hHeaterOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly _hFilterOn: BehaviorSubject<boolean> = new BehaviorSubject(false);

    // Scheduler toggles
    public readonly _hChlorineScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly _hHeaterScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly _hFilterScheduled: BehaviorSubject<boolean> = new BehaviorSubject(true);

    // Timing Maps consisting of the start time and the stop time
    public readonly _hChlorineTimings: BehaviorSubject<Map<Time, number>> = new BehaviorSubject(new Map<Time, number>()); // Start time and dose; dose here measured in millilitres
    public readonly _hHeaterTimings: BehaviorSubject<Map<Time, Time>> = new BehaviorSubject(new Map<Time, Time>());
    public readonly _hFilterTimings: BehaviorSubject<Map<Time, Time>> = new BehaviorSubject(new Map<Time, Time>());

    // Temp sensor readings
    public readonly _hCurrentTemp: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _hGoalTemp: BehaviorSubject<number> = new BehaviorSubject(0);

    // The stopTime of the current quickdose and the three doses for the buttons
    public readonly _hQuickDoseTime: BehaviorSubject<Time> = new BehaviorSubject(null);
    public readonly _hDoses: BehaviorSubject<number[]> = new BehaviorSubject([0, 0, 0]);

    // ####################################################################################################################



    // Updates all the pool related subjects
    public updatePool(data: PoolSocketData): void{
        this._pChlorineOn.next(data.chlorineOn);
        this._pHeaterOn.next(data.heaterOn);
        this._pFilterOn.next(data.filterOn);

        this._pChlorineScheduled.next(data.chlorineScheduled);
        this._pHeaterScheduled.next(data.heaterScheduled);
        this._pFilterScheduled.next(data.filterScheduled);

        this._pChlorineTimings.next(data.chlorineTimings);
        this._pHeaterTimings.next(data.heaterTimings);
        this._pFilterTimings.next(data.filterTimings);

        this._pQuickDoseTime.next(data.quickDoseTime);
        this._pDoses.next(data.doses);
    }

    // Updates all the hottub related subjects
    public updateHotTub(data: HotTubSocketData): void{
        this._hChlorineOn.next(data.chlorineOn);
        this._hHeaterOn.next(data.heaterOn);
        this._hFilterOn.next(data.filterOn);

        this._hGoalTemp.next(data.goalTemperature);

        this._hChlorineScheduled.next(data.chlorineScheduled);
        this._hHeaterScheduled.next(data.heaterScheduled);
        this._hFilterScheduled.next(data.filterScheduled);

        this._hChlorineTimings.next(data.chlorineTimings);
        this._hHeaterTimings.next(data.heaterTimings);
        this._hFilterTimings.next(data.filterTimings);

        this._hQuickDoseTime.next(data.quickDoseTime);
        this._hDoses.next(data.doses);
    }

    public updateConfig(data: ConfigSocketData): void {
        this._poolMode.next(data.poolMode);

        this._gPoolChlorinePump.next(data.gPoolChlorinePump);
        this._gPoolFilter.next(data.gPoolFilter);
        this._gPoolHeater.next(data.gPoolHeater);

        this._gHotTubHeater_Pump.next(data.gHotTubHeater_Pump);
        this._gHotTubFilter_UV.next(data.gHotTubFilter_UV);
        this._gHotTubChlorinePump.next(data.gHotTubChlorinePump);

        this._gTempSensors.next(data.gTempSensors);
    }


}

