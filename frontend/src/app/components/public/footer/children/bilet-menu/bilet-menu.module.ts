import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiletMenuComponent } from './bilet-menu.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [BiletMenuComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [BiletMenuComponent]
})
export class BiletMenuModule { }
