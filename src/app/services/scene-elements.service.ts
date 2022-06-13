import { Injectable } from '@angular/core';
import { SceneElement, ViewerData } from "../components/pc-viewer/pc-viewer.interfaces";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, retry } from "rxjs";
import { Viewer } from "../viewer/viewer";
import { Object3D } from "three";
import { BaseServiceService } from "./base-service.service";

export interface ComponentTree {
  component: string,
  componentId: number,
  data: any | ViewerData,
  children: ComponentTree[]
}

@Injectable({
  providedIn: 'root'
})
export class SceneElementsService extends BaseServiceService {

  private viewerData: ViewerData[];
  componentTree: ComponentTree[];

  constructor(private http: HttpClient) {
    super();
    this.viewerData = [];
    this.componentTree = [];
  }

  /**  Internal reference handling  **/

  addViewerData(data: ViewerData): void {
    this.viewerData[data.sceneId] = data;
  }

  getSceneElements(sceneId: number): SceneElement[] {
    return this.viewerData[sceneId]?.elements;
  }

  getSceneElement(sceneId: number, elementId: number): Object3D | undefined {
    let elems = this.getSceneElements(sceneId);
    if (elementId < elems.length && elems[elementId] !== undefined) {
      return elems[elementId].element;
    }
    return undefined;
  }

  /**
   * This function is necessary as we do not yet have a reference at parsing time.
   * Once the 3DObject is available, it gets added.
   *
   * @param sceneId The id of the Scene/Viewer this object belongs to
   * @param elementId Id of the element.
   * @param element Object3D reference.
   */
  addSceneElement(sceneId: number, elementId: number, element: Object3D): void {
    let elems = this.getSceneElements(sceneId);
    if (elementId < elems.length && elems[elementId] !== undefined) {
      elems[elementId].element = element;
    }
  }

  getPcViewer(sceneId: number): Viewer | undefined {
    return this.viewerData[sceneId].viewer;
  }

  /**  Calls to the server  **/

  getComponentTree(id: number): Observable<ComponentTree[]> {
    let observable =  this.http.get<ComponentTree[]>(this.baseUrl + 'component_tree/' + id).pipe(
      retry(3),
      catchError(this.handleError)
    );
    observable.subscribe((tree) => {
      this.componentTree = tree;
    });
    return observable;
  }

  parseJsonToComponentTree(tree: ComponentTree[]): ComponentTree[] {

    return [];
  }

}
