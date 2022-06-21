import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import Sockette from 'sockette';
import { fromJSON, Time, toJSON } from './data';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    public connected: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private socket = new Sockette('ws://localhost:8081', {
        timeout: 2000, //ms until retry
        // maxAttempts: 10,
        onopen: (e) => {
            console.log('Connected!', e);
            this.connected.next(true);
        },
        onmessage: (e) => this.onMessage(fromJSON(e.data)),
        onreconnect: (e) => console.log('Reconnecting...', e),
        // onmaximum: e => console.log('Stop Attempting!', e),
        onclose: () => this.connected.next(false),
        onerror: () => this.connected.next(false),
    });

    // public action interfaces
    public poolActions: PoolActions = new PoolActions(this);
    public configActions: ConfigActions = new ConfigActions(this);

    constructor(private dataService: DataService) { }

    private onMessage(message: any) {
        // Websocket Data always starts with a key and then the data itself
        console.log(message.data);

        switch (message.key) {
            case Keys.POOLDATA:
                this.dataService.updatePool(message.data);
                break;

            case Keys.CONFIGDATA:
                this.dataService.updateConfig(message.data);
                break;
        }
    }

    public sendCommand(key: Keys, command: any, args: any[]) {
        const json = toJSON({
            key: key.toString(),
            command: command,
            args: args,
        });
        console.log('Sending command', json);
        this.socket.send(json);
    }
}

// Keys to identify incoming data
export enum Keys {
    POOLDATA = 'POOLDATA',
    CONFIGDATA = 'CONFIGDATA',
    LOG = 'LOG',
}

// ##################################################################################################################################################################################################################################

// Functions to execeute actions on the server
class PoolActions {
    constructor(private webSocketService: WebsocketService) { }

    public chlorineOn(on: boolean) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "chlorineOn",
            [on]
        );
    }

    public heaterOn(on: boolean) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "heaterOn",
            [on]
        );
    }

    public filterOn(on: boolean) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "filterOn",
            [on]
        );
    }

    public setGoalTemp(temp: number) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "setGoalTemp",
            [temp]
        );
    }

    public scheduleChlorine(scheduled: boolean) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "scheduleChlorine",
            [scheduled]
        );
    }

    public scheduleHeater(scheduled: boolean) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "scheduleHeater",
            [scheduled]
        );
    }

    public scheduleFilter(scheduled: boolean) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "scheduleFilter",
            [scheduled]
        );
    }

    public addChlorineTime(start: Time, dose_ml: number) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "addChlorineTime",
            [start, dose_ml]
        );
    }

    public addHeaterTime(start: Time, stop: Time) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "addHeaterTime",
            [start, stop]
        );
    }

    public addFilterTime(start: Time, stop: Time) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "addFilterTime",
            [start, stop]
        );
    }

    public removeChlorineTime(start: Time) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "removeChlorineTime",
            [start]
        );
    }

    public removeHeaterTime(start: Time) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "removeHeaterTime",
            [start]
        );
    }

    public removeFilterTime(start: Time) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "removeFilterTime",
            [start]
        );
    }

    public quickDose(dose_ml: number) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "quickDose",
            [dose_ml]
        );
    }

    public changeDoses(doses: number[]) {
        this.webSocketService.sendCommand(
            Keys.POOLDATA,
            "changeDoses",
            [doses]
        );
    }
}

// Modeling the data that the server sends
export class PoolSocketData {
    chlorineOn: boolean;
    filterOn: boolean;
    heaterOn: boolean;

    goalTemperature: number;

    chlorineScheduled: boolean;
    heaterScheduled: boolean;
    filterScheduled: boolean;

    chlorineTimings: Map<Time, number>;
    heaterTimings: Map<Time, Time>;
    filterTimings: Map<Time, Time>;

    quickDoseTime: Time;
    doses: number[];

    sensorIds = [];
}

export class SensorSocketData {
    sensorTemps: { water: number, cabin: number, barrel: number };
}

// ##################################################################################################################################################################################################################################

class ConfigActions {
    constructor(private webSocketService: WebsocketService) { }

    public switchModes() {
        this.webSocketService.sendCommand(
            Keys.CONFIGDATA,
            "switchMode",
            []
        );
    }
}

// Modeling the data received from the server
export class ConfigSocketData {
    poolMode: boolean;

    // GPIO Number
    gPoolFilter: number;
    gPoolChlorinePump: number;
    gPoolHeater: number;
    gHotTubHeater: number;
    gHotTubHeater_Pump: number;
    gHotTubFilter_UV: number;
    gHotTubChlorinePump: number;
    gValve: number;
    gTempSensors: number;

    // sensors
    sensorPollRate: number; // poll every n seconds
    sensorIds: { waterId: string, cabinId: string, barrelId: string };
}

// ##################################################################################################################################################################################################################################
