import { Component } from '@angular/core';
import { ComponentTree, SceneElementsService } from "./services/scene-elements.service";
import { SynchronizeService } from "./services/synchronize.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ts-potree';

  data: ComponentTree[];

  constructor(private sceneElementsService: SceneElementsService, private service: SynchronizeService) {
    this.data = [];
    sceneElementsService.getComponentTree(0).subscribe((data) => {
      this.data = data;
    });
  }
}
