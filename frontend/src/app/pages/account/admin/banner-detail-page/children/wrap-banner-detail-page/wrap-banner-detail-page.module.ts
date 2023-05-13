import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapBannerDetailPageComponent } from './wrap-banner-detail-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { PhotoComponentModule } from 'src/app/pages/account/add-event-page/children/photo-component/photo-component.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { CounterModule } from 'src/app/components/counter/counter.module';



@NgModule({
  declarations: [WrapBannerDetailPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    SelectModule,
    PhotoComponentModule,
    InputDateModule,
    CounterModule
  ],
  exports: [WrapBannerDetailPageComponent]
})
export class WrapBannerDetailPageModule { }
