import { Component, Input, OnInit } from '@angular/core';
import { ElementSetting } from "./element-setting";
import { SceneElement } from "../scene/scene.interfaces";
import { HelperFunctions } from "../utility/helper-functions";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { PointShape } from "@pnext/three-loader";
import { SceneElementsService } from "../../services/scene-elements.service";
import { Viewer } from "../../viewer/viewer";

@Component({
  selector: 'app-element-setting',
  templateUrl: './element-setting.component.html',
  styleUrls: ['./element-setting.component.css']
})
export class ElementSettingComponent implements OnInit {

  options: any = {
    min: 1,
    max: 20
  };

  ps = PointShape;

  settings = {
    frustumSize: 3,
    color: '#000000',
    meshVisible: false,
    lineWidth: 2,
    pointSize: 1,
    opacity: 1,
    boundingBox: false,
    EDL: false,
    pointShape: PointShape.SQUARE,
  }

  type = SceneElementsEnum.UNKNOWN;
  viewer: Viewer | undefined;

  sceneElement: ElementSetting[] | undefined;

  private _data: SceneElement[] | undefined;
  @Input() set data(sceneElements: SceneElement[]) {
    this._data = sceneElements;

    this.sceneElement = [];
    this._data?.forEach((sceneElement) => {
      let elem = sceneElement.element as ElementSetting;
      this.type = sceneElement.sceneType;
      this.settings.color = '#' + elem.getColor().getHexString()
      this.sceneElement?.push(elem);
    });

    this.loadViewer();
  }

  get data() {
    return this._data ? this._data : [];
  }

  constructor(private sceneElementsService: SceneElementsService) { }

  ngOnInit(): void {
  }

  setColor() {
    this.sceneElement?.forEach((elem) => {
      elem.setColor(this.settings.color);
    });
    this.viewer?.requestRender();
  }

  setFrustumSize() {
    let s = HelperFunctions.logRange(0.1, 1.5, this.options.min, this.options.max, this.settings.frustumSize);
    this.sceneElement?.forEach((elem) => {
      if (elem['setFrustumSize']) elem.setFrustumSize(s);
    });
    this.viewer?.requestRender();
  }

  setMeshVisibility(): void {
    this.sceneElement?.forEach((elem) => {
      if (elem['setMeshVisibility']) elem.setMeshVisibility(this.settings.meshVisible);
    });
    this.viewer?.requestRender();
  }

  setLineWidth(): void {
    this.sceneElement?.forEach((elem) => {
      if (elem['setLineWidth']) elem.setLineWidth(this.settings.lineWidth / 1000);
    });
    this.viewer?.requestRender();
  }

  setOpacity(): void {
    this.sceneElement?.forEach((elem) => {
      elem.setOpacity(this.settings.opacity);
    });
    this.viewer?.requestRender();
  }

  resetColor(): void {
    this.sceneElement?.forEach((elem) => {
      if (elem['resetColor']) elem.resetColor();
    });
    this.viewer?.requestRender();
  }

  setPointSize(): void {
    this.sceneElement?.forEach((elem) => {
      if (elem['setPointSize']) elem.setPointSize(this.settings.pointSize);
    });
    this.viewer?.requestRender();
  }

  setBoundingBox(): void {
    this.sceneElement?.forEach((elem) => {
      if (elem['setBoundingBox']) elem.setBoundingBox(this.settings.boundingBox);
    });
    this.viewer?.requestRender();
  }

  setEDL(): void {
    this.sceneElement?.forEach((elem) => {
      if (elem['setEDL']) elem.setEDL(this.settings.EDL);
    });
    this.viewer?.requestRender();
  }

  setPointShape(shape: PointShape): void {
    this.settings.pointShape = shape;
    this.sceneElement?.forEach((elem) => {
      if (elem['setPointShape']) elem.setPointShape(this.settings.pointShape);
    });
    this.viewer?.requestRender();
  }

  private loadViewer() {
    this.sceneElementsService.getViewerData().subscribe(data => {
      // TODO: change key to be dynamic by passing the sceneId.
      if (data.has(0)) {
        setTimeout(() => {
          this.viewer = data.get(0)?.viewer;
        });
      }
    });
  }

}
