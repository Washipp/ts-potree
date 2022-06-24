import { Injectable } from '@angular/core';
import { BaseServiceService } from "./base-service.service";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { ComponentTree, SceneElementsService } from "./scene-elements.service";

// First array contains ids of the components as numbers
// Second array contains the keys/attributes as strings that are inside the data field.
// Third array holds the new value.
export type UpdateStructure = [number [], string [], any];

@Injectable({
  providedIn: 'root'
})
export class SynchronizeService extends BaseServiceService {

  constructor(private http: HttpClient, private sceneService: SceneElementsService) {
    super();
  }


  applyUpdate(): void {

    this.sceneService.getComponentTree(0).subscribe((tree) => {
      let cTree = this.sceneService.componentTree;
      this.getUpdate().subscribe((update: UpdateStructure) => {
        let componentArray = update[0];
        let elementArray = update[1];
        let updateArray = update[2];



        let comp = this.getComponent(cTree, componentArray);
        console.log("Components:")
        console.log(comp);
        let cam = this.getElement(comp?.data, elementArray);
        console.log("camera element:")
        console.log(cam);
      });
    });
  }

  private getElement(data: any, selectors: string[]): any {
    if (selectors.length === 0) return data;
    else {
      let selector = selectors.shift()
      if (selector === undefined) return;
      return this.getElement(data[selector], selectors);
    }

  }

  private getComponent(cTree: ComponentTree[], ids: number[]): ComponentTree | undefined {
    let id = ids.shift();
    if (id != undefined) {
      if (cTree[id].children.length === 0) {
        return cTree[id];
      } else {
        return this.getComponent(cTree[id].children, ids);
      }
    } else {
      console.error("Component not found!")
      return undefined;
    }
  }

  getUpdate(): Observable<UpdateStructure> {
    return this.http.get<UpdateStructure>(this.baseUrl + 'get_update/').pipe(
      catchError(this.handleError)
    );
  }

}
