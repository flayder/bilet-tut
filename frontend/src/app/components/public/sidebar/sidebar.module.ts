import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { MenuUserModule } from './children/menu-user/menu-user.module';
import { MenuOrginiserModule } from './children/menu-orginiser/menu-orginiser.module';
import { MenuAdminModule } from './children/menu-admin/menu-admin.module';



@NgModule({
  declarations: [SidebarComponent],
  imports: [
    MenuUserModule,
    CommonModule,
    MenuOrginiserModule,
    MenuAdminModule
  ],
  exports: [SidebarComponent]
})
export class SidebarModule { }
