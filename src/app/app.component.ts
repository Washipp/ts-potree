import { Component } from '@angular/core';
import { ComponentTree, SceneElementsService } from "./services/scene-elements.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ts-potree';

  data: ComponentTree[];

  constructor(private sceneElementsService: SceneElementsService) {
    this.data = [];
    sceneElementsService.getStructure(0).subscribe((data) => {
      this.data = data;
    });
  }
}
