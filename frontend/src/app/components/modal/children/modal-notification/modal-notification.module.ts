import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalNotificationComponent } from './modal-notification.component';


@NgModule({
  declarations: [ModalNotificationComponent],
  imports: [
    CommonModule
  ],
  exports: [ModalNotificationComponent]
})
export class ModalNotificationModule { }
