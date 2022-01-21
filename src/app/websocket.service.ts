import { BehaviorSubject } from "rxjs";
import { DataService } from "./data.service";
import { Injectable } from "@angular/core";
import Sockette from "sockette";
import { fromJSON, Time, toJSON } from "./data";

@Injectable({
    providedIn: "root",
})
export class WebsocketService {

    public connected: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private socket = new Sockette("ws://192.168.178.50:8081", {
        timeout: 2000, //ms until retry
        // maxAttempts: 10,
        onopen: e => { console.log("Connected!", e); this.connected.next(true); },
        onmessage: e => this.onMessage(fromJSON(e.data)),
        onreconnect: e => console.log("Reconnecting...", e),
        // onmaximum: e => console.log('Stop Attempting!', e),
        onclose: () => this.connected.next(false),
        onerror: () => this.connected.next(false)
    });

    // public action interfaces
    public poolActions: PoolActions = new PoolActions(this);
    public hotTubActions: HotTubActions = new HotTubActions(this);
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

        case Keys.HOTTUBDATA:
            this.dataService.updateHotTub(message.data);
            break;
        }
    }

    public sendCommand(key: Keys, command: any, args: any[]) {
        const json = toJSON({
            key: key.toString(),
            command: command,
            args: args
        });
        console.log("Sending command", json);
        this.socket.send(json);
    }
}

// Keys to identify incoming data
export enum Keys {
    POOLDATA = "POOLDATA",
    HOTTUBDATA = "HOTTUBDATA",
    CONFIGDATA = "CONFIGDATA",
    LOG = "LOG",
}

// ##################################################################################################################################################################################################################################
// Commands the server recognizes
export enum PoolCommands {
    HEATER_ON = "heaterOn",
    FILTER_ON = "filterOn",
    CHLORINE_ON = "chlorineOn",

    SCHEDULE_CHLORINE = "scheduleChlorine",
    SCHEDULE_HEATER = "scheduleHeater",
    SCHEDULE_FILTER = "scheduleFilter",

    ADD_CHLORINE_TIME = "addChlorineTime",
    ADD_HEATER_TIME = "addHeaterTime",
    ADD_FILTER_TIME = "addFilterTime",

    REMOVE_CHLORINE_TIME = "removeChlorineTime",
    REMOVE_HEATER_TIME = "removeHeaterTime",
    REMOVE_FILTER_TIME = "removeFilterTime",

    QUICK_DOSE = "quickDose",
    CHANGE_DOSES = "changeDoses"
}

// Functions to execeute actions on the server
class PoolActions {
    constructor(private webSocketService: WebsocketService) { }

    public chlorineOn(on: boolean) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.CHLORINE_ON, [on]);
    }

    public heaterOn(on: boolean) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.HEATER_ON, [on]);
    }

    public filterOn(on: boolean) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.FILTER_ON, [on]);
    }

    public scheduleChlorine(scheduled: boolean) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.SCHEDULE_CHLORINE, [scheduled]);
    }

    public scheduleHeater(scheduled: boolean) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.SCHEDULE_HEATER, [scheduled]);
    }

    public scheduleFilter(scheduled: boolean) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.SCHEDULE_FILTER, [scheduled]);
    }

    public addChlorineTime(start: Time, dose_ml: number) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.ADD_CHLORINE_TIME, [start, dose_ml]);
    }

    public addHeaterTime(start: Time, stop: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.ADD_HEATER_TIME, [start, stop]);
    }

    public addFilterTime(start: Time, stop: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.ADD_FILTER_TIME, [start, stop]);
    }

    public removeChlorineTime(start: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.REMOVE_CHLORINE_TIME, [start]);
    }

    public removeHeaterTime(start: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.REMOVE_HEATER_TIME, [start]);
    }

    public removeFilterTime(start: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.REMOVE_FILTER_TIME, [start]);
    }

    public quickDose(dose_ml: number) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.QUICK_DOSE, [dose_ml]);
    }

    public changeDoses(doses: number[]) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.CHANGE_DOSES, [doses]);
    }
}

// Modeling the data that the server sends
export class PoolSocketData {
    chlorineOn: boolean;
    filterOn: boolean;
    heaterOn: boolean;

    chlorineScheduled: boolean;
    heaterScheduled: boolean;
    filterScheduled: boolean;

    chlorineTimings: Map<Time, number>;
    heaterTimings: Map<Time, Time>;
    filterTimings: Map<Time, Time>;

    quickDoseTime: Time;
    doses: number[];
}

// ##################################################################################################################################################################################################################################
// Commands the server recognizes
export enum HotTubCommands {
    HEATER_ON = "heaterOn",
    FILTER_ON = "filterOn",
    CHLORINE_ON = "chlorineOn",

    SET_GOAL_TEMP = "setGoalTemp",

    SCHEDULE_CHLORINE = "scheduleChlorine",
    SCHEDULE_HEATER = "scheduleHeater",
    SCHEDULE_FILTER = "scheduleFilter",

    ADD_CHLORINE_TIME = "addChlorineTime",
    ADD_HEATER_TIME = "addHeaterTime",
    ADD_FILTER_TIME = "addFilterTime",

    REMOVE_CHLORINE_TIME = "removeChlorineTime",
    REMOVE_HEATER_TIME = "removeHeaterTime",
    REMOVE_FILTER_TIME = "removeFilterTime",

    QUICK_DOSE = "quickDose",
    CHANGE_DOSES = "changeDoses"
}

// Functions to execeute actions on the server
class HotTubActions {
    constructor(private webSocketService: WebsocketService) { }

    public chlorineOn(on: boolean) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.CHLORINE_ON, [on]);
    }

    public heaterOn(on: boolean) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.HEATER_ON, [on]);
    }

    public filterOn(on: boolean) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.FILTER_ON, [on]);
    }

    public setGoalTemp(temp: number){
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.SET_GOAL_TEMP, [temp]);
    }

    public scheduleChlorine(scheduled: boolean) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.SCHEDULE_CHLORINE, [scheduled]);
    }

    public scheduleHeater(scheduled: boolean) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.SCHEDULE_HEATER, [scheduled]);
    }

    public scheduleFilter(scheduled: boolean) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.SCHEDULE_FILTER, [scheduled]);
    }

    public addChlorineTime(start: Time, dose_ml: number) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.ADD_CHLORINE_TIME, [start, dose_ml]);
    }

    public addHeaterTime(start: Time, stop: Time) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.ADD_HEATER_TIME, [start, stop]);
    }

    public addFilterTime(start: Time, stop: Time) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, PoolCommands.ADD_FILTER_TIME, [start, stop]);
    }

    public removeChlorineTime(start: Time) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.REMOVE_CHLORINE_TIME, [start]);
    }

    public removeHeaterTime(start: Time) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.REMOVE_HEATER_TIME, [start]);
    }

    public removeFilterTime(start: Time) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.REMOVE_FILTER_TIME, [start]);
    }

    public quickDose(dose_ml: number) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.QUICK_DOSE, [dose_ml]);
    }

    public changeDoses(doses: number[]) {
        this.webSocketService.sendCommand(Keys.HOTTUBDATA, HotTubCommands.CHANGE_DOSES, [doses]);
    }
}

// Modeling the data that the server sends
export class HotTubSocketData {
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
}

// ##################################################################################################################################################################################################################################

export enum ConfigCommands {
    SWITCHMODE = "switchMode"
}

class ConfigActions {
    constructor(private webSocketService: WebsocketService) { }

    public switchModes() {
        this.webSocketService.sendCommand(Keys.CONFIGDATA, ConfigCommands.SWITCHMODE, []);
    }
}

// class to configure the pins for the different IOs
export class ConfigData {
    public readonly POOL = 0;
    public readonly HOTTUB = 1;
    public mode: number = this.POOL;

    // pool
    public pool_chlorinePump = 10;
    public pool_filter = 8;
    public pool_heater = 12;

    // hot tub
    public hottub_filter_uv = 16;
    public hottub_heater_pump = 18;
    public hottub_chlorinePump = 26;

    // pin for temp sensors
    public tempSensors = 7;
}

// Modeling the data received from the server
export class ConfigSocketData {
    poolMode: boolean;

    gPoolChlorinePump: number;
    gPoolFilter: number;
    gPoolHeater: number;

    gHotTubHeater_Pump: number;
    gHotTubFilter_UV: number;
    gHotTubChlorinePump: number;

    gTempSensors: number;
}

// ##################################################################################################################################################################################################################################
