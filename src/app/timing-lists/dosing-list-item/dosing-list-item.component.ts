import { distinctUntilChanged } from "rxjs/operators";
import { DataService } from "./../../data.service";
import { WebsocketService } from "./../../websocket.service";
import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { Time, uuidv4 } from "src/app/data";

@Component({
    selector: "app-dosing-list-item",
    templateUrl: "./dosing-list-item.component.html",
    styleUrls: ["./dosing-list-item.component.scss"],
})
export class DosingListItemComponent implements OnInit {
    @HostBinding("class") class = "list-grouping-item";
    @Input() time: Time = null;
    @Input() dose: number = null;

    timeValue = "";
    doseValue: number;

    id1: string = uuidv4();

    scheduled = true;

    constructor(private websocket: WebsocketService, private data: DataService) { }

    ngOnInit(): void {
        if (this.dose !== null) this.doseValue = this.dose;
        if (this.time !== null) this.timeValue = this.time.text;

        this.data._pChlorineScheduled.pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => this.scheduled = scheduled);
    }

    timeChangeEvent(time: any): void {
        console.log("timeChangeEvent");
        this.timeValue = time;
        this.update();
    }

    doseChangeEvent(dose_ml: any): void {
        this.doseValue = dose_ml;
        this.update();
    }

    update(): void {
        const timeValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])?$/.test(this.timeValue);
        if (!timeValid || isNaN(this.doseValue)) return;
        if (this.doseValue < 16) return;

        if (this.time !== null) this.remove();
        this.websocket.poolActions.addChlorineTime(new Time(this.timeValue), this.doseValue);

        console.log("removed and updated!");
    }

    remove(): void {
        if (this.time === null || this.time === undefined) return;
        this.websocket.poolActions.removeChlorineTime(this.time);
        console.log("removed");
    }
}

