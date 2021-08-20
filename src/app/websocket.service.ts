import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { Injectable } from "@angular/core";
import Sockette from 'sockette';
import { fromJSON, Time, toJSON } from "./data"

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {

    public connected: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private socket = new Sockette("ws://192.168.178.50:8081", {
        timeout: 2000, //ms until retry
        // maxAttempts: 10,
        onopen: e => { console.log('Connected!', e); this.connected.next(true); },
        onmessage: e => this.onMessage(fromJSON(e.data)),
        onreconnect: e => console.log('Reconnecting...', e),
        // onmaximum: e => console.log('Stop Attempting!', e),
        onclose: e => this.connected.next(false),
        onerror: e => this.connected.next(false)
    });


    public poolActions: PoolActions = new PoolActions(this);

    constructor(private dataService: DataService) {}

    private onMessage(message: any) {
        // Websocket Data always starts with a key and then the data itself
        switch (message.key) {
            case Keys.POOLDATA:
                console.log(message.data);
                this.dataService.updatePool(message.data);
        }
    }

    public sendCommand(key: Keys, command: any, args: any[]) {
        var json = toJSON({
            key: key.toString(),
            command: command,
            args: args
        });
        console.log("Sending command", json);
        this.socket.send(json);
    }
}


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
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.CHANGE_DOSES, [doses])
    }
}


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

export enum Keys {
    POOLDATA = "POOLDATA",
    HOTTUBDATA = "HOTTUBDATA",
    ERROR = "ERROR",
    LOG = "LOG",
    GPIO = "GPIO",
    PIN = "PIN",
}
