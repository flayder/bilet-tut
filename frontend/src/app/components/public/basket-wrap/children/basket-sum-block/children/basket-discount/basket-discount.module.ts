import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketDiscountComponent } from './basket-discount.component';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [BasketDiscountComponent],
  imports: [
    CommonModule,
    InputModule,
    ReactiveFormsModule
  ],
  exports: [BasketDiscountComponent]
})
export class BasketDiscountModule { }
