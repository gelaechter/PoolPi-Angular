import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { Section } from "src/app/data";
import { DataService } from "src/app/data.service";

@Component({
    selector: "app-scheduler-indicator",
    templateUrl: "./scheduler-indicator.component.html",
    styleUrls: ["./scheduler-indicator.component.scss"]
})
export class SchedulerIndicatorComponent implements OnInit {

    @Input() section: Section = Section.CHLORINE;
    scheduled: boolean;

    constructor(private data: DataService) { }

    ngOnInit(): void {
        // get the data for the correct section
        const getSectionData = (): BehaviorSubject<boolean> => {
            switch (this.section) {
            case Section.CHLORINE:
                return this.data._pChlorineScheduled;
            case Section.FILTER:
                return this.data._pFilterScheduled;
            case Section.HEATER:
                return this.data._pHeaterScheduled;
            }
        };

        getSectionData().pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => {
            this.scheduled = scheduled;
        });
    }

}
