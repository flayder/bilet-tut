import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderLogoComponent } from './header-logo.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderLogoComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [HeaderLogoComponent]
})
export class HeaderLogoModule { }
