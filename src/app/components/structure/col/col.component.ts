import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from "../../base/base.component";
import { ComponentTreeData } from "../../../services/scene-elements.service";

export interface ColData extends ComponentTreeData {
  width: number,
}

@Component({
  selector: 'app-col',
  templateUrl: './col.component.html',
  styleUrls: ['./col.component.css']
})
export class ColComponent extends BaseComponent implements OnInit {

  @Input() data: ColData = { width: 1 }

  constructor() {
    super();
  }

  override ngOnInit(): void {
  }

}
