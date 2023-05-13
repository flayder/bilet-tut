import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[data-app-accordion-item]',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.css']
})
export class AccordionItemComponent implements OnInit {

  @Input() title: string = ''
  @Input() active: boolean = false
  
  constructor() { }

  ngOnInit(): void {
  }

  setState() {
    this.active = !this.active
  }

}
