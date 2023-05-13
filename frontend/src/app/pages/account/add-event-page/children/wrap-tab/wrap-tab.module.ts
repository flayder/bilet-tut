import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapTabComponent } from './wrap-tab.component';
import { MainTabModule } from '../main-tab/main-tab.module';
import { AfishaTabModule } from '../afisha-tab/afisha-tab.module';
import { DateTabModule } from '../date-tab/date-tab.module';
import { SceneTabModule } from '../scene-tab/scene-tab.module';
import { PriceTabModule } from '../price-tab/price-tab.module';
import { VidgetTabModule } from '../vidget-tab/vidget-tab.module';
import { PrintTabModule } from '../print-tab/print-tab.module';
import { DistributeTabModule } from '../distribute-tab/distribute-tab.module';



@NgModule({
  declarations: [WrapTabComponent],
  imports: [
    CommonModule,
    MainTabModule,
    AfishaTabModule,
    DateTabModule,
    SceneTabModule,
    PriceTabModule,
    VidgetTabModule,
    PrintTabModule,
    DistributeTabModule
  ],
  exports: [WrapTabComponent]
})
export class WrapTabModule { }
