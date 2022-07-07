import { Component, Input, OnInit } from '@angular/core';
import { ComponentTree, ComponentTreeData } from "../../services/scene-elements.service";
import { HelperFunctions } from "../utility/helper-functions";
import { GeneralSettingsData } from "../scene-settings/scene-settings.component";
import { ViewerData } from "../scene/scene.interfaces";
import { ColData } from "../structure/col/col.component";
import { RowData } from "../structure/row/row.component";
import { ElementTreeData } from "../element-tree/element-tree.component";

export enum TreeComponentsEnum {
  ROW = "row",
  COL = "col",
  VIEWER = "viewer",
  BUTTON = "button",
  GENERAL_SETTINGS = "general_settings",
  ELEMENT_TREE = "element_tree",
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  comp = TreeComponentsEnum; // used in template as ENUM
  @Input() children: ComponentTree[];

  constructor() {
    this.children = [];
  }

  ngOnInit(): void {
  }

  toColData(data: ComponentTreeData): ColData {
    return data as ColData;
  }

  toRowData(data: ComponentTreeData): RowData {
    return data as RowData;
  }

  toGeneralSettingsData(data: ComponentTreeData): GeneralSettingsData {
    return data as GeneralSettingsData;
  }

  toViewerData(data: ComponentTreeData): ViewerData {
    return data as ViewerData;
  }

  toElementTreeData(data: ComponentTreeData): ElementTreeData {
    return data as ElementTreeData;
  }


  parseToEnum(type: string): TreeComponentsEnum | undefined {
    return HelperFunctions.enumFromStringValue(TreeComponentsEnum, type);
  }

}
