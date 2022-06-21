import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { DataService } from 'src/app/data.service';
import { WebsocketService } from 'src/app/websocket.service';

@Component({
    selector: 'app-sensor-config',
    templateUrl: './sensor-config.component.html',
    styleUrls: ['./sensor-config.component.scss']
})
export class SensorConfigComponent implements OnInit {

    ids: string[];
    sensorPollRate: number;

    constructor(private data: DataService, private webSocket: WebsocketService) { }

    ngOnInit(): void {
        this.data._sensorIds.pipe(distinctUntilChanged()).subscribe((ids: string[]) => {
            this.ids = ids;
        });
        this.data._sensorPollRate.pipe(distinctUntilChanged()).subscribe((rate: number) => {
            this.sensorPollRate = rate;
        });
    }

}
