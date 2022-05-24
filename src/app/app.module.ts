import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { PcViewerComponent } from './components/pc-viewer/pc-viewer.component';
import { ColorPickerModule } from "ngx-color-picker";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { PcSettingsComponent } from './components/pc-settings/pc-settings.component';
import { FormsModule } from "@angular/forms";
import { BaseComponent } from './components/base/base.component';
import { ColComponent } from './components/structure/col/col.component';
import { RowComponent } from './components/structure/row/row.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { LoadingComponent } from './components/utility/loading/loading.component';
import { ElementTreeComponent } from './components/element-tree/element-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    PcViewerComponent,
    PcSettingsComponent,
    BaseComponent,
    ColComponent,
    RowComponent,
    GeneralSettingsComponent,
    LoadingComponent,
    ElementTreeComponent
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
