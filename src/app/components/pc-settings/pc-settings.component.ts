import { Component, Input, OnInit } from '@angular/core';
import { PointCloudOctree, PointColorType } from "@pnext/three-loader";
import { Color } from "three";
import { SceneElementsService } from "../../services/scene-elements.service";

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

  options: any = {
    min: 1,
    max: 20
  };

  settings: PcSettings;
  pco: PointCloudOctree | undefined;

  private _data: any | undefined;
  @Input() set data(value: any) {
    this.getPco(value.sceneId, value.elementId, 0);
    this._data = value;
  }

  get data() {
    return this._data
  }

  constructor(private sceneElementsService: SceneElementsService) {
    this.settings = {
      color: "#000000",
      isVisible: true,
      colorType: PointColorType.RGB,
      pointSize: 2,
    }
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
        this.pco = this.sceneElementsService.getSceneElement(sceneId, elementId) as PointCloudOctree;
        if (this.pco === undefined && numberOfTries < this.sceneElementsService.maxTries) {
          // To copy the value and not the reference
          // TODO: maybe use a better solution
          let a: any = {numberOfTries};
          a.numberOfTries++;
          this.getPco(sceneId, elementId, a);
        }
      }
    );
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
  setBoundingBox(value: any): void {
    if (this.pco) {
      this.pco.showBoundingBox = value.checked;
    }
  }

}
