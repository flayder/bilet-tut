import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOrginiserComponent } from './menu-orginiser.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MenuOrginiserComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [MenuOrginiserComponent]
})
export class MenuOrginiserModule { }
