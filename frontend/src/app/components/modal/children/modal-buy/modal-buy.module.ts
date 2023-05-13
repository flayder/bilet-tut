import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBuyComponent } from './modal-buy.component';
import { DateBuyModule } from './children/date-buy/date-buy.module';
import { TotalItemBuyModule } from './children/total-item-buy/total-item-buy.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { SchemeBlockModule } from 'src/app/components/global/scheme-block/scheme-block.module';
import { CounterModule } from 'src/app/components/counter/counter.module';
import { LoaderModule } from 'src/app/components/global/loader/loader.module';
import { InputModule } from 'src/app/components/input/input.module';


@NgModule({
  declarations: [
    ModalBuyComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    DateBuyModule,
    TotalItemBuyModule,
    SelectModule,
    SchemeBlockModule,
    CounterModule,
    LoaderModule
  ],
  exports: [
    ModalBuyComponent
  ]
})
export class ModalBuyModule { }
