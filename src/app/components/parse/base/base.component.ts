import { Component, Input, OnInit } from '@angular/core';

export enum Components {
  ROW = "row",
  COL = "col",
  VIEWER = "viewer",
  BUTTON = "button",
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  comp = Components;
  @Input() children: any[];
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
