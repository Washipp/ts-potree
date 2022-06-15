import { Component, Input, OnInit } from '@angular/core';
import { ComponentTree } from "../../services/scene-elements.service";
import { HelperFunctions } from "../utility/helper-functions";

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
  @Input() data: any;

  constructor() {
    this.children = [];
  }

  ngOnInit(): void {
  }

  parseToEnum(type: string): TreeComponentsEnum | undefined {
    return HelperFunctions.enumFromStringValue(TreeComponentsEnum, type);
  }

}
