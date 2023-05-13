import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'src/app/components/image/image.module';
import { RouterModule } from '@angular/router';
import { FilterUsualUserItemComponent } from './filter-usual-user-item.component';

@NgModule({
  declarations: [FilterUsualUserItemComponent],
  imports: [
    CommonModule,
    ImageModule,
    RouterModule
  ],
  exports: [FilterUsualUserItemComponent]
})
export class FilterUsualUserItemModule { }
