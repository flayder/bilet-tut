import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTabComponent } from './date-tab.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { DateTabItemModule } from './children/date-tab-item/date-tab-item.module';
import { WithKeyPipe } from 'src/app/exports/pipes/withekey';

@NgModule({
  declarations: [
    DateTabComponent,
    WithKeyPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    SelectModule,
    InputDateModule,
    DateTabItemModule
  ],
  exports: [DateTabComponent]
})

export class DateTabModule { }
