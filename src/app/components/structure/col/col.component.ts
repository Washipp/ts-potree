import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from "../../base/base.component";
import { ComponentTreeData } from "../../../services/scene-elements.service";
import { ColWidthService } from "../../../services/col-width.service";

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

  colWidth = 25;

  constructor(private colWidthService: ColWidthService) {
    super();
  }

  override ngOnInit(): void {
    this.colWidthService.getSidebarWidth().subscribe(width => {
      if (this.data.width === 3)
        this.colWidth = width;
    });
  }

}
