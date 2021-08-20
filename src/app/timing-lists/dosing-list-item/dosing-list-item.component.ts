import { distinctUntilChanged } from 'rxjs/operators';
import { DataService } from './../../data.service';
import { WebsocketService } from './../../websocket.service';
import { Component, Input, OnInit } from '@angular/core';
import { Time, uuidv4 } from 'src/app/data';

@Component({
    selector: 'app-dosing-list-item',
    templateUrl: './dosing-list-item.component.html',
    styleUrls: ['./dosing-list-item.component.scss'],
    host: { 'class': 'list-group-item' }
})
export class DosingListItemComponent implements OnInit {

    @Input() time: Time = null;
    @Input() dose: number = null;

    timeValue: string = "";
    doseValue: number;

    id1: string = uuidv4();

    scheduled: boolean = true;

    constructor(private websocket: WebsocketService, private data: DataService) { }

    ngOnInit(): void {
        if (this.dose !== null) this.doseValue = this.dose;
        if (this.time !== null) this.timeValue = this.time.text;

        this.data._chlorineScheduled.pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => this.scheduled = scheduled);
    }

    timeChangeEvent(time: any) {
        console.log("timeChangeEvent")
        this.timeValue = time
        this.update();
    }

    doseChangeEvent(dose_ml: any) {
        this.doseValue = dose_ml
        this.update();
    }

    update() {
        var timeValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])?$/.test(this.timeValue);
        if (!timeValid || isNaN(this.doseValue)) return;
        if (this.doseValue < 16) return;

        if (this.time !== null) this.remove();
        this.websocket.poolActions.addChlorineTime(new Time(this.timeValue), this.doseValue);

        console.log("removed and updated!")
    }

    remove() {
        if (this.time === null || this.time === undefined) return;
        this.websocket.poolActions.removeChlorineTime(this.time);
        console.log("removed");
    }
}

