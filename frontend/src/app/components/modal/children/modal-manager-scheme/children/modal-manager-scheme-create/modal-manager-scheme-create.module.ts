import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalManagerSchemeCreateComponent } from './modal-manager-scheme-create.component';
import { SafePipe } from 'src/app/exports/pipes/safepipe';
import { SchemeBlockModule } from 'src/app/components/global/scheme-block/scheme-block.module';


@NgModule({
  declarations: [
    ModalManagerSchemeCreateComponent
  ],
  imports: [
    CommonModule,
    SafePipe,
    SchemeBlockModule
  ],
  exports: [
    ModalManagerSchemeCreateComponent
  ]
})
export class ModalManagerSchemeCreateModule { }
