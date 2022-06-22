import { Component, Input, OnInit } from '@angular/core';
import { PointCloudOctree, PointColorType } from "@pnext/three-loader";
import { Color } from "three";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";

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
    pointSize: 2,
    boundingBox: false
  }

  type: SceneElementsEnum = SceneElementsEnum.UNKNOWN;

  pcos: PointCloudOctree[] | undefined;

  private _data: SceneElement[] | undefined;
  @Input() set data(sceneElements: SceneElement[]) {
    this._data = sceneElements;
    this.pcos = [];
    sceneElements.forEach((sceneElement) => {
      this.pcos?.push(sceneElement.element as PointCloudOctree);
      this.type = sceneElement.sceneType;
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
      pco.material.size = this.settings.pointSize;
    });
  }

  setColor(): void {
    this.pcos?.forEach((pco) => {
      pco.material.pointColorType = PointColorType.COLOR;
      pco.material.uniforms.uColor.value.set(new Color(this.settings.color));
    });
  }

  resetColor(): void {
    this.pcos?.forEach((pco) => {
      pco.material.pointColorType = PointColorType.RGB;
    });
  }

  setBoundingBox(): void {
    this.pcos?.forEach((pco) => {
      pco.showBoundingBox = this.settings.boundingBox
    });
  }

}
