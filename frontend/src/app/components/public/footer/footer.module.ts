import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterLogoModule } from './children/footer-logo/footer-logo.module';
import { FooterComponent } from './footer.component';
import { AboutMenuModule } from './children/about-menu/about-menu.module';
import { BiletMenuModule } from './children/bilet-menu/bilet-menu.module';
import { ContactBlockModule } from './children/contact-block/contact-block.module';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    FooterLogoModule,
    AboutMenuModule,
    BiletMenuModule,
    ContactBlockModule
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
