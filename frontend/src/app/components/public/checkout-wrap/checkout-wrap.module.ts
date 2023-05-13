import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutWrapComponent } from './checkout-wrap.component';
import { RouterModule } from '@angular/router';
import { BasketSumBlockModule } from '../basket-wrap/children/basket-sum-block/basket-sum-block.module';
import { InputModule } from '../../input/input.module';
import { InputPhoneModule } from '../../input-phone/input-phone.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentModule } from './children/payment/payment.module';



@NgModule({
  declarations: [CheckoutWrapComponent],
  imports: [
    CommonModule,
    RouterModule,
    BasketSumBlockModule,
    InputModule,
    InputPhoneModule,
    ReactiveFormsModule,
    PaymentModule
  ],
  exports: [CheckoutWrapComponent]
})
export class CheckoutWrapModule { }
