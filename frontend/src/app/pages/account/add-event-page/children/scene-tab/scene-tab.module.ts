import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SceneTabComponent } from './scene-tab.component';
import { PhotoComponentModule } from '../photo-component/photo-component.module';



@NgModule({
  declarations: [SceneTabComponent],
  imports: [
    CommonModule,
    PhotoComponentModule
  ],
  exports: [SceneTabComponent]
})
export class SceneTabModule { }
