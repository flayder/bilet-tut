import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEventAreaSchems } from 'src/app/exports/interfaces/IEventAreaSchems';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { ModalType } from 'src/app/exports/types/ModalType';

@Component({
  selector: '[data-app-modal-manager-scheme]',
  templateUrl: './modal-manager-scheme.component.html',
  styleUrls: ['./modal-manager-scheme.component.css']
})
export class ModalManagerSchemeComponent implements OnInit {

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams
  modal: ModalType = 'manager-scheme'
  action: string = ''

  loader = true

  event: IEventItem
  schem: IEventAreaSchems

  constructor() { }

  ngOnInit(): void {
    if(this.params.type == this.modal) {
      if(
        typeof this.params.params
      ) {
        if(this.params.params.create && this.params.params.schem) {
          this.schem = this.params.params.schem
          this.action = 'create'
        }

        if(this.params.params.event) {
          this.event = this.params.params.event
        }
      }
    }

    setTimeout(() => {
      this.loader = false
    }, 1000)
  }

  getCancel(some: any) {
    this.data.emit(this.modal)
  } 

  close(event: any) {
    event.preventDefault()

    this.data.emit(this.modal)
  }

}
