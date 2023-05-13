import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VidgetTabComponent } from './vidget-tab.component';



@NgModule({
  declarations: [VidgetTabComponent],
  imports: [
    CommonModule
  ],
  exports: [VidgetTabComponent]
})
export class VidgetTabModule { }
