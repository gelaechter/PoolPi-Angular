import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  host: {'class': 'list-group'}
})
export class ListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

}
