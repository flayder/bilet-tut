import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: '[data-app-loader]',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
