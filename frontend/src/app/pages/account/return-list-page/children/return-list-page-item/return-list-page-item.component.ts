import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICheckoutReturn } from 'src/app/exports/interfaces/ICheckoutReturn';

@Component({
  selector: 'tr[data-app-return-list-page-item]',
  templateUrl: './return-list-page-item.component.html',
  styleUrls: ['./return-list-page-item.component.css']
})
export class ReturnListPageItemComponent implements OnInit {

  @Input() item: ICheckoutReturn

  constructor(
    private router$: Router
  ) { }

  ngOnInit(): void {
  }

  edit(event: any) {
    event.preventDefault()
    this.router$.navigateByUrl(`/account/return/${this.item.id}`)
  }

}
