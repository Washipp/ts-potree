import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SceneElement } from "../../scene/scene.interfaces";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  @Input() elementType: SceneElementsEnum;
  @Output() selectedElementEvent = new EventEmitter<SceneElement[]>();
  @Output() setVisibility = new EventEmitter<boolean>();

  @Input() elements: SceneElement[];
  @Input() visible: boolean = true;

  constructor() {
    this.elements = [];
    this.elementType = SceneElementsEnum.UNKNOWN;
  }

  ngOnInit(): void {
  }

  loadElementSettings() {
    this.selectedElementEvent.emit(this.elements);
  }

  setAllSceneElementsVisibility(visible: boolean): void {
    this.setVisibility.emit(visible);
  }


  getVisibility(): boolean {
    this.elements.forEach(elem => {
      let vis = elem.element?.getVisibility();
      if (vis === undefined) {
        return false;
      } else {
        return vis;
      }
    });
    return false;
  }

}
