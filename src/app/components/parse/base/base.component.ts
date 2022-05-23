import { Component, Input, OnInit } from '@angular/core';
import { ComponentTree } from "../../../services/pco.service";

export enum Components {
  ROW = "row",
  COL = "col",
  VIEWER = "viewer",
  BUTTON = "button",
  ELEMENT_SETTINGS = "element_settings",
  GENERAL_SETTINGS = "general_settings",
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  comp = Components; // used in template as ENUM
  @Input() children: ComponentTree[];
  @Input() data: any;

  constructor() {
    this.children = [];
  }

  ngOnInit(): void {
  }

  parseToEnum<T> (value: string): T | undefined {
    return (Object.values(Components) as unknown as string[]).includes(value)
      ? value as unknown as T
      : undefined;
  }

}
