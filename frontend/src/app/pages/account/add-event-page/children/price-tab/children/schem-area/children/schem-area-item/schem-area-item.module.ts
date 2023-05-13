import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemAreaItemComponent } from './schem-area-item.component';
import { ImageModule } from 'src/app/components/image/image.module';



@NgModule({
  declarations: [SchemAreaItemComponent],
  imports: [
    CommonModule,
    ImageModule
  ],
  exports: [SchemAreaItemComponent]
})
export class SchemAreaItemModule { }
