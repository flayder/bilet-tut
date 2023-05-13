import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemAreaComponent } from './schem-area.component';
import { SchemAreaItemModule } from './children/schem-area-item/schem-area-item.module';
import { SelectModule } from 'src/app/components/select/select.module';



@NgModule({
  declarations: [SchemAreaComponent],
  imports: [
    CommonModule,
    SchemAreaItemModule,
    SelectModule
  ],
  exports: [SchemAreaComponent]
})
export class SchemAreaModule { }
