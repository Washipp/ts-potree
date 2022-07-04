import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";
import { HelperFunctions } from "../../utility/helper-functions";
import { PotreePointCloud } from "../../../elements/potree-point-cloud";

export interface PcSettings {
  color: string;
  pointSize: number;
  boundingBox: boolean;
}

@Component({
  selector: 'app-pco-settings',
  templateUrl: './pco-settings.component.html',
  styleUrls: ['./pco-settings.component.css', '../element-settings.css']
})
export class PcoSettingsComponent implements OnInit {

  options: any = {
    min: 1,
    max: 20
  };

  settings: PcSettings = {
    color: "#000000",
    pointSize: 1,
    boundingBox: false
  }

  type: SceneElementsEnum = SceneElementsEnum.UNKNOWN;

  pcos: PotreePointCloud[] | undefined;

  private _data: SceneElement[] | undefined;
  @Input() set data(sceneElements: SceneElement[]) {
    this._data = sceneElements;
    this.pcos = [];
    sceneElements.forEach((sceneElement) => {
      let pco = sceneElement.element as PotreePointCloud;
      this.pcos?.push(pco);
      this.type = sceneElement.sceneType;
      this.settings.color = '#' + pco.getColor().getHexString()
    });

    // TODO: create a  PotreePointCloud Wrapper object --> doesnt really work because of references?
  }

  get data() {
    return this._data ? this._data : [];
  }

  constructor() {
  }


  ngOnInit(): void {
  }


  setPointSize(): void {
    this.pcos?.forEach((pco) => {
      let size = HelperFunctions.logRange(0.1, 10, this.options.min, this.options.max, this.settings.pointSize);
      pco.setPointSize(size);
    });
  }

  setColor(): void {
    this.pcos?.forEach((pco) => {
      pco.setColor(this.settings.color);
    });
  }

  resetColor(): void {
    this.pcos?.forEach((pco) => {
      pco.resetColor()
    });
  }

  setBoundingBox(): void {
    this.pcos?.forEach((pco) => {
      pco.setBoundingBox(this.settings.boundingBox);
    });
  }

}
