import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketSumBlockComponent } from './basket-sum-block.component';
import { BasketDiscountModule } from './children/basket-discount/basket-discount.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [BasketSumBlockComponent],
  imports: [
    CommonModule,
    BasketDiscountModule,
    RouterModule
  ],
  exports: [BasketSumBlockComponent]
})
export class BasketSumBlockModule { }
