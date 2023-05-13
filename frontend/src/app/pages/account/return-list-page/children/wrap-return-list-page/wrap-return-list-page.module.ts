import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapReturnListPageComponent } from './wrap-return-list-page.component';
import { ReturnListPageItemModule } from '../return-list-page-item/return-list-page-item.module';
import { SelectModule } from 'src/app/components/select/select.module';



@NgModule({
  declarations: [WrapReturnListPageComponent],
  imports: [
    CommonModule,
    ReturnListPageItemModule,
    SelectModule
  ],
  exports: [WrapReturnListPageComponent]
})
export class WrapReturnListPageModule { }
