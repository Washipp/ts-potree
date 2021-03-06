import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { SceneComponent } from './components/scene/scene.component';
import { ColorPickerModule } from "ngx-color-picker";
import { FormsModule } from "@angular/forms";
import { BaseComponent } from './components/base/base.component';
import { ColComponent } from './components/structure/col/col.component';
import { RowComponent } from './components/structure/row/row.component';
import { SceneSettingsComponent } from './components/scene-settings/scene-settings.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { LoadingComponent } from './components/utility/loading/loading.component';
import { ElementTreeComponent } from './components/element-tree/element-tree.component';
import { EnumToReadableString } from "./components/utility/pipes/enum-to-readable-string";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { GroupComponent } from './components/element-tree/group/group.component';
import { environment } from "../environments/environment";
import { KeyboardShortcutsModule } from "ng-keyboard-shortcuts";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { PlatformModule } from "@angular/cdk/platform";
import { ElementSettingComponent } from './components/element-setting/element-setting.component';
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StringToUrlStringPipe } from "./components/utility/pipes/array-to-url-string";

const config: SocketIoConfig = {
  url: `${environment.baseUrl}:${environment.port}`,
  options: {
    transports: ["websocket", "polling", ]
  }
};


@NgModule({
  declarations: [
    AppComponent,
    SceneComponent,
    BaseComponent,
    ColComponent,
    RowComponent,
    SceneSettingsComponent,
    LoadingComponent,
    ElementTreeComponent,
    EnumToReadableString,
    StringToUrlStringPipe,
    GroupComponent,
    ElementSettingComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    KeyboardShortcutsModule.forRoot(),
    ClipboardModule,
    PlatformModule,
    RouterModule.forRoot([]),
    BrowserAnimationsModule,
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {


  constructor() {
  }


}
