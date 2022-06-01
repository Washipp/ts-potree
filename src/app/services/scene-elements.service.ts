import { Injectable } from '@angular/core';
import { SceneElement, ViewerData } from "../components/pc-viewer/pc-viewer.interfaces";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, retry } from "rxjs";
import { CameraState, Viewer } from "../viewer/viewer";
import { Object3D } from "three";
import { BaseServiceService } from "./base-service.service";

export interface ComponentTree {
  component: string,
  data: any | ViewerData,
  children: ComponentTree[]
}

@Injectable({
  providedIn: 'root'
})
export class SceneElementsService extends BaseServiceService {

  readonly maxTries: number = 10;

  private viewerData: ViewerData[];

  constructor(private http: HttpClient) {
    super();
    this.viewerData = [];
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

  getCameraUpdate(id: number, timeStamp: number): Observable<CameraState> {
    return this.http.get<CameraState>(this.baseUrl + 'camera_state/' + id + '/' + timeStamp).pipe(
      catchError(this.handleError)
    );
  }

  sendCameraUpdate(state: CameraState, id: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'camera_state/' + id, {state: (state)}).pipe(
      map(ans => {
        return ans;
      }),
      catchError(this.handleError)
    );
  }


  getComponentTree(id: number): Observable<ComponentTree[]> {
    return this.http.get<ComponentTree[]>(this.baseUrl + 'component-tree/' + id).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

}
