import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainTabComponent } from './main-tab.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { PaymentModule } from './children/payment/payment.module';
//import { PaymentModule } from 'src/app/components/public/checkout-wrap/children/payment/payment.module';



@NgModule({
  declarations: [MainTabComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    SelectModule,
    PaymentModule
    //PaymentModule,
    
  ],
  exports: [MainTabComponent]
})
export class MainTabModule { }
