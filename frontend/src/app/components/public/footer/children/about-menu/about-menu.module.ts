import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutMenuComponent } from './about-menu.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [AboutMenuComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [AboutMenuComponent],
})
export class AboutMenuModule { }
