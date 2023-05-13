import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RubricPageItemComponent } from './rubric-page-item.component';
import { ImageModule } from 'src/app/components/image/image.module';



@NgModule({
  declarations: [RubricPageItemComponent],
  imports: [
    CommonModule,
    ImageModule
  ],
  exports: [RubricPageItemComponent]
})
export class RubricPageItemModule { }
