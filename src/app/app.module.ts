import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { PcViewerComponent } from './pc-viewer/pc-viewer.component';
import { ColorPickerModule } from "ngx-color-picker";
import { NgxSliderModule } from "@angular-slider/ngx-slider";

@NgModule({
  declarations: [
    AppComponent,
    PcViewerComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    NgxSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


  constructor() {
  }


}
