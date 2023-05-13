import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapReportPageComponent } from './wrap-report-page.component';
import { SelectModule } from '../../../../../components/select/select.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportPageItemModule } from '../report-page-item/report-page-item.module';



@NgModule({
  declarations: [WrapReportPageComponent],
  imports: [
    CommonModule,
    ReportPageItemModule,
    SelectModule,
    ReactiveFormsModule
  ],
  exports: [WrapReportPageComponent]
})
export class WrapReportPageModule { }
