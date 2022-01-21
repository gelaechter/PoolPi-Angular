import { Component, Input, OnInit } from "@angular/core";
import { distinctUntilChanged } from "rxjs/operators";
import { doseToTime, isScheduled, Time } from "src/app/data";
import { DataService } from "../../data.service";
import { WebsocketService } from "../../websocket.service";

@Component({
    selector: "app-chlorine-button",
    templateUrl: "./chlorine-button.component.html",
    styleUrls: ["./chlorine-button.component.scss"]
})
export class ChlorineButtonComponent implements OnInit {

    @Input() size = "xl";

    chlorineOn: boolean;
    dose_ml: number;
    quickDoseTime: Time = null;

    constructor(private data: DataService, private webSocket: WebsocketService) {
    }

    ngOnInit(): void {
        this.data._pChlorineOn.pipe(distinctUntilChanged()).subscribe((on: boolean) => {
            this.chlorineOn = on;
        });

        this.data._pQuickDoseTime.pipe(distinctUntilChanged()).subscribe((time: Time) => {
            this.quickDoseTime = time;
        });

        this.data._pDoses.pipe(distinctUntilChanged()).subscribe((doses: number[]) => {
            this.dose_ml = doses[0];
        });
    }

    onClickButton() {

        if (this.scheduled()) {
            this.webSocket.poolActions.chlorineOn(!this.chlorineOn);
        } else {
            if(this.chlorineOn){
                this.webSocket.poolActions.chlorineOn(false);
            }else{
                this.webSocket.poolActions.quickDose(this.dose_ml);
            }
        }
    }

    scheduled() {
        // returns true if chlorine is currently scheduled
        return isScheduled(Time.now(), new Map<Time, Time>(Array.from(this.data._pChlorineTimings.getValue()).map(([key, value]) => ([key, doseToTime(value as number).add(key)]))));
    }

}
