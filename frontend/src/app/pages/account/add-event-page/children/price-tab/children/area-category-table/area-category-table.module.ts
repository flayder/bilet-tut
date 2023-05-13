import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaCategoryTableComponent } from './area-category-table.component';
import { AreaCategoryTableItemModule } from './children/area-category-table-item/area-category-table-item.module';



@NgModule({
  declarations: [AreaCategoryTableComponent],
  imports: [
    CommonModule,
    AreaCategoryTableItemModule
  ],
  exports: [AreaCategoryTableComponent]
})
export class AreaCategoryTableModule { }
