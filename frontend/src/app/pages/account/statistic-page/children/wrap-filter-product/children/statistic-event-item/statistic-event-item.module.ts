import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from '../../../../../../../components/image/image.module';
import { StatisticEventItemComponent } from './statistic-event-item.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [StatisticEventItemComponent],
  imports: [
    CommonModule,
    ImageModule,
    RouterModule
  ],
  exports: [StatisticEventItemComponent]
})
export class StatisticEventItemModule { }
