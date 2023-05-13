import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './top-menu.component';
import { RouterModule } from '@angular/router';
import { SidebarModule } from '../../../sidebar/sidebar.module';


@NgModule({
  declarations: [TopMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule
  ],
  exports: [TopMenuComponent]
})
export class TopMenuModule { }
