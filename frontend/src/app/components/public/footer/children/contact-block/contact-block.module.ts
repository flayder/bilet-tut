import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactBlockComponent } from './contact-block.component';

@NgModule({
  declarations: [ContactBlockComponent],
  imports: [
    CommonModule
  ],
  exports: [ContactBlockComponent]
})
export class ContactBlockModule { }
