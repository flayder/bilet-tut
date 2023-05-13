import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintTabComponent } from './print-tab.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/components/input/input.module';
import { PhotoComponentModule } from '../photo-component/photo-component.module';
import { InputCheckboxModule } from 'src/app/components/input-checkbox/input-checkbox.module';
import { ImageModule } from 'src/app/components/image/image.module';



@NgModule({
  declarations: [PrintTabComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    PhotoComponentModule,
    InputCheckboxModule,
    ImageModule
  ],
  exports: [PrintTabComponent]
})
export class PrintTabModule { }
