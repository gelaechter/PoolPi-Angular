import { DataService } from './data.service';
import { Section } from './data';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { scheduled } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    connected: boolean;
    CHLORINE: number = Section.CHLORINE;
    FILTER: number = Section.FILTER;
    HEATER: number = Section.HEATER;

    chlorineScheduled: boolean;
    filterScheduled: boolean;
    heaterScheduled: boolean;

    constructor(private webSocket: WebsocketService, private data: DataService) {
    }

    ngOnInit(): void {
        this.webSocket.connected.pipe(distinctUntilChanged()).subscribe((connected: boolean) => {
            this.connected = connected;
        })

        this.data._chlorineScheduled.pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => {
            this.chlorineScheduled = scheduled;
        });


        this.data._filterScheduled.pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => {
            this.filterScheduled = scheduled;
        });


        this.data._heaterScheduled.pipe(distinctUntilChanged()).subscribe((scheduled: boolean) => {
            this.heaterScheduled = scheduled;
        });
    }

}
