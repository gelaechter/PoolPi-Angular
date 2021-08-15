import { distinctUntilChanged } from 'rxjs/operators';
import { WebsocketService } from './../websocket.service';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-heater-button',
    templateUrl: './heater-button.component.html',
    styleUrls: ['./heater-button.component.scss']
})
export class HeaterButtonComponent implements OnInit {

    heaterOn: boolean;

    constructor(private data: DataService, private webSocket: WebsocketService) {
    }

    ngOnInit(): void {
        this.data._heaterOn.pipe(distinctUntilChanged()).subscribe((on: boolean) => {
            this.heaterOn = on;
        })
    }

    onClickButton() {
        this.webSocket.poolActions.heaterOn(!this.heaterOn);
    }

}
