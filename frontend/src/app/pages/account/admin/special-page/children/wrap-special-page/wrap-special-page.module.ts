import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapSpecialPageComponent } from './wrap-special-page.component';
import { SpecialItemModule } from '../special-item/special-item.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [WrapSpecialPageComponent],
  imports: [
    CommonModule,
    SpecialItemModule,
    RouterModule
  ],
  exports: [WrapSpecialPageComponent]
})
export class WrapSpecialPageModule { }
