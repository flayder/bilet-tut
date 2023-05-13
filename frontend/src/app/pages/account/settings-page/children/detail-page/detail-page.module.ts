import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPageComponent } from './detail-page.component';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DetailPageComponent],
  imports: [
    CommonModule,
    InputModule,
    SelectModule,
    ReactiveFormsModule
  ],
  exports: [DetailPageComponent]
})
export class DetailPageModule { }
