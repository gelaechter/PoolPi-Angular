import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { WebsocketService } from '../websocket.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss']
})
export class FilterButtonComponent implements OnInit {

    filterOn: boolean;

    constructor(private data: DataService, private webSocket: WebsocketService) {
    }

    ngOnInit(): void {
        this.data._filterOn.pipe(distinctUntilChanged()).subscribe((on: boolean) => {
            this.filterOn = on;
        })
    }

    onClickButton() {
        this.webSocket.poolActions.filterOn(!this.filterOn);
    }

}
