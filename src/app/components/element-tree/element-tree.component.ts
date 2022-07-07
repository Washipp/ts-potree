import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { SceneElement } from "../pc-viewer/pc-viewer.interfaces";
import { ComponentTreeData } from "../../services/scene-elements.service";

export interface ElementTreeGroup {
  groupId: number,
  name: string,
  ids: number[],
  groups: ElementTreeGroup[],
  visible: boolean,
  sceneElements?: SceneElement[],
}

export interface ElementTreeData extends ComponentTreeData {
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

  selectedElement: SceneElement[];

  setSelectedElement(value: SceneElement[]) {
    // Check if the correct settings are already loaded
    if (this.selectedElement === value) {
      this.selectedElement = [];
    } else {
      // if not load the new ones.
      this.selectedElement = value;
    }
  }

  constructor() {
    this.sceneId = -1;
    this.selectedElement =  [];
    this.groups = [];
    this._data = {
      sceneId: -1,
      groups: [],
    }
  }

  ngOnInit(): void {
  }

}
