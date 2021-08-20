import { WebsocketService } from './../websocket.service';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Section } from 'src/app/data';
import { DataService } from 'src/app/data.service';

@Component({
    selector: 'app-scheduler-toggle-button',
    templateUrl: './scheduler-toggle-button.component.html',
    styleUrls: ['./scheduler-toggle-button.component.scss']
})
export class SchedulerToggleButtonComponent implements OnInit {

    @Input() section: Section = Section.CHLORINE;
    scheduled: boolean;

    constructor(private data: DataService, private webSocket: WebsocketService) { }

    ngOnInit(): void {
        // get the data for the correct section
        var getSectionData = (): BehaviorSubject<boolean> => {
            switch (this.section) {
                case Section.CHLORINE:
                    return this.data._chlorineScheduled;
                case Section.FILTER:
                    return this.data._filterScheduled;
                case Section.HEATER:
                    return this.data._heaterScheduled;
            }
        }

        getSectionData().pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => {
            this.scheduled = scheduled;
        })
    }

    toggleSchedule() {
        switch (this.section) {
            case Section.CHLORINE:
                this.webSocket.poolActions.scheduleChlorine(!this.scheduled);
                break;
            case Section.FILTER:
                this.webSocket.poolActions.scheduleFilter(!this.scheduled);
                break;
            case Section.HEATER:
                this.webSocket.poolActions.scheduleHeater(!this.scheduled);
                break;
        }
    }

}
