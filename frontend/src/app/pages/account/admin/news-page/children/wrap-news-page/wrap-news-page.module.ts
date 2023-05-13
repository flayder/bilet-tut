import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapNewsPageComponent } from './wrap-news-page.component';
import { RouterModule } from '@angular/router';
import { NewItemModule } from 'src/app/components/public/new-item/new-item.module';


@NgModule({
  declarations: [WrapNewsPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    NewItemModule
  ],
  exports: [WrapNewsPageComponent]
})
export class WrapNewsPageModule { }
