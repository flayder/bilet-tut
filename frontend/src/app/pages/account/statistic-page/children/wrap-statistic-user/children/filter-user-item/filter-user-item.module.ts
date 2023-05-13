import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterUserItemComponent } from './filter-user-item.component';
import { ImageModule } from 'src/app/components/image/image.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [FilterUserItemComponent],
  imports: [
    CommonModule,
    ImageModule,
    RouterModule
  ],
  exports: [FilterUserItemComponent]
})
export class FilterUserItemModule { }
