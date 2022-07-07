import {
  Color, Euler,
  PerspectiveCamera, PointsMaterial, Quaternion, Ray,
  Scene, Vector3,
  WebGLRenderer
} from "three";
import { PointCloudOctree, Potree } from '@pnext/three-loader';
import { SceneElementsService } from "../services/scene-elements.service";
import { LineSet } from "../elements/line-set";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { CameraTrajectory } from "../elements/camera-trajectory";
import { DefaultPointCloud } from "../elements/default-point-cloud";
import { WebSocketService } from "../services/web-socket.service";
import { HelperFunctions } from "../components/utility/helper-functions";
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls";

export interface CameraState {
  position: Vector3,
  rotation: Quaternion,
  fov: number,
  near: number,
  far: number,
  lastUpdate: number,
}

export interface MinifiedCameraState {
  position: number[],
  rotation: number[],
  fov: number,
  near: number,
  far: number,
  lastUpdate: number,
}

export class Viewer {

  private targetEl: HTMLElement | undefined;

  private renderer = new WebGLRenderer();

  private scene = new Scene();

  public camera = new PerspectiveCamera(45, 1, 0.1, 1000);

  private cameraControls = new ArcballControls(this.camera, this.renderer.domElement);

  private potree = new Potree();

  public pointClouds: PointCloudOctree[] = [];

  private reqAnimationFrameHandle: number | undefined;

  private currentCameraState: CameraState;

  private renderRequested = true;

  private lastRenderUpdate = 0;

  constructor(private sceneElementsService: SceneElementsService, private socket: WebSocketService) {
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

    if (this.camera.position.equals(new Vector3(0,0,0))) {
      // camera position is at (0,0,0) same as orbit controls, so we need to change it slightly.
      // else the camera cannot be controlled by mouse input.
      this.camera.position.z = 60
      this.camera.position.y = 10
    }

    this.cameraControls.enableZoom = true;
    this.cameraControls.enableRotate = true;
    this.cameraControls.dampingFactor = 0.25;
    this.cameraControls.enableAnimations = false;


    this.resize();
    window.addEventListener("resize", this.resize);

    this.cameraControls.addEventListener('change', () => this.renderRequested = true);

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

  /** Load SceneElements and add them to the scene. **/

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

  /**
   * Add camera-trajectory/camera-frustum to the scene by adding each line one-by-one.
   * Additionally add the mesh that contains the image.
   * @param ct trajectory to add.
   */
  loadCameraTrajectory(ct: CameraTrajectory): void {
    ct.cameraFrustums.forEach(frustum => {
      this.loadLineSet(frustum.lineSet);
      this.scene.add(frustum.mesh);
    });
    this.loadLineSet(ct.linkingLines);
  }

  /**
   * Add a line-set to the scene by adding each line separately.
   * @param lineSet Line-set to add
   */
  loadLineSet(lineSet: LineSet): void {
    lineSet.lines.forEach(line => {
      this.scene.add(line);
    });
  }

  /**
   * Loads a default point cloud recursively (.ply) and returns it.
   * @param url Url to download it from.
   */
  loadDefaultPC(url: string): Promise<DefaultPointCloud> {
    let loader = new PLYLoader();
    // TODO: add onProgress function.
    return loader.loadAsync(url).then(pc => {
      let pointCloud = new DefaultPointCloud(pc, new PointsMaterial({ vertexColors: true }));
      this.scene.add(pointCloud);
      return pointCloud;
    });

  }

  /**
   * Updates the point clouds, cameras or any other objects which are in the scene.
   */
  update(): void {
    this.cameraControls.update();
    this.potree.updatePointClouds(this.pointClouds, this.camera, this.renderer);
  }

  /**
   * Renders the scene into the canvas.
   */
  render(): void {
    this.renderRequested = false;
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * The main loop of the viewer, called at 60FPS, if possible.
   */
  loop = (time: number): void => {
    // either update if the camera controls have changed or if 250ms have passed.
    if (this.renderRequested || (this.lastRenderUpdate + 250 < time)) {
      this.render();
      this.lastRenderUpdate = time;
    }
    this.update();
    this.reqAnimationFrameHandle = requestAnimationFrame(this.loop);
  };

  /**
   * Triggered anytime the window gets resized.
   */
  resize = () => {
    if (!this.targetEl) return;
    const {width, height} = this.targetEl.getBoundingClientRect();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  /**
   * Change the background to a new color.
   */
  changeBackground(color: string): void {
    this.scene.background = new Color(color);
  }

  /**
   * Sets the point budget of the selected scene.
   * @param value New point budget value.
   */
  setPointBudget(value: number): void {
    this.potree.pointBudget = value;
  }

  /**
   * Set camera fov to the given value.
   * @param fov new FOV value
   */
  setCameraFOV(fov: number): void {
    this.camera.fov = fov;
  }

  pickPointTest(): void {
    let pc: PointCloudOctree;
    if  (this.pointClouds.length > 0) {
      pc = this.pointClouds[0];
    } else {
      return;
    }
    let ray = new Ray();

    let a = pc.pick(this.renderer, this.camera, ray);
    console.log(a);
    // if (a) {
      // let b = a.pointCloud;
      // if (b) {
      //   b.position.set(-15, -15, -15);
      //   b.scale.set(10, 10, 10);
      //   this.scene.add(b);
      // }
    // }

  }

  /**  Camera Handling  **/

  setCameraSync(value: boolean): void {
    if (value) {
      this.socket.connect();
      // Send update to server.
      let listener = () => {
        // TODO: may create extra class for the camera state
        this.currentCameraState = this.getCurrentCameraState(this.camera);
        this.socket.sendCameraState(0, HelperFunctions.fullToMinifiedCameraState(this.currentCameraState));
      };

      this.cameraControls.addEventListener('change', listener);

      // execute it once to set a state in the backend
      listener();

      // subscribe to the updates.
      this.socket.getMessage(WebSocketService.cameraSyncEvent).subscribe((message: MinifiedCameraState) => {
        this.setCameraState(HelperFunctions.minifiedToFullCameraState(message));
      });
    } else {
      this.socket.disconnect();
    }
  }

  getCurrentCameraState(camera: PerspectiveCamera): CameraState {
    let quat = new Quaternion()
    quat.setFromEuler(camera.rotation)
    return {
      position: camera.position as Vector3,
      rotation: quat,
      fov: camera.fov,
      near: camera.near,
      far: camera.far,
      lastUpdate: Date.now(),
    };
  }

  setCameraState(cameraState: CameraState): void {
    this.currentCameraState = cameraState;
    this.camera.position.set(cameraState.position.x, cameraState.position.y, cameraState.position.z);
    let euler = new Euler()
    euler.setFromQuaternion(cameraState.rotation);
    this.camera.rotation.set(euler.x, euler.y, euler.z, 'XZY');
    this.camera.fov = cameraState.fov;
    this.camera.near = cameraState.near;
    this.camera.far = cameraState.far;
  }
}
