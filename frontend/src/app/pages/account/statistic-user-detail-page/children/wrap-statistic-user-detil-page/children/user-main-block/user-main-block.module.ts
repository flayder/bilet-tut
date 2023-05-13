import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMainBlockComponent } from './user-main-block.component';
import { ImageModule } from 'src/app/components/image/image.module';



@NgModule({
  declarations: [UserMainBlockComponent],
  imports: [
    CommonModule,
    ImageModule
  ],
  exports: [UserMainBlockComponent]
})
export class UserMainBlockModule { }
