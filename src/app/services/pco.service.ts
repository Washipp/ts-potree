import { Injectable } from '@angular/core';
import { PointCloudOctree } from "@pnext/three-loader";

@Injectable({
  providedIn: 'root'
})
export class PcoService {

  private sceneElements: any[][];

  constructor() {
    this.sceneElements = [[]];
  }

  getSceneElement(sceneId: number, elementId: number): any {
    return this.sceneElements[sceneId][elementId];
  }

  addSceneElement(sceneId: number, elementId: number, pco: PointCloudOctree): any {
    this.sceneElements[sceneId][elementId] = pco;
  }

  getStructure(): any[] {
    return [
      {
        "component": "row",
        "data":
          {"id": 0,},
        "children": [
          {
            "component": "col",
            "data":
              {
                "id": 1,
                "width": 3,
              },
            "children": [
              {
                "component": "general_settings",
                "data":
                  {},
              },
              {
                "component": "element_settings",
                "data":
                  {
                    "sceneId": 0,
                    "elementId": 0,
                  }
              },
              {
                "component": "element_settings",
                "data":
                  {
                    "sceneId": 0,
                    "elementId": 1,
                  }
              }
            ]
          },
          {
            "component": "col",
            "data":
              {
                "id": 2,
                "width": 9,
              },
            "children": [ // viewer
              {
                "component": "viewer",
                "data": {
                  "sceneId": 0,
                  "pcos": [
                    {
                      "elementId": 0,
                      "url": "http://127.0.0.1:5000/data/lion_takanawa/",
                      "callback": (pco: PointCloudOctree) => {
                        pco.name = "Lion 1"

                        pco.material.size = 2;
                        pco.position.set(15, 0, 0);
                        pco.scale.set(10, 10, 10);
                        pco.translateX(-1);
                        pco.rotateX(-Math.PI / 2);
                      },
                    },
                    {
                      "elementId": 1,
                      "url": "http://127.0.0.1:5000/data/lion_takanawa/",
                      "callback": (pco: PointCloudOctree) => {
                        pco.name = "Lion 2"
                        pco.material.size = 2;
                        pco.position.set(-15, 0, 0);
                        pco.scale.set(10, 10, 10);
                        pco.translateX(-1);
                        pco.rotateX(-Math.PI / 2);
                      },
                    }
                  ]
                }
              }
            ]
          },
        ]
      }
    ];
  }
}
