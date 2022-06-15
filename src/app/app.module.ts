import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { PcViewerComponent } from './components/pc-viewer/pc-viewer.component';
import { ColorPickerModule } from "ngx-color-picker";
import { PcoSettingsComponent } from './components/element-settings/pco-settings/pco-settings.component';
import { FormsModule } from "@angular/forms";
import { BaseComponent } from './components/base/base.component';
import { ColComponent } from './components/structure/col/col.component';
import { RowComponent } from './components/structure/row/row.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { LoadingComponent } from './components/utility/loading/loading.component';
import { ElementTreeComponent } from './components/element-tree/element-tree.component';
import { EntryComponent } from './components/element-tree/entry/entry.component';
import { EnumToReadableString } from "./components/utility/pipes/enum-to-readable-string";
import { CameraTrajectorySettingsComponent } from './components/element-settings/camera-trajectory-settings/camera-trajectory-settings.component';
import { DefaultPcSettingsComponent } from './components/element-settings/default-pc-settings/default-pc-settings.component';
import { SynchronizeService } from "./services/synchronize.service";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { LineSetSettingsComponent } from './components/element-settings/line-set-settings/line-set-settings.component';
import { BranchComponent } from './components/element-tree/branch/branch.component';

const config: SocketIoConfig = {
  url: 'http://127.0.0.1:5000',
  options: {
    transports: ["websocket", "polling", ]
  }
};


@NgModule({
  declarations: [
    AppComponent,
    PcViewerComponent,
    PcoSettingsComponent,
    BaseComponent,
    ColComponent,
    RowComponent,
    GeneralSettingsComponent,
    LoadingComponent,
    ElementTreeComponent,
    EntryComponent,
    EnumToReadableString,
    CameraTrajectorySettingsComponent,
    DefaultPcSettingsComponent,
    LineSetSettingsComponent,
    BranchComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [HttpClient, SynchronizeService],
  bootstrap: [AppComponent]
})
export class AppModule {


  constructor() {
  }


}
