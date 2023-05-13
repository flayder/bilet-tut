import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialItemComponent } from './special-item.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SpecialItemComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [SpecialItemComponent]
})
export class SpecialItemModule { }
