import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCheckerItemComponent } from './user-checker-item.component';



@NgModule({
  declarations: [UserCheckerItemComponent],
  imports: [
    CommonModule
  ],
  exports: [UserCheckerItemComponent]
})
export class UserCheckerItemModule { }
