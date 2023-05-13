import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignGenreTabComponent } from './design-genre-tab.component';
import { GenrePageItemModule } from './children/genre-page-item/genre-page-item.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DesignGenreTabComponent],
  imports: [
    CommonModule,
    GenrePageItemModule,
    RouterModule
  ],
  exports: [DesignGenreTabComponent]
})
export class DesignGenreTabModule { }
