import { Component, Input, OnInit } from '@angular/core';
import { Options } from "@angular-slider/ngx-slider";
import { PointCloudOctree, PointColorType } from "@pnext/three-loader";
import { Color } from "three";
import { PcoService } from "../../../services/pco.service";

export interface PcSettings {
  color: string;
  isVisible: boolean;
  colorType: PointColorType;
  pointSize: number;
}

@Component({
  selector: 'app-pc-settings',
  templateUrl: './pc-settings.component.html',
  styleUrls: ['./pc-settings.component.css']
})
export class PcSettingsComponent implements OnInit {

  options: Options = {
    floor: 1,
    ceil: 20
  };

  private maxTries: number = 10;
  settings: PcSettings;

  private _data: any | undefined;
  @Input() set data(value: any) {
    this.getPco(value.sceneId, value.elementId, 0);
  }

  get data() {
    return this._data
  }

  /**
   * Check every 250ms if the data/pcos are available.
   *
   * @param sceneId Scene which holds elements.
   * @param elementId The element that is targeted by the settings.
   * @param numberOfTries Current try number.
   */
  getPco(sceneId: number, elementId: number, numberOfTries: number) {
    let promise = new Promise(resolve => setTimeout(resolve, 250));
    promise.then(() => {
        this.pco = this.pcoService.getSceneElement(sceneId, elementId);
        if (this.pco === undefined && numberOfTries < this.maxTries) {
          this.getPco(sceneId, elementId, numberOfTries++);
        }
      }
    );
  }

  pco: PointCloudOctree | undefined;

  constructor(private pcoService: PcoService) {
    this.settings = {
      color: "#000000",
      isVisible: true,
      colorType: PointColorType.RGB,
      pointSize: 2,
    }
  }

  ngOnInit(): void {
  }


  /**
   * Call to change size of points in all point clouds.
   */
  setPointSize(): void {
    // @ts-ignore
    this.pco.material.size = this.settings.pointSize;
  }

  /**
   * Call to change color of all loaded point clouds
   */
  setColor(): void {
    this.settings.colorType = PointColorType.COLOR;
    // @ts-ignore
    this.pco.material.pointColorType = this.settings.colorType;
    // @ts-ignore
    this.pco.material.uniforms.uColor.value.set(new Color(this.settings.color));
  }

  /**
   * Reset the color by setting the initial vertex and fragment shaders.
   */
  resetColor(): void {
    this.settings.colorType = PointColorType.RGB;
    // @ts-ignore
    this.pco.material.pointColorType = this.settings.colorType;
  }

  /**
   * Call to toggle all point clouds on/off
   *
   */
  setVisibility(): void {
    // @ts-ignore
    let mat = this.pco.material;
    mat.visible = !mat.visible;
  }

}
