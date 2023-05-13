import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketItemComponent } from './basket-item.component';
import { RouterModule } from '@angular/router';
import { ImageModule } from 'src/app/components/image/image.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { CounterModule } from 'src/app/components/counter/counter.module';



@NgModule({
  declarations: [BasketItemComponent],
  imports: [
    CommonModule,
    RouterModule,
    ImageModule,
    InputDateModule,
    CounterModule
  ],
  exports: [BasketItemComponent]
})
export class BasketItemModule { }
