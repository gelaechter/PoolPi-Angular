import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dosing-list-item',
  templateUrl: './dosing-list-item.component.html',
  styleUrls: ['./dosing-list-item.component.scss'],
  host: {'class': 'list-group-item'}
})
export class DosingListItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
