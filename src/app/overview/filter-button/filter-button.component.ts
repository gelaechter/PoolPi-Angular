import { Component, Input, OnInit } from "@angular/core";
import { distinctUntilChanged } from "rxjs/operators";
import { DataService } from "src/app/data.service";
import { WebsocketService } from "src/app/websocket.service";

@Component({
    selector: "app-filter-button",
    templateUrl: "./filter-button.component.html",
    styleUrls: ["./filter-button.component.scss"]
})
export class FilterButtonComponent implements OnInit {

    @Input() size = "xl";

    filterOn: boolean;

    constructor(private data: DataService, private webSocket: WebsocketService) {
    }

    ngOnInit(): void {
        this.data._pFilterOn.pipe(distinctUntilChanged()).subscribe((on: boolean) => {
            this.filterOn = on;
        });
    }

    onClickButton() {
        this.webSocket.poolActions.filterOn(!this.filterOn);
    }

}
