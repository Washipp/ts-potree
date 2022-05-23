import { Component } from '@angular/core';
import { ComponentTree, PcoService } from "./services/pco.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ts-potree';

  data: ComponentTree[];

  constructor(private service: PcoService) {
    this.data = [];
    service.getStructure(0).subscribe((data) => {
      this.data = data;
    });
  }
}
