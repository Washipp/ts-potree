import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ColWidthService {

  private readonly sidebarWidth: Subject<number>;

  constructor() {
    this.sidebarWidth = new Subject<number>();
  }

  setNewSidebarWidth(width: number): void {
    this.sidebarWidth.next(width);
  }

  getSidebarWidth(): Observable<number>{
    return this.sidebarWidth;
  }

}
