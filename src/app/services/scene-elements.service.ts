import { Injectable } from '@angular/core';
import { ViewerData } from "../components/pc-viewer/pc-viewer.interfaces";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, retry, Subject } from "rxjs";
import { Object3D } from "three";
import { BaseServiceService } from "./base-service.service";
import { TreeComponentsEnum } from "../components/base/base.component";

export interface ComponentTreeData {
}

export interface ComponentTree {
  component: TreeComponentsEnum,
  componentId: number,
  data: ComponentTreeData,
  children: ComponentTree[]
}

@Injectable({
  providedIn: 'root'
})
export class SceneElementsService extends BaseServiceService {

  viewerData: Map<number, ViewerData>; //set private/readonly?
  componentTree: ComponentTree[];
  viewerDataSubject: Subject<Map<number, ViewerData>>;

  constructor(private http: HttpClient) {
    super();
    this.viewerData = new Map<number, ViewerData>();
    this.componentTree = [];
    this.viewerDataSubject = new Subject<Map<number, ViewerData>>();
  }

  /**  Internal reference handling  **/

  addViewerData(data: ViewerData): void {
    this.viewerData.set(data.sceneId, data);
    this.viewerDataSubject.next(this.viewerData);
  }

  getViewerData(): Observable<Map<number, ViewerData>> {
    return this.viewerDataSubject;
  }

  /**
   * This function is necessary as we do not yet have a reference when we parse the component tree.
   * Once the 3DObject is available, it gets added here and the observable gets triggered.
   *
   * @param sceneId The id of the Scene/Viewer this object belongs to
   * @param elementId Id of the element.
   * @param element Object3D reference.
   */
  addSceneElement(sceneId: number, elementId: number, element: Object3D): void {
    let elems = this.viewerData.get(sceneId)?.elements;
    if (!elems) return;
    if (elementId < elems.length && elems[elementId] !== undefined) {
      elems[elementId].element = element;
    }
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

}
