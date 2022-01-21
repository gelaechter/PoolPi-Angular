import { Component, OnInit } from "@angular/core";
import { distinctUntilChanged } from "rxjs/operators";
import { DataService } from "src/app/data.service";
import { WebsocketService } from "src/app/websocket.service";

@Component({
    selector: "app-temp-control",
    templateUrl: "./temp-control.component.html",
    styleUrls: ["./temp-control.component.scss"]
})
export class TempControlComponent implements OnInit {

    constructor(private data: DataService, private webSocket: WebsocketService) { }

    currentTemp = 0;
    goalTemp = 0;

    ngOnInit(): void {
        this.data._hCurrentTemp.pipe(distinctUntilChanged()).subscribe((temp: number) => {
            this.currentTemp = temp;
        });

        this.data._hGoalTemp.pipe(distinctUntilChanged()).subscribe((temp: number) => {
            this.goalTemp = temp;
        });
    }

    increaseTemp(): void {
        this.webSocket.hotTubActions.setGoalTemp(this.goalTemp + 1);
    }

    decreaseTemp(): void {
        this.webSocket.hotTubActions.setGoalTemp(this.goalTemp - 1);
    }

}
