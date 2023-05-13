import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSlideTabComponent } from './design-slide-tab.component';
import { RouterModule } from '@angular/router';
import { SliderPageItemModule } from './children/slider-page-item/slider-page-item.module';



@NgModule({
  declarations: [DesignSlideTabComponent],
  imports: [
    CommonModule,
    RouterModule,
    SliderPageItemModule
  ],
  exports: [DesignSlideTabComponent]
})
export class DesignSlideTabModule { }
