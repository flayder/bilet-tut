import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeBlockComponent } from './scheme-block.component';
import { SafePipe } from 'src/app/exports/pipes/safepipe';



@NgModule({
  declarations: [SchemeBlockComponent],
  imports: [
    CommonModule,
    SafePipe
  ],
  exports: [SchemeBlockComponent],
  providers: [SafePipe]
})
export class SchemeBlockModule { }
