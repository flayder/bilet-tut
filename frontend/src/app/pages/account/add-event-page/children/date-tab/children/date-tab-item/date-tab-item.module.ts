import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTabItemComponent } from './date-tab-item.component';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { InputTimeModule } from 'src/app/components/input-time/input-time.module';



@NgModule({
  declarations: [DateTabItemComponent],
  imports: [
    CommonModule,
    InputModule,
    InputTimeModule,
    SelectModule,
    InputDateModule,
    ReactiveFormsModule
  ],
  exports: [DateTabItemComponent]
})
export class DateTabItemModule { }
