import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderPageItemComponent } from './slider-page-item.component';
import { ImageModule } from 'src/app/components/image/image.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SliderPageItemComponent],
  imports: [
    CommonModule,
    ImageModule,
    RouterModule
  ],
  exports: [SliderPageItemComponent]
})
export class SliderPageItemModule { }
