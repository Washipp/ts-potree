import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';

import {PcViewerComponent} from './pc-viewer/pc-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    PcViewerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


  constructor() {
  }


}
