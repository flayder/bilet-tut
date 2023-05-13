import { Component, OnInit } from '@angular/core';
import { ISpecialItem } from 'src/app/exports/interfaces/ISpecialItem';
import { SpecialService } from 'src/app/services/special.service';

@Component({
  selector: '[data-app-wrap-special-page]',
  templateUrl: './wrap-special-page.component.html',
  styleUrls: ['./wrap-special-page.component.css']
})
export class WrapSpecialPageComponent implements OnInit {

  items: ISpecialItem[] = []

  constructor(
    private special$: SpecialService
  ) { 
    this.special$.items.subscribe(items => {
      this.items = items
    })
  }

  ngOnInit(): void {
    this.special$.getSpecials()
  }

}
