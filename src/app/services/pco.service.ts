import { Injectable } from '@angular/core';
import { PointCloudOctree } from "@pnext/three-loader";

@Injectable({
  providedIn: 'root'
})
export class PcoService {

  constructor() {
  }

  getStructure(): any[] {
    return [
      {
        "component": "row",
        "data":
          {
            "id": 0,
          }
        ,
        "children": [
          {
            "component": "col",
            "data":
              {
                "id": 1,
                "width": 3,
              }
            ,
            "children": [
              {
                "component": "button",
                "data":
                  {
                    "id": 1.1,
                    "color": "color:red;",
                    "url": "http://localhost/something",
                  }
                ,
              }
            ]
          },
          {
            "component": "col",
            "data":
              {
                "id": 2,
                "width": 9,
              }
            ,
            "children": [ // viewer
              {
                "component": "viewer",
                "data": {
                  "id": 3,
                  "pcos": [
                    {
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
