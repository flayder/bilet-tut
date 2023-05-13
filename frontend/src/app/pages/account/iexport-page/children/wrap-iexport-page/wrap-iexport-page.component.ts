import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-wrap-iexport-page]',
  templateUrl: './wrap-iexport-page.component.html',
  styleUrls: ['./wrap-iexport-page.component.css']
})
export class WrapIexportPageComponent implements OnInit {

  constructor(
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal$.open("account-iexmport-tiny")
  }

}
