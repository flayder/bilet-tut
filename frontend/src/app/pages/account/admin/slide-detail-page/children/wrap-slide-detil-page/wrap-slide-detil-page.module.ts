import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapSlideDetilPageComponent } from './wrap-slide-detil-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/components/input/input.module';
import { PhotoComponentModule } from 'src/app/pages/account/add-event-page/children/photo-component/photo-component.module';
import { CounterModule } from 'src/app/components/counter/counter.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';



@NgModule({
  declarations: [WrapSlideDetilPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    PhotoComponentModule,
    CounterModule,
    InputDateModule
  ],
  exports: [WrapSlideDetilPageComponent]
})
export class WrapSlideDetilPageModule { }
