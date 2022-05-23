import { Injectable } from '@angular/core';
import { PointCloudOctree } from "@pnext/three-loader";
import { PCViewerElements } from "../components/parse/pc-viewer/pc-viewer.interfaces";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";
import { Viewer } from "../viewer/viewer";

export interface ComponentTree {
  component: string,
  data: any | PCViewerElements,
  children: ComponentTree[]
}

@Injectable({
  providedIn: 'root'
})
export class PcoService {

  baseUrl: string = 'http://127.0.0.1:5000/';

  private sceneElements: any[][];
  private pcViewer: Viewer[];

  constructor(private http: HttpClient) {
    this.sceneElements = [[]];
    this.pcViewer = [];
  }

  getSceneElement(sceneId: number, elementId: number): any {
    return this.sceneElements[sceneId][elementId];
  }

  addSceneElement(sceneId: number, elementId: number, pco: PointCloudOctree): void {
    this.sceneElements[sceneId][elementId] = pco;
  }

  getPcViewer(sceneId: number): Viewer {
    return this.pcViewer[sceneId];
  }

  addPcViewer(sceneId: number, viewer: Viewer): void {
    this.pcViewer[sceneId] = viewer;
  }

  getStructure(id: number): Observable<ComponentTree[]> {
    return this.http.get<ComponentTree[]>(this.baseUrl + 'component-tree/' + id).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
