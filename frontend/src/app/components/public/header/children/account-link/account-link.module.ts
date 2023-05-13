import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountLinkComponent } from './account-link.component';
import { RouterModule } from '@angular/router';
import { ImageModule } from 'src/app/components/image/image.module';



@NgModule({
  declarations: [AccountLinkComponent],
  imports: [
    CommonModule,
    RouterModule,
    ImageModule
  ],
  exports: [AccountLinkComponent]
})
export class AccountLinkModule { }
