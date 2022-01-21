import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { distinctUntilChanged } from "rxjs/operators";
import { Section, Time } from "src/app/data";
import { DataService } from "src/app/data.service";

@Component({
    selector: "app-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
    @HostBinding("class") class = "list-grouping";
    @Input() section: Section = null;
    timingEntries: [Time, Time][];
    chlorineEntries: [Time, number][];

    CHLORINE: number = Section.CHLORINE
    FILTER: number = Section.FILTER;
    HEATER: number = Section.HEATER;

    constructor(private data: DataService) { }

    ngOnInit(): void {
        // get the data for the correct section
        switch (this.section) {
        case Section.CHLORINE:
            this.data._pChlorineTimings.pipe(distinctUntilChanged()).subscribe((timings: Map<Time, number>) => {
                // for the *ngFor to register an update we need to create a deep copy
                this.chlorineEntries = Object.assign([], Array.from(timings.entries()));
            });
            break;
        case Section.FILTER:
            this.data._pFilterTimings.pipe(distinctUntilChanged()).subscribe((timings: Map<Time, Time>) => {
                this.timingEntries = Object.assign([], Array.from(timings.entries()));
            });
            break;
        case Section.HEATER:
            this.data._pHeaterTimings.pipe(distinctUntilChanged()).subscribe((timings: Map<Time, Time>) => {
                this.timingEntries = Object.assign([], Array.from(timings.entries()));
            });
            break;
        }
    }
}
