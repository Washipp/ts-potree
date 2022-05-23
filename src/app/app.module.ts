import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { PcViewerComponent } from './components/parse/pc-viewer/pc-viewer.component';
import { ColorPickerModule } from "ngx-color-picker";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { PcSettingsComponent } from './components/parse/pc-settings/pc-settings.component';
import { FormsModule } from "@angular/forms";
import { BaseComponent } from './components/parse/base/base.component';
import { ColComponent } from './components/parse/structure/col/col.component';
import { RowComponent } from './components/parse/structure/row/row.component';
import { GeneralSettingsComponent } from './components/parse/general-settings/general-settings.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    PcViewerComponent,
    PcSettingsComponent,
    BaseComponent,
    ColComponent,
    RowComponent,
    GeneralSettingsComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    NgxSliderModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {


  constructor() {
  }


}
