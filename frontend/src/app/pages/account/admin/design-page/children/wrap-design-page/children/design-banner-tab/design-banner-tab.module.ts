import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignBannerTabComponent } from './design-banner-tab.component';
import { BannerPageItemModule } from './children/banner-page-item/banner-page-item.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DesignBannerTabComponent],
  imports: [
    CommonModule,
    BannerPageItemModule,
    RouterModule
  ],
  exports: [DesignBannerTabComponent]
})
export class DesignBannerTabModule { }
