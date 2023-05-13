import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { ImageModule } from 'src/app/components/image/image.module';



@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    ImageModule
  ],
  exports: [PaymentComponent]
})
export class PaymentModule { }
