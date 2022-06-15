import { Component, Input, OnInit } from '@angular/core';
import { PcSettings } from "../pco-settings/pco-settings.component";
import { DefaultPointCloud } from "../../../elements/default-point-cloud";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";

@Component({
  selector: 'app-default-pc-settings',
  templateUrl: './default-pc-settings.component.html',
  styleUrls: ['./default-pc-settings.component.css', '../element-settings.css']
})
export class DefaultPcSettingsComponent implements OnInit {

  options: any = {
    min: 1,
    max: 20
  };

  settings: PcSettings = {
    color: "#000000",
    pointSize: 2,
  }

  type: SceneElementsEnum = SceneElementsEnum.UNKNOWN;

  pcos: DefaultPointCloud[] | undefined;

  private _data: SceneElement[] | undefined;
  @Input() set data(sceneElements: SceneElement[]) {
    this._data = sceneElements;

    this.pcos = [];
    this._data?.forEach((sceneElement) => {
      this.pcos?.push(sceneElement.element as DefaultPointCloud);
      this.type = sceneElement.sceneType;
    });
  }

  get data() {
    return this._data ? this._data : [];
  }

  constructor() {}

  ngOnInit(): void {
  }

  setPointSize(): void {
    this.pcos?.forEach((pc) => {
      pc.setPointSize(this.settings.pointSize);
    });
  }

  setColor(): void {
    this.pcos?.forEach((pc) => {
      pc.setColor(this.settings.color);
    });
  }

  resetColor(): void {
    this.pcos?.forEach((pc) => {
      pc.resetColor();
    });
  }

}
