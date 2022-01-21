import { DataService } from "./data.service";
import { Section } from "./data";
import { Component, OnInit } from "@angular/core";
import { WebsocketService } from "./websocket.service";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    // mode of the app, false = hot tub mode
    poolMode: boolean;

    connected: boolean;
    CHLORINE: number = Section.CHLORINE;
    FILTER: number = Section.FILTER;
    HEATER: number = Section.HEATER;

    chlorineScheduled: boolean;
    filterScheduled: boolean;
    heaterScheduled: boolean;

    constructor(private webSocket: WebsocketService, private data: DataService) {
    }

    ngOnInit(): void {
        // pipe the connection status, display an connection indicator1
        this.webSocket.connected.pipe(distinctUntilChanged()).subscribe((connected: boolean) => {
            this.connected = connected;
        });

        // pipe the toggled schedules, gray out the non-scheduled pages
        this.data._pChlorineScheduled.pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => {
            this.chlorineScheduled = scheduled;
        });
        this.data._pFilterScheduled.pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => {
            this.filterScheduled = scheduled;
        });
        this.data._pHeaterScheduled.pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => {
            this.heaterScheduled = scheduled;
        });

        // pipe the current mode to switch out the tabs
        this.data._poolMode.pipe(distinctUntilChanged()).subscribe((poolMode: boolean) => {
            this.poolMode = poolMode;
        });

    }

    changeMode(): void {
        this.webSocket.configActions.switchModes();
    }

}
