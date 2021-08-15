import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    host: { class: 'list-group' },
})
export class ListComponent {
    @Input() target = "";

    constructor() {}

}
