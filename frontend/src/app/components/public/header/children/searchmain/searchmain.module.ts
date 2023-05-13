import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchmainComponent } from './searchmain.component';
import { InputModule } from 'src/app/components/input/input.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SearchmainComponent],
  imports: [
    CommonModule,
    InputModule
  ],
  exports: [SearchmainComponent]
})
export class SearchmainModule { }
