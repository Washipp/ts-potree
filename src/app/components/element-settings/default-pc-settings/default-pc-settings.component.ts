import { Component, Input, OnInit } from '@angular/core';
import { PointColorType } from "@pnext/three-loader";
import { SceneElementsService } from "../../../services/scene-elements.service";
import { PcSettings } from "../pco-settings/pco-settings.component";
import { DefaultPointCloud } from "../../../elements/default-point-cloud";

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

  settings: PcSettings;
  pc: DefaultPointCloud | undefined;

  private _data: any | undefined;
  @Input() set data(value: any) {
    this.pc = undefined;
    this.loadPC(value.sceneId, value.elementId, 0);
    this._data = value;
  }

  get data() {
    return this._data
  }

  constructor(private sceneElementsService: SceneElementsService) {
    this.settings = {
      color: "#000000",
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
  private loadPC(sceneId: number, elementId: number, numberOfTries: number) {
    let promise = new Promise(resolve => setTimeout(resolve, 250));
    promise.then(() => {
        this.pc = this.sceneElementsService.getSceneElement(sceneId, elementId) as DefaultPointCloud;
        if (this.pc === undefined && numberOfTries < this.sceneElementsService.maxTries) {
          // To copy the value and not the reference
          // TODO: maybe use a better solution
          let a: any = {numberOfTries};
          a.numberOfTries++;
          this.loadPC(sceneId, elementId, a);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  setPointSize(): void {
    this.pc?.setPointSize(this.settings.pointSize);
  }

  setColor(): void {
    this.pc?.setColor(this.settings.color);
  }

  resetColor(): void {
    this.pc?.resetColor();
  }

}
