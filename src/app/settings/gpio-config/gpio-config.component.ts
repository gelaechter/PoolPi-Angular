import { Component, Input, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { DataService } from 'src/app/data.service';
import { WebsocketService } from 'src/app/websocket.service';

@Component({
    selector: 'app-gpio-config',
    templateUrl: './gpio-config.component.html',
    styleUrls: ['./gpio-config.component.scss']
})
export class GpioConfigComponent implements OnInit {

    @Input() value = "";

    gPoolChlorinePump;
    gPoolFilter;
    gPoolHeater;
    gHotTubHeater;
    gHotTubHeater_Pump;
    gHotTubFilter_UV;
    gHotTubChlorinePump;
    gTempSensors;
    gValve;

    constructor(private data: DataService, private webSocket: WebsocketService) { }

    ngOnInit(): void {
        this.data._gPoolChlorinePump.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gPoolChlorinePump = gpio;
        })
        this.data._gPoolFilter.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gPoolFilter = gpio;
        })
        this.data._gPoolHeater.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gPoolHeater = gpio;
        })
        this.data._gHotTubHeater.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gHotTubHeater = gpio;
        })
        this.data._gHotTubHeater_Pump.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gHotTubHeater_Pump = gpio;
        })
        this.data._gHotTubFilter_UV.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gHotTubFilter_UV = gpio;
        })
        this.data._gHotTubChlorinePump.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gHotTubChlorinePump = gpio;
        })
        this.data._gTempSensors.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gTempSensors = gpio;
        })
        this.data._gValve.pipe(distinctUntilChanged()).subscribe((gpio: number) => {
            this.gValve = gpio;
        })
    }

    updatePoolFilter() {
        console.log("TopKek")
    }



}
