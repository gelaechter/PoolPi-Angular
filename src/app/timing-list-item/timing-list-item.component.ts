import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timing-list-item',
  templateUrl: './timing-list-item.component.html',
  styleUrls: ['./timing-list-item.component.scss'],
  host: {'class': 'list-group-item'}
})
export class TimingListItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
