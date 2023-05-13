import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapGenreDetailPageComponent } from './wrap-genre-detail-page.component';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [WrapGenreDetailPageComponent],
  imports: [
    CommonModule,
    InputModule,
    ReactiveFormsModule
  ],
  exports: [WrapGenreDetailPageComponent]
})
export class WrapGenreDetailPageModule { }
