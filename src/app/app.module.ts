import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { PcViewerComponent } from './pc-viewer/pc-viewer.component';
import { ColorPickerModule } from "ngx-color-picker";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { PcSettingsComponent } from './pc-settings/pc-settings.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    PcViewerComponent,
    PcSettingsComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    NgxSliderModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


  constructor() {
  }


}
