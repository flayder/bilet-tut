import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorListComponent } from './color-list.component';



@NgModule({
  declarations: [ColorListComponent],
  imports: [
    CommonModule
  ],
  exports: [ColorListComponent]
})
export class ColorListModule { }
