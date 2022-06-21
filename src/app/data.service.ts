import { Time } from "./data";
import { PoolSocketData, ConfigSocketData } from "./websocket.service";
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
    public readonly _gPoolChlorinePump: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _gPoolFilter: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _gPoolHeater: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _gHotTubHeater: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _gHotTubHeater_Pump: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _gHotTubFilter_UV: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _gHotTubChlorinePump: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _gTempSensors: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _gValve: BehaviorSubject<number> = new BehaviorSubject(0);

    // ####################################################################################################################
    // is GPIO on
    public readonly _pChlorineOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly _pHeaterOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly _pFilterOn: BehaviorSubject<boolean> = new BehaviorSubject(false);

    // Goal Temperature
    public readonly _pGoalTemp: BehaviorSubject<number> = new BehaviorSubject(0);

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

    public readonly _sensorIds: BehaviorSubject<string[]> = new BehaviorSubject([]);
    public readonly _sensorPollRate: BehaviorSubject<number> = new BehaviorSubject(0);

    // Measured Temperatures
    public readonly _sWaterTemp: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _sCabinTemp: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly _sBarrelTemp: BehaviorSubject<number> = new BehaviorSubject(0);

    // Updates all the pool related subjects
    public updatePool(data: PoolSocketData): void {
        this._pChlorineOn.next(data.chlorineOn);
        this._pHeaterOn.next(data.heaterOn);
        this._pFilterOn.next(data.filterOn);

        this._pGoalTemp.next(data.goalTemperature);

        this._pChlorineScheduled.next(data.chlorineScheduled);
        this._pHeaterScheduled.next(data.heaterScheduled);
        this._pFilterScheduled.next(data.filterScheduled);

        this._pChlorineTimings.next(data.chlorineTimings);
        this._pHeaterTimings.next(data.heaterTimings);
        this._pFilterTimings.next(data.filterTimings);

        this._pQuickDoseTime.next(data.quickDoseTime);
        this._pDoses.next(data.doses);
    }

    public updateConfig(data: ConfigSocketData): void {
        this._poolMode.next(data.poolMode);

        this._gPoolChlorinePump.next(data.gPoolChlorinePump);
        this._gPoolFilter.next(data.gPoolFilter);
        this._gPoolHeater.next(data.gPoolHeater);
        this._gHotTubHeater.next(data.gHotTubHeater);
        this._gHotTubHeater_Pump.next(data.gHotTubHeater_Pump);
        this._gHotTubFilter_UV.next(data.gHotTubFilter_UV);
        this._gHotTubChlorinePump.next(data.gHotTubChlorinePump);
        this._gValve.next(data.gValve);
        this._gTempSensors.next(data.gTempSensors);

        this._sensorPollRate.next(data.sensorPollRate);
        this._sensorIds.next(
            Object.entries(data.sensorIds).map(([, v]) => (v))
        );
    }
}
