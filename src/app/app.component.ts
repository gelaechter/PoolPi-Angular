import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    connected: boolean;

    constructor(private webSocket: WebsocketService) {
    }

    ngOnInit(): void {
        this.webSocket.connected.pipe(distinctUntilChanged()).subscribe((connected: boolean) => {
            this.connected = connected;
        })
    }

}
