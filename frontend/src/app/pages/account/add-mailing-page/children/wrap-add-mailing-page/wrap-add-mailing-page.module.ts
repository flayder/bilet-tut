import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapAddMailingPageComponent } from './wrap-add-mailing-page.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PhotoComponentModule } from '../../../add-event-page/children/photo-component/photo-component.module';
import { RouterModule } from '@angular/router';
import { InputCheckboxModule } from 'src/app/components/input-checkbox/input-checkbox.module';



@NgModule({
  declarations: [WrapAddMailingPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    SelectModule,
    InputDateModule,
    InputModule,
    InputCheckboxModule,
    ReactiveFormsModule,
    PhotoComponentModule
  ],
  exports: [WrapAddMailingPageComponent]
})
export class WrapAddMailingPageModule { }
