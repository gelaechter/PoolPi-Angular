import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { doseToTime, isInTimeframe, isScheduled, Section, Time } from '../../data';
import { DataService } from '../../data.service';

@Component({
    selector: 'app-info-text',
    templateUrl: './info-text.component.html',
    styleUrls: ['./info-text.component.scss']
})
export class InfoTextComponent implements OnInit {

    @Input() section: Section;
    timings: Map<Time, Time>;
    quickDoseTime: Time;

    constructor(private data: DataService) { }

    ngOnInit(): void {
        // get the data for the correct section
        var getSectionData = (): BehaviorSubject<Map<Time, Time | number>> => {
            switch (this.section) {
                case Section.CHLORINE:
                    return this.data._chlorineTimings;
                case Section.FILTER:
                    return this.data._filterTimings;
                case Section.HEATER:
                    return this.data._heaterTimings;
            }
        }

        // pipe schedule data, if chlorine: convert chlorine data and redraw on quickdose change
        getSectionData().pipe(distinctUntilChanged()).subscribe((timings: Map<Time, Time | number>) => {
            // Convert the chlorine schedule Map (<Time, number>) to a <Time, Time> map
            if (this.section === Section.CHLORINE)
                // Map<Time, number> --Array.from--> Array[[K, V]...] --Array.map--> ([K, V])=>([K, V --doseToTime--> Time]) --new Map(iterable)--> Map<Time, Time>
                timings = new Map<Time, Time>(Array.from(timings).map(([key, value]) => ([key, doseToTime(value as number).add(key)])));

            this.timings = timings as Map<Time, Time>;
        })

        if (this.section === Section.CHLORINE)
            this.data._quickDoseTime.pipe(distinctUntilChanged()).subscribe((time: Time) => this.quickDoseTime = time);
    }

    isEmpty() {
        return this.timings.size === 0;
    }

    isOn() {
        switch (this.section) {
            case Section.CHLORINE:
                return this.data._chlorineOn.getValue();
            case Section.FILTER:
                return this.data._filterOn.getValue();
            case Section.HEATER:
                return this.data._heaterOn.getValue();
        }
    }

    getStart(): string {
        var smallest: number = 9999;
        if (this.scheduled()) return;
        for (const startTime of this.timings.keys()) {
            var minutes = startTime.fromNow().minutes; // difference between now and start
            if (minutes < smallest) smallest = minutes;
        }

        if (minutes < 60) {
            return `${minutes} Minuten`
        } else {
            return `${Math.round(minutes / 60)} Stunden`
        }
    }

    getStop(): string {
        var minutes: number = -1;
        for (const [startTime, stopTime] of this.timings.entries()) {
            if (isInTimeframe(Time.now(), startTime, stopTime))
                minutes = stopTime.fromNow().minutes;
        }
        if (minutes === -1) return "";

        if (minutes < 60) {
            return `${minutes} Minuten`
        } else {
            return `${Math.round(minutes / 60)} Stunden`
        }
    }

    scheduled(): boolean {
        return isScheduled(Time.now(), this.timings);
    }



}
