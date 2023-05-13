import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuAdminComponent } from './menu-admin.component';



@NgModule({
  declarations: [MenuAdminComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [MenuAdminComponent]
})
export class MenuAdminModule { }
