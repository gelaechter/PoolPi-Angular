import { DataService } from "./../../data.service";
import { distinctUntilChanged } from "rxjs/operators";
import { Component, Input, OnInit } from "@angular/core";
import { WebsocketService } from "src/app/websocket.service";

@Component({
    selector: "app-heater-button",
    templateUrl: "./heater-button.component.html",
    styleUrls: ["./heater-button.component.scss"]
})
export class HeaterButtonComponent implements OnInit {

    @Input() size = "xl";

    heaterOn: boolean;

    constructor(private data: DataService, private webSocket: WebsocketService) {
    }

    ngOnInit(): void {
        this.data._pHeaterOn.pipe(distinctUntilChanged()).subscribe((on: boolean) => {
            this.heaterOn = on;
        });
    }

    onClickButton(): void {
        this.webSocket.poolActions.heaterOn(!this.heaterOn);
    }

}
