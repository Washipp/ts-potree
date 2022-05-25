import {
  Color,
  Euler,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";
import { PointCloudOctree, Potree } from '@pnext/three-loader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SceneElementsService } from "../services/scene-elements.service";
import { LineSet } from "../elements/line-set";

export interface CameraState {
  position: Vector3,
  rotation: Euler,
  fov: number,
  near: number,
  far: number,
  lastUpdate: number,
}

export class Viewer {

  private targetEl: HTMLElement | undefined;

  private renderer = new WebGLRenderer();

  private scene = new Scene();

  public camera = new PerspectiveCamera(45, NaN, 0.1, 1000);

  private cameraControls = new OrbitControls(this.camera, this.renderer.domElement);

  private potree = new Potree();

  public pointClouds: PointCloudOctree[] = [];

  private reqAnimationFrameHandle: number | undefined;

  private currentCameraState: CameraState;

  constructor(private sceneElementsService: SceneElementsService) {
    this.currentCameraState = this.getCurrentCameraState(this.camera.clone());
  }

  /**
   * Initializes the viewer into the specified element.
   *
   * @param targetEl
   *    The element into which we should add the canvas where we will render the scene.
   */
  initialize(targetEl: HTMLElement): void {
    if (this.targetEl || !targetEl) {
      return;
    }

    this.targetEl = targetEl;
    this.targetEl.appendChild(this.renderer.domElement);

    // camera position is at (0,0,0) same as orbit controls, so we need to change it slightly.
    this.camera.position.z = 60
    this.camera.position.y = -10

    this.cameraControls.enableZoom = true;
    this.cameraControls.enableRotate = true;
    this.cameraControls.enableDamping = true;
    this.cameraControls.dampingFactor = 0.25;

    this.resize();
    window.addEventListener("resize", this.resize);

    requestAnimationFrame(this.loop);
  }

  /**
   * Performs any cleanup necessary to destroy/remove the viewer from the page.
   */
  destroy(): void {
    // @ts-ignore
    this.targetEl.removeChild(this.renderer.domElement);
    this.targetEl = undefined;
    window.removeEventListener("resize", this.resize);

    this.pointClouds.map(p => this.scene.remove(p));
    this.pointClouds = [];
    // TODO: clean point clouds or other objects added to the scene.


    if (this.reqAnimationFrameHandle !== undefined) {
      cancelAnimationFrame(this.reqAnimationFrameHandle);
    }
  }

  /**
   * Loads a point cloud into the viewer and returns it.
   *
   * @param fileName
   *    The name of the point cloud which is to be loaded.
   * @param baseUrl
   *    The url where the point cloud is located and from where we should load the octree nodes.
   */
  loadPotreePCO(fileName: string, baseUrl: string): Promise<PointCloudOctree> {
    return this.potree
      .loadPointCloud(fileName, url => `${baseUrl}${url}`)
      .then((pco: PointCloudOctree) => {
        // Add the point cloud to the scene and to our list of
        // point clouds. We will pass this list of point clouds to
        // potree to tell it to update them.

        this.scene.add(pco);
        this.pointClouds.push(pco);

        return pco;
      });
  }

  loadLineSet(lineSet: LineSet): void {
    lineSet.lines.forEach(line => {
      this.scene.add(line);
    });
  }

  /**
   * Updates the point clouds, cameras or any other objects which are in the scene.
   */
  update(): void {
    this.cameraControls.update();
    this.handleCameraState();
    this.potree.updatePointClouds(this.pointClouds, this.camera, this.renderer);
  }

  /**
   * Renders the scene into the canvas.
   */
  render(): void {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * The main loop of the viewer, called at 60FPS, if possible.
   */
  loop = (time: number): void => {
    this.reqAnimationFrameHandle = requestAnimationFrame(this.loop);
    this.update();
    this.render();
  };

  /**
   * Triggered anytime the window gets resized.
   */
  resize = () => {
    // @ts-ignore
    const {width, height} = this.targetEl.getBoundingClientRect();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  /**
   * Change the background to a new color.
   */
  changeBackground(): void {
    this.scene.background = new Color('#003631');
  }

  /**
   * Set the BoundingBox for all point clouds
   *
   * @param value showBoundingBox = value
   */
  setBoundingBox(value: boolean): void {
    this.pointClouds.forEach(pco => {
      pco.showBoundingBox = value;
    });
  }

  getCurrentCameraState(camera: PerspectiveCamera): CameraState {
    return {
      position: camera.position,
      rotation: camera.rotation,
      fov: camera.fov,
      near: camera.near,
      far: camera.far,
      lastUpdate: Date.now(),
    };
  }

  compareCameraState(firstState: CameraState, secondState: CameraState): boolean {
    return (
      firstState.position.equals(secondState.position) &&
      firstState.rotation.equals(secondState.rotation) &&
      firstState.fov == secondState.fov &&
      firstState.near == secondState.near &&
      firstState.far == secondState.far
    );
  }

  handleCameraState(): void {
    let oldState = this.currentCameraState;
    let newState = this.getCurrentCameraState(this.camera.clone());
    // 750ms as a threshold. Else to many requests are sent.
    // TODO: may create extra class?
    let updatedNeeded = Math.abs(oldState.lastUpdate - newState.lastUpdate) > 750;
    let same = this.compareCameraState(oldState, newState);
    if (!same && updatedNeeded) {
      console.log("UPDATING CAMERA");
      this.currentCameraState = newState;
      // this.sceneElementsService.sendCameraUpdate(this.currentCameraState, 0)
      //   .subscribe((ans) => console.log(ans));
    }
  }

  setCameraState(cameraState: CameraState): void {
    this.currentCameraState = cameraState;
    this.camera.position.set(cameraState.position.x, cameraState.position.y, cameraState.position.z);
    this.camera.rotation.set(cameraState.rotation.x, cameraState.rotation.y, cameraState.rotation.z);
    this.camera.fov = cameraState.fov;
    this.camera.near = cameraState.near;
    this.camera.far = cameraState.far;
  }
}
