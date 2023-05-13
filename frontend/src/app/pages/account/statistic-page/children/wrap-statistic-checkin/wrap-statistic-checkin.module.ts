import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapStatisticCheckinComponent } from './wrap-statistic-checkin.component';
import { StatisticCheckinItemModule } from './children/statistic-checkin-item/statistic-checkin-item.module';
import { SelectModule } from 'src/app/components/select/select.module';



@NgModule({
  declarations: [WrapStatisticCheckinComponent],
  imports: [
    CommonModule,
    StatisticCheckinItemModule,
    SelectModule
  ],
  exports: [WrapStatisticCheckinComponent]
})
export class WrapStatisticCheckinModule { }
