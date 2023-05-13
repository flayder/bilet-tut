import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTextComponent } from './modal-text.component';


@NgModule({
  declarations: [ModalTextComponent],
  imports: [
    CommonModule
  ],
  exports: [ModalTextComponent]
})
export class ModalTextModule { }
