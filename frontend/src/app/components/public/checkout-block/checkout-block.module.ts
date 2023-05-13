import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutBlockComponent } from './checkout-block.component';
import { RouterModule } from '@angular/router';
import { ImageModule } from '../../image/image.module';



@NgModule({
  declarations: [CheckoutBlockComponent],
  imports: [
    CommonModule,
    RouterModule,
    ImageModule
  ],
  exports: [CheckoutBlockComponent]
})
export class CheckoutBlockModule { }
