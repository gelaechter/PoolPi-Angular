import { Time } from './../data';
import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { DataService } from '../data.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-chlorine-button',
  templateUrl: './chlorine-button.component.html',
  styleUrls: ['./chlorine-button.component.scss']
})
export class ChlorineButtonComponent implements OnInit {

    chlorineOn: boolean;
    quickDoseTime: Time = null;
    dose_ml: number;

    constructor(private data: DataService, private webSocket: WebsocketService) {
    }

    ngOnInit(): void {
        this.data._chlorineOn.pipe(distinctUntilChanged()).subscribe((on: boolean) => {
            this.chlorineOn = on;
        })

        this.data._quickDoseTime.pipe(distinctUntilChanged()).subscribe((time: Time) => {
            this.quickDoseTime = time;
        })

        this.data._doses.pipe(distinctUntilChanged()).subscribe((doses: number[]) => {
            this.dose_ml = doses[0];
        })
    }

    onClickButton() {
        if (this.chlorineOn) {
            this.webSocket.poolActions.chlorineOn(false);
        } else {
            this.webSocket.poolActions.quickDose(this.dose_ml);
        }
    }

}
