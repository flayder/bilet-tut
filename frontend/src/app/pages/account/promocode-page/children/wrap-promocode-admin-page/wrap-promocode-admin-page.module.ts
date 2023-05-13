import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapPromocodeAdminPageComponent } from './wrap-promocode-admin-page.component';
import { PromocodeFilterBlockModule } from '../promocode-filter-block/promocode-filter-block.module';
import { AdminPromocodeItemModule } from './children/admin-promocode-item/admin-promocode-item.module';



@NgModule({
  declarations: [WrapPromocodeAdminPageComponent],
  imports: [
    CommonModule,
    PromocodeFilterBlockModule,
    AdminPromocodeItemModule
  ],
  exports: [WrapPromocodeAdminPageComponent]
})
export class WrapPromocodeAdminPageModule { }
