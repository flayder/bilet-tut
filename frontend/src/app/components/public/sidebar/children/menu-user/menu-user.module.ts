import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuUserComponent } from './menu-user.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MenuUserComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [MenuUserComponent]
})
export class MenuUserModule { }
