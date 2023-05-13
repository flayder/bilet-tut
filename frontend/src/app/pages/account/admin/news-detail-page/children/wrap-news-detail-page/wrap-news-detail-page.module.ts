import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapNewsDetailPageComponent } from './wrap-news-detail-page.component';
import { InputModule } from 'src/app/components/input/input.module';
import { PhotoComponentModule } from 'src/app/pages/account/add-event-page/children/photo-component/photo-component.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [WrapNewsDetailPageComponent],
  imports: [
    CommonModule,
    InputModule,
    PhotoComponentModule,
    ReactiveFormsModule
  ],
  exports: [WrapNewsDetailPageComponent]
})
export class WrapNewsDetailPageModule { }
