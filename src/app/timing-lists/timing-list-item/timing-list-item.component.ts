import { DataService } from "./../../data.service";
import { HostBinding } from "@angular/core";
import { Component, Input, OnInit } from "@angular/core";
import { distinctUntilChanged } from "rxjs/operators";
import { Section, Time, uuidv4 } from "src/app/data";
import { WebsocketService } from "src/app/websocket.service";

@Component({
    selector: "app-timing-list-item",
    templateUrl: "./timing-list-item.component.html",
    styleUrls: ["./timing-list-item.component.scss"],
})
export class TimingListItemComponent implements OnInit {

    @HostBinding("class") class = "list-group-item";
    @Input() start: Time = null;
    @Input() stop: Time = null;
    @Input() section: Section = null;

    startValue = "";
    stopValue = "";

    id1: string = uuidv4();
    id2: string = uuidv4();

    scheduled = true;


    constructor(private websocket: WebsocketService, private data: DataService) { }

    ngOnInit(): void {
        if (this.start !== null) this.startValue = this.start.text;
        if (this.stop !== null) this.stopValue = this.stop.text;

        if (this.section === Section.FILTER) this.data._pFilterScheduled.pipe(distinctUntilChanged()).subscribe((scheduled) => this.scheduled = scheduled);
        if (this.section === Section.HEATER)this.data._pHeaterScheduled.pipe(distinctUntilChanged()).subscribe((scheduled) => this.scheduled = scheduled);
    }

    startChangeEvent(time: any): void {
        console.log(this.stopValue);

        this.startValue = time;
        this.update();
    }

    stopChangeEvent(time: any): void {
        this.stopValue = time;
        this.update();
    }

    update(): void {
        const startValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])?$/.test(this.startValue);
        const stopValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])?$/.test(this.stopValue);
        if (!startValid || !stopValid) return;

        this.remove();

        if (this.section === Section.FILTER) this.websocket.poolActions.addFilterTime(new Time(this.startValue), new Time(this.stopValue));
        if (this.section === Section.HEATER) this.websocket.poolActions.addHeaterTime(new Time(this.startValue), new Time(this.stopValue));

        console.log("removed and updated!");
    }

    remove(): void {
        if (this.start === null || this.start === undefined) return;

        if (this.section === Section.FILTER) this.websocket.poolActions.removeFilterTime(this.start);
        if (this.section === Section.HEATER) this.websocket.poolActions.removeHeaterTime(this.start);

        console.log("removed");
    }


}
