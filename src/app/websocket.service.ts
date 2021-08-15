import { DataService } from './data.service';
import { Injectable } from "@angular/core";
import { webSocket } from "rxjs/webSocket";
import { Time, toJSON } from "./data"

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private socket = webSocket("ws://localhost:8081");

    public poolActions: PoolActions = new PoolActions(this);

    constructor(private dataService: DataService) {
        this.connect();
    }

    public connect() {
        this.socket.subscribe(message => this.onMessage(message));
        console.log("Connected websocket")
    }

    private send(message: any) {
        this.socket.next(message);
    }

    public close() {
        this.socket.complete();
    }

    public error(code: number, reason: string) {
        this.socket.error({ code: code, reason: reason });
    }

    private onMessage(message: any) {
        // Websocket Data always starts with a key and then the data itself
        switch(message.key){
            case Keys.POOLDATA:
                this.dataService.updatePool(message.data);
                break;
        }
    }

    public sendCommand(key: Keys, command: any, args: any[]) {
        this.send(toJSON({
            key: key.toString(),
            command: command,
            args: args
        }))
    }
}

export enum PoolCommands {
    QUICK_DOSE = "quickDose",   //args = dose_ml: number
    HEATER_ON = "heaterOn",     //args = on: boolean
    FILTER_ON = "filterOn",     //args = on: boolean

    SCHEDULE_CHLORINE = "scheduleChlorine", //args = scheduled: boolean
    SCHEDULE_HEATER = "scheduleHeater",     //args = scheduled: boolean
    SCHEDULE_FILTER = "scheduleFilter",     //args = scheduled: boolean

    ADD_CHLORINE_TIME = "addChlorineTime",  //args = startMinutes: number, dose_ml: number
    ADD_HEATER_TIME = "addHeaterTime",      //args = startMinutes: number, stopMinutes: number
    ADD_FILTER_TIME = "addFilterTime",      //args = startMinutes: number, stopMinutes: number

    REMOVE_CHLORINE_TIME = "removeChlorineTime",    //args = startMinutes: number
    REMOVE_HEATER_TIME = "removeHeaterTime",        //args = startMinutes: number
    REMOVE_FILTER_TIME = "removeFilterTime",        //args = startMinutes: number
}

class PoolActions {
    constructor(private webSocketService: WebsocketService) { }

    public quickDose(dose_ml: number){
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.QUICK_DOSE, [dose_ml]);
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
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.ADD_CHLORINE_TIME, [start.minutes, dose_ml]);
    }

    public addHeaterTime(start: Time, stop: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.ADD_HEATER_TIME, [start.minutes, stop.minutes]);
    }

    public addFilterTime(start: Time, stop: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.ADD_FILTER_TIME, [start.minutes, stop.minutes]);
    }

    public removeChlorineTime(start: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.REMOVE_CHLORINE_TIME, [start]);
    }

    public removeHeaterTime(start: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.REMOVE_FILTER_TIME, [start]);
    }

    public removeFilterTime(start: Time) {
        this.webSocketService.sendCommand(Keys.POOLDATA, PoolCommands.REMOVE_FILTER_TIME, [start]);
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
}

export enum Keys {
    POOLDATA = "POOLDATA",
    HOTTUBDATA = "HOTTUBDATA",
    ERROR = "ERROR",
    LOG = "LOG",
    GPIO = "GPIO",
    PIN = "PIN",
}
