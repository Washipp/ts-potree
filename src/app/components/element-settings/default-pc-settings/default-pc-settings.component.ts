import { Component, Input, OnInit } from '@angular/core';
import { PcSettings } from "../pco-settings/pco-settings.component";
import { DefaultPointCloud } from "../../../elements/default-point-cloud";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";
import { HelperFunctions } from "../../utility/helper-functions";

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
    boundingBox: false,
  }

  type: SceneElementsEnum = SceneElementsEnum.UNKNOWN;

  pcs: DefaultPointCloud[] | undefined;

  private _data: SceneElement[] | undefined;
  @Input() set data(sceneElements: SceneElement[]) {
    this._data = sceneElements;

    this.pcs = [];
    sceneElements.forEach((sceneElement) => {
      let pc = sceneElement.element as DefaultPointCloud;
      this.settings.color = '#' + pc.getColor().getHexString();
      this.pcs?.push(pc);
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
    this.pcs?.forEach((pc) => {
      let s = HelperFunctions.logRange(0.1, 10, this.options.min, this.options.max, this.settings.pointSize);
      pc.setPointSize(s);
    });
  }

  setColor(): void {
    this.pcs?.forEach((pc) => {
      pc.setColor(this.settings.color);
    });
  }

  resetColor(): void {
    this.pcs?.forEach((pc) => {
      pc.resetColor();
    });
  }

}
