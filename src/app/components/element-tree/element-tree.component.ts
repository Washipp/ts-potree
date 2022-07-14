import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { SceneElement } from "../scene/scene.interfaces";
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

  hidden = false;

  @Input() data: ElementTreeData;

  selectedElement: SceneElement[];

  setSelectedElement(value: SceneElement[]) {
    // Check if the correct settings are already loaded, reset if this is the case.
    if (this.selectedElement === value) {
      this.selectedElement = [];
    } else {
      // if not load the new ones.
      this.selectedElement = value;
    }
  }

  constructor() {
    this.selectedElement =  [];
    this.data = {
      sceneId: -1,
      groups: [],
    }
  }

  ngOnInit(): void {
  }

}
