import { Time } from './../data';
import { Component, Input, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { DataService } from '../data.service';
import { WebsocketService } from '../websocket.service';

@Component({
    selector: 'app-quick-dose-button',
    templateUrl: './quick-dose-button.component.html',
    styleUrls: ['./quick-dose-button.component.scss']
})
export class QuickDoseButtonComponent implements OnInit {

    @Input() number: number;
    dose_ml: number;
    quickDoseTime: Time = null;

    constructor(private data: DataService, private webSocket: WebsocketService) {
    }

    ngOnInit(): void {
        this.data._quickDoseTime.pipe(distinctUntilChanged()).subscribe((time: Time) => {
            this.quickDoseTime = time;
        })

        this.data._doses.pipe(distinctUntilChanged()).subscribe((doses: number[]) => {
            this.dose_ml = doses[this.number];
        })
    }

    onClickButton() {
        if (this.quickDoseTime === null) {
            this.webSocket.poolActions.quickDose(this.dose_ml);
        }else{
            this.webSocket.poolActions.chlorineOn(false);
            this.webSocket.poolActions.quickDose(this.dose_ml);
        }
    }

    changeDose(dose: number)  {
        var doses = [...this.data._doses.value]
        doses[this.number] = dose;
        this.webSocket.poolActions.changeDoses(doses);
    }
}
