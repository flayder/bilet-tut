import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapAccountSettingsComponent } from './wrap-account-settings.component';
import { AccountFormModule } from '../account-form/account-form.module';
import { ChangePasswordFormModule } from '../change-password-form/change-password-form.module';
import { DetailPageModule } from '../detail-page/detail-page.module';



@NgModule({
  declarations: [WrapAccountSettingsComponent],
  imports: [
    CommonModule,
    AccountFormModule,
    ChangePasswordFormModule,
    DetailPageModule
  ],
  exports: [WrapAccountSettingsComponent]
})
export class WrapAccountSettingsModule { }
