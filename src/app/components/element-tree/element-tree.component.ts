import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { SceneElement } from "../pc-viewer/pc-viewer.interfaces";
import { HelperFunctions } from "../utility/helper-functions";

export interface ElementTreeGroup {
  groupId: number,
  name: string,
  ids: number[],
  groups: ElementTreeGroup[],
  visible: boolean,
  sceneElements?: SceneElement[],
}

export interface ElementTreeData {
  sceneId: number,
  groups: ElementTreeGroup[]
}


@Component({
  selector: 'app-element-tree',
  templateUrl: './element-tree.component.html',
  styleUrls: ['./element-tree.component.css']
})
export class ElementTreeComponent implements OnInit {

  elem = SceneElementsEnum; // used in template to access ENUM

  private _data: ElementTreeData;

  sceneId: number;
  groups: ElementTreeGroup[];
  @Input() set data(value: ElementTreeData) {
    this.sceneId = value.sceneId;
    this.groups = value.groups;
    this._data = value;
  }

  get data() {
    return this._data;
  }

  selectedElement: [SceneElementsEnum, SceneElement[]];

  setSelectedElement(value: [SceneElementsEnum, SceneElement[]]) {
    // Check if the correct settings are already loaded
    if (this.selectedElement[0] === value[0] && this.selectedElement[1] === value[1]) return;

    // if not load the new ones.
    this.selectedElement = value;
  }

  constructor() {
    this.sceneId = -1;
    this.selectedElement = [SceneElementsEnum.UNKNOWN, []];
    this.groups = [];
    this._data = {
      sceneId: -1,
      groups: [],
    }
  }

  ngOnInit(): void {
  }


  parseToEnum(type: string): SceneElementsEnum | undefined {
    return HelperFunctions.enumFromStringValue(SceneElementsEnum, type);
  }

}
