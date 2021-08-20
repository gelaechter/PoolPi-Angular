import { DataService } from './../data.service';
import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, Input } from "@angular/core";
import { distinctUntilChanged } from 'rxjs/operators';
import { Time, Section, doseToTime } from '../data';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: "app-timeframe-display",
    templateUrl: "./schedule-display.component.html",
    styleUrls: ["./schedule-display.component.scss"],
})
export class SchduleDisplayComponent implements OnInit, AfterViewInit {

    @Input() section: Section = Section.CHLORINE;
    timings: Map<Time, Time>
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    ready: boolean = false;

    blue: string = "#1266f1";
    orange: string = "#ffa900";

    @ViewChild('scheduleCanvas', { static: false }) scheduleCanvas: ElementRef;
    @ViewChild('overlay', { static: false }) overlay: ElementRef;

    constructor(private data: DataService, private el: ElementRef) { }

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
            this.redraw();
        })

        // if the quickDose changes then redraw it
        if (this.section === Section.CHLORINE) {
            this.data._quickDoseTime.pipe(distinctUntilChanged()).subscribe(() => this.redraw());
        }
    }

    ngAfterViewInit(): void {
        this.context = this.scheduleCanvas.nativeElement.getContext('2d');

        // observer to observe the component for becoming visible; it only took all of my sanity to figure this one out
        var observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    this.width = this.el.nativeElement.clientWidth;
                    this.height = this.el.nativeElement.clientHeight;

                    this.scheduleCanvas.nativeElement.width = this.width;
                    this.scheduleCanvas.nativeElement.height = this.height;

                    this.context.fillStyle = this.blue;

                    this.ready = true;

                    this.redraw();
                }
            });
        });
        observer.observe(this.scheduleCanvas.nativeElement);

        if (this.section === Section.CHLORINE)
            setInterval(() => {
                this.redraw();
            }, 60 * 1000)
    }

    // clears the canvas, then draws schedule and quickdose
    redraw() {
        if(!this.ready) return;
        this.clear();
        this.drawSchedule();
        this.drawQuickDose();
    }

    // clears the canvas
    clear() {
        this.context.clearRect(0, 0, this.w(1), this.h(1));
    }

    // draws the schedule onto the canvas
    drawSchedule() {
        if (this.timings === undefined) return;

        for (const [startTime, stopTime] of this.timings.entries()) {
            // Check if this timeframe loops around (stop happens before start)
            if (startTime.minutes > stopTime.minutes) {
                // loops
                this.context.fillRect(0, 0, Math.round(this.w(stopTime.minutes / 1440)), this.h(1)); // Draw from zero to stop
                this.context.fillRect(Math.round(this.w(startTime.minutes / 1440)), 0, this.width, this.h(1)); //Draw from start to end
            } else {
                // does not loop
                var x = Math.round(this.w(startTime.minutes / 1440))
                var w = Math.round(this.w(stopTime.minutes / 1440) - this.w(startTime.minutes / 1440));
                this.context.fillRect(x, 0, w, this.h(1));
            }
        }
    }

    // draws a current quickdose onto the canvas
    drawQuickDose() {
        if (this.section !== Section.CHLORINE || this.data._quickDoseTime.getValue() === null) return;

        this.context.fillStyle = this.orange;

        var startTime = Time.now();
        var stopTime = this.data._quickDoseTime.getValue();

        // Check if this timeframe loops around (stop happens before start)
        if (startTime.minutes > stopTime.minutes) {
            // loops
            this.context.fillRect(0, 0, Math.round(this.w(stopTime.minutes / 1440)), this.h(1)); // Draw from zero to stop
            this.context.fillRect(Math.round(this.w(startTime.minutes / 1440)), 0, this.width, this.h(1)); //Draw from start to end
        } else {
            // does not loop
            var x = Math.round(this.w(startTime.minutes / 1440))
            var w = Math.round(this.w(stopTime.minutes / 1440) - this.w(startTime.minutes / 1440));
            this.context.fillRect(x, 0, w, this.h(1));
        }

        this.context.fillStyle = this.blue;
    }

    w(percent: number): number {
        return percent * this.width;
    }

    h(percent: number): number {
        return percent * this.height;
    }
}
