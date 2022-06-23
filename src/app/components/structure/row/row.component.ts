import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from "../../base/base.component";
import { ComponentTreeData } from "../../../services/scene-elements.service";

export interface RowData extends ComponentTreeData {
    // empty, no data gets provided here.
}

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent extends BaseComponent implements OnInit {

  @Input() data: RowData = {};

  constructor() {
    super();
  }

  override ngOnInit(): void {
  }

}
