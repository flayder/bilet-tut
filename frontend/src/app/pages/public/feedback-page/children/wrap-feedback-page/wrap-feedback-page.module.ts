import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapFeedbackPageComponent } from './wrap-feedback-page.component';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputCheckboxModule } from 'src/app/components/input-checkbox/input-checkbox.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [WrapFeedbackPageComponent],
  imports: [
    CommonModule,
    InputModule,
    SelectModule,
    InputCheckboxModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [WrapFeedbackPageComponent]
})
export class WrapFeedbackPageModule { }
