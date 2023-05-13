import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenrePageItemComponent } from './genre-page-item.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [GenrePageItemComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [GenrePageItemComponent]
})
export class GenrePageItemModule { }
