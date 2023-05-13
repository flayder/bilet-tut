import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapLoggingPageComponent } from './wrap-logging-page.component';
import { LoggingItemModule } from './children/logging-item/logging-item.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';



@NgModule({
  declarations: [WrapLoggingPageComponent],
  imports: [
    CommonModule,
    LoggingItemModule,
    SelectModule,
    InputDateModule
  ],
  exports: [WrapLoggingPageComponent]
})
export class WrapLoggingPageModule { }
