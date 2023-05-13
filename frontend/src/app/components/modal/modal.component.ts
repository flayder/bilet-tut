import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { ModalType } from 'src/app/exports/types/ModalType';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'div[data-app-modal]',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {
  
  modalType: ModalType
  types: Array<ModalType> = []
  params: Array<IModalTypeParams>

  constructor(
    private modalService: ModalService
  ) { }

  returnZero() {
    return 0
  }

  ngOnInit(): void {
    this.modalService.isType$.subscribe((types: Array<ModalType>) => {
      this.params = this.modalService.params
      this.types = types
    })
  }

  clickOutForm(event: any) {
    if(
      !event.target.closest('.modal__main') && 
      !event.target.closest('a') &&
      !event.target.closest('.jcf-hover')
    ) {
      const last = this.types[this.types.length - 1]
      this.close(last)
    }
  }

  getParams(key: any) {
    return this.params[parseInt(key)]
  }

  open(type: ModalType) {
    this.modalService.open(type)
  }

  close(type: ModalType) {
    this.modalService.close(type)
  }

  toNum(num: any) {
    return parseInt(num)
  }

  isTiny(item: any) {
    return item.indexOf('tiny') !== -1
  }

}
