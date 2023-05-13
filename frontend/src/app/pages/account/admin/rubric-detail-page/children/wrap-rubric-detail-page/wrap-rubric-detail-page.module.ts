import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapRubricDetailPageComponent } from './wrap-rubric-detail-page.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CounterModule } from 'src/app/components/counter/counter.module';
import { PhotoComponentModule } from 'src/app/pages/account/add-event-page/children/photo-component/photo-component.module';



@NgModule({
  declarations: [WrapRubricDetailPageComponent],
  imports: [
    CommonModule,
    SelectModule,
    InputModule,
    CounterModule,
    PhotoComponentModule,
    ReactiveFormsModule
  ],
  exports: [WrapRubricDetailPageComponent]
})
export class WrapRubricDetailPageModule { }
