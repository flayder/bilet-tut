import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapDesignPageComponent } from './wrap-design-page.component';
import { DesignBannerTabModule } from './children/design-banner-tab/design-banner-tab.module';
import { DesignSlideTabModule } from './children/design-slide-tab/design-slide-tab.module';
import { DesignGenreTabModule } from './children/design-genre-tab/design-genre-tab.module';
import { DesignRubricTabModule } from './children/design-rubric-tab/design-rubric-tab.module';



@NgModule({
  declarations: [WrapDesignPageComponent],
  imports: [
    CommonModule,
    DesignBannerTabModule,
    DesignSlideTabModule,
    DesignGenreTabModule,
    DesignRubricTabModule
  ],
  exports: [WrapDesignPageComponent]
})
export class WrapDesignPageModule { }
