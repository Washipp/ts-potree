import { Component } from '@angular/core';
import { PcoService } from "./services/pco.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ts-potree';

  data: any[];

  constructor(private service: PcoService) {
    this.data = service.getStructure();
  }
}
