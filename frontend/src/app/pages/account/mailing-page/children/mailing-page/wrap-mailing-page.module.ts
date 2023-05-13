import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapMailingPageComponent } from './wrap-mailing-page.component';
import { MailingItemModule } from '../mailing-item/mailing-item.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [WrapMailingPageComponent],
  imports: [
    CommonModule,
    MailingItemModule,
    RouterModule
  ],
  exports: [WrapMailingPageComponent]
})
export class WrapMailingPageModule { }
