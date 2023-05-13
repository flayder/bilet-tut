import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfishaTabComponent } from './afisha-tab.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PhotoComponentModule } from '../photo-component/photo-component.module';



@NgModule({
  declarations: [AfishaTabComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PhotoComponentModule
  ],
  exports: [AfishaTabComponent]
})
export class AfishaTabModule { }
