import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewItemComponent } from './new-item.component';
import { ImageModule } from '../../image/image.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [NewItemComponent],
  imports: [
    CommonModule,
    ImageModule,
    RouterModule
  ],
  exports: [NewItemComponent]
})
export class NewItemModule { }
