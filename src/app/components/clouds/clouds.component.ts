import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.component.html',
  styleUrls: ['./clouds.component.css']
})
export class CloudsComponent implements OnInit {

  @Input() config = {};

  constructor() { }

  ngOnInit(): void {
  }

}
