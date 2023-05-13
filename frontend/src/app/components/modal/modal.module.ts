import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBuyModule } from './children/modal-buy/modal-buy.module';
import { ModalComponent } from './modal.component';
import { ModalTextModule } from './children/modal-text/modal-text.module';
import { ModalAccountPriceModule } from './children/modal-account-price/modal-account-price.module';
import { ModalAccountCategoryModule } from './children/modal-account-category/modal-account-category.module';
import { ModalAccountPromocodModule } from './children/modal-account-promocod/modal-account-promocod.module';
import { ModalCheckerModule } from './children/modal-checker/modal-checker.module';
import { ModalAccountIexportModule } from './children/modal-account-iexmport/modal-account-iexmport.module';
import { ModalAccountMailingItemModule } from './children/modal-account-mailing-item/modal-account-mailing-item.module';
import { ModalAccountUserShortModule } from './children/modal-account-user-short/modal-account-user-short.module';
import { ModalManagerSchemeModule } from './children/modal-manager-scheme/modal-manager-scheme.module';
import { ModalNotificationModule } from './children/modal-notification/modal-notification.module';



@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    ModalBuyModule,
    ModalTextModule,
    ModalAccountPriceModule,
    ModalAccountCategoryModule,
    ModalAccountPromocodModule,
    ModalCheckerModule,
    ModalAccountIexportModule,
    ModalAccountMailingItemModule,
    ModalAccountUserShortModule,
    ModalManagerSchemeModule,
    ModalNotificationModule
  ],
  exports: [ModalComponent]
})
export class ModalModule { }
