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

    @Input() section: Section = Section.Chlorine;
    timings: Map<Time, Time>
    width: number;
    height: number;
    context: CanvasRenderingContext2D;

    @ViewChild('scheduleCanvas', { static: false }) scheduleCanvas: ElementRef;
    @ViewChild('overlay', { static: false }) overlay: ElementRef;

    constructor(private data: DataService, private el: ElementRef) { }

    ngOnInit(): void {
        //TODO: do yourself a favor and think long and hard if putting all of this into one component is worth it
        // Its not even about proving yourself anymore you can definitely do this, be smart
        function kek(): BehaviorSubject<Map<Time, Time | number> | number> {
            switch (this.section) {
                case Section.Chlorine:
                    return this.data._chlorineTimings;
                case Section.Filter:
                    return this.data._filterTimings;
                case Section.Heater:
                    return this.data._heaterTimings;
            }
        }


        kek().pipe(distinctUntilChanged()).subscribe((timings: Map<Time, Time | number>) => {
            if (this.section === Section.Chlorine)
                // Map<Time, number> --Array.from--> Array[[K, V]...] --map--> ([K, V])=>([K, V->Time]) --new Map(iterable)--> Map<Time, Time>
                // if this "graph" above doesnt help have fun deciphering this, definitely one of more brutal one-liners i've written :)
                timings = new Map<Time, Time>(Array.from(timings).map(([key, value]) => ([key, doseToTime(value as number)])));
            console.log(timings);

            this.timings = timings as Map<Time, Time>;
            if (this.context !== undefined) this.draw();
        })
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

                    this.context.fillStyle = "blue";

                    this.draw();
                }
            });
        });
        observer.observe(this.scheduleCanvas.nativeElement);

    }

    // draws on the canvas
    draw() {
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

    w(percent: number): number {
        return percent * this.width;
    }

    h(percent: number): number {
        return percent * this.height;
    }
}
