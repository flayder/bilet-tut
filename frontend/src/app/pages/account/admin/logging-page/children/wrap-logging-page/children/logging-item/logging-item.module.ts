import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingItemComponent } from './logging-item.component';



@NgModule({
  declarations: [LoggingItemComponent],
  imports: [
    CommonModule
  ],
  exports: [LoggingItemComponent]
})
export class LoggingItemModule { }
