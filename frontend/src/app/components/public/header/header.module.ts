import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { HeaderLogoModule } from './children/header-logo/header-logo.module';
import { AccountLinkModule } from './children/account-link/account-link.module';
import { BasketModule } from './children/basket/basket.module';
import { SearchmainModule } from './children/searchmain/searchmain.module';
import { TopMenuModule } from './children/top-menu/top-menu.module';


@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HeaderLogoModule,
    AccountLinkModule,
    BasketModule,
    SearchmainModule,
    TopMenuModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
