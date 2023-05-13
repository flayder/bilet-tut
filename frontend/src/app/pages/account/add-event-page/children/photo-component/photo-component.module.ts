import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoComponentComponent } from './photo-component.component';



@NgModule({
  declarations: [PhotoComponentComponent],
  imports: [
    CommonModule
  ],
  exports: [PhotoComponentComponent]
})
export class PhotoComponentModule { }
