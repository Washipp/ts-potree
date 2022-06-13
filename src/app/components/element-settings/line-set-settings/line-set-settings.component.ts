import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsService } from "../../../services/scene-elements.service";
import { LineSet } from "../../../elements/line-set";

@Component({
  selector: 'app-line-set-settings',
  templateUrl: './line-set-settings.component.html',
  styleUrls: ['./line-set-settings.component.css', '../element-settings.css']
})
export class LineSetSettingsComponent implements OnInit {

  color: string;

  lineSet: LineSet | undefined;

  private _data: any | undefined;
  @Input() set data(value: any) {
    this.lineSet = undefined;
    this.loadLineSet(value.sceneId, value.elementId, 0);
    this._data = value;
  }

  get data() {
    return this._data
  }

  constructor(private sceneElementsService: SceneElementsService) {
    this.color = '#000000'
  }

  private loadLineSet(sceneId: number, elementId: number, numberOfTries: number) {
    let promise = new Promise(resolve => setTimeout(resolve, 250));
    promise.then(() => {
      this.lineSet = this.sceneElementsService.getSceneElement(sceneId, elementId) as LineSet;
      if (this.lineSet === undefined && numberOfTries < this.sceneElementsService.maxTries) {
        // To copy the value and not the reference
        // TODO: maybe use a better solution
        let a: any = {numberOfTries};
        a.numberOfTries++;
        this.loadLineSet(sceneId, elementId, a);
      } else {
        this.color = '#' + this.lineSet.material.color.getHexString();
      }
    });
  }

  ngOnInit(): void {
  }

  setColor() {
    this.lineSet?.setColor(this.color);
  }

}
