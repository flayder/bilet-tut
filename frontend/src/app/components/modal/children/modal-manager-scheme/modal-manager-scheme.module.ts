import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalManagerSchemeComponent } from './modal-manager-scheme.component';
import { ModalManagerSchemeCreateModule } from './children/modal-manager-scheme-create/modal-manager-scheme-create.module';
import { LoaderModule } from 'src/app/components/global/loader/loader.module';


@NgModule({
  declarations: [ModalManagerSchemeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalManagerSchemeCreateModule,
    LoaderModule
  ],
  exports: [ModalManagerSchemeComponent]
})
export class ModalManagerSchemeModule { }
