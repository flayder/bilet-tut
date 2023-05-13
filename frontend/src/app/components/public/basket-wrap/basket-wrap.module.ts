import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketWrapComponent } from './basket-wrap.component';
import { BasketSumBlockModule } from './children/basket-sum-block/basket-sum-block.module';
import { BasketItemModule } from './children/basket-item/basket-item.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [BasketWrapComponent],
  imports: [
    CommonModule,
    BasketItemModule,
    BasketSumBlockModule,
    RouterModule
  ],
  exports: [BasketWrapComponent]
})
export class BasketWrapModule { }
