import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapCheckinPageComponent } from './wrap-checkin-page.component';
import { UserCheckerItemModule } from './children/user-checker-item/user-checker-item.module';



@NgModule({
  declarations: [WrapCheckinPageComponent],
  imports: [
    CommonModule,
    UserCheckerItemModule
  ],
  exports: [WrapCheckinPageComponent]
})
export class WrapCheckinPageModule { }
