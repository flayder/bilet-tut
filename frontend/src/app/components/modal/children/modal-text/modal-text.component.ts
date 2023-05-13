import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { ModalType } from 'src/app/exports/types/ModalType';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'div[data-app-modal-text]',
  templateUrl: './modal-text.component.html',
  styleUrls: ['./modal-text.component.css']
})
export class ModalTextComponent implements OnInit {

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams

  constructor(
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.data.emit('text')
  }

}
