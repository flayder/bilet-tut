import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignRubricTabComponent } from './design-rubric-tab.component';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { RubricPageItemModule } from './children/rubric-page-item/rubric-page-item.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DesignRubricTabComponent],
  imports: [
    CommonModule,
    RouterModule,
    InputDateModule,
    SelectModule,
    RubricPageItemModule
  ],
  exports: [DesignRubricTabComponent]
})
export class DesignRubricTabModule { }
