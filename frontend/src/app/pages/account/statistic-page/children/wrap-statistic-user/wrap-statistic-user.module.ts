import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapStatisticUserComponent } from './wrap-statistic-user.component';
import { FilterUserItemModule } from './children/filter-user-item/filter-user-item.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { FilterUsualUserItemModule } from './children/filter-usual-user-item/filter-usual-user-item.module';



@NgModule({
  declarations: [WrapStatisticUserComponent],
  imports: [
    CommonModule,
    SelectModule,
    FilterUserItemModule,
    FilterUsualUserItemModule
  ],
  exports: [WrapStatisticUserComponent]
})
export class WrapStatisticUserModule { }
