import { Component, Input, OnInit } from '@angular/core';
import { LineSet } from "../../../elements/line-set";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";

@Component({
  selector: 'app-line-set-settings',
  templateUrl: './line-set-settings.component.html',
  styleUrls: ['./line-set-settings.component.css', '../element-settings.css']
})
export class LineSetSettingsComponent implements OnInit {

  color: string = '#000000';

  type: SceneElementsEnum = SceneElementsEnum.UNKNOWN;

  lineSets: LineSet[] | undefined;

  private _data: SceneElement[] | undefined;
  @Input() set data(sceneElements: SceneElement[]) {
    this._data = sceneElements;
    this.lineSets = [];
    sceneElements.forEach((sceneElement) => {
      let ls = sceneElement.element as LineSet;
      this.color = '#' + ls.material.color.getHexString()
      this.lineSets?.push(ls);
      this.type = sceneElement.sceneType;
    });
  }

  get data() {
    return this._data ? this._data : [];
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  setColor() {
    this.lineSets?.forEach((lineSet) => {
      lineSet.setColor(this.color);
    });
  }

}
