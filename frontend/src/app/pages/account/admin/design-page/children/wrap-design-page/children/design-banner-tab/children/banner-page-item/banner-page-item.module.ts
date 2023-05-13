import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'src/app/components/image/image.module';
import { BannerPageItemComponent } from './banner-page-item.component';



@NgModule({
  declarations: [BannerPageItemComponent],
  imports: [
    CommonModule,
    ImageModule
  ],
  exports: [BannerPageItemComponent]
})
export class BannerPageItemModule { }
