import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  PointsMaterial,
  Texture,
  DataTexture,
  RGBAFormat, NearestFilter
} from "three";
import { PointCloudMaterial, PointCloudOctree, Potree } from '@pnext/three-loader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointColorType } from "@pnext/three-loader/src/materials/enums";
import { generateDataTexture } from "@pnext/three-loader/src/materials/texture-generation";
export class Viewer {

  private targetEl: HTMLElement | undefined;

  private renderer = new WebGLRenderer();

  private scene = new Scene();

  private camera = new PerspectiveCamera(45, NaN, 0.1, 1000);

  private cameraControls = new OrbitControls(this.camera, this.renderer.domElement);

  private potree = new Potree();

  private pointClouds: PointCloudOctree[] = [];

  private prevTime: number | undefined;

  private reqAnimationFrameHandle: number | undefined;

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
    this.camera.position.z = 10

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

    this.pointClouds = [];
    // TODO: clean point clouds or other objects added to the scene.

    if (this.reqAnimationFrameHandle !== undefined) {
      cancelAnimationFrame(this.reqAnimationFrameHandle);
    }
  }


  generateDataTexture(width: number, height: number, color: Color): Texture {
    const size = width * height;
    const data = new Uint8Array(4 * size);

    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    for (let i = 0; i < size; i++) {
      data[i * 3] = r;
      data[i * 3 + 1] = g;
      data[i * 3 + 2] = b;
    }

    const texture = new DataTexture(data, width, height, RGBAFormat);
    texture.needsUpdate = true;
    texture.magFilter = NearestFilter;

    return texture;
  }



  /**
   * Loads a point cloud into the viewer and returns it.
   *
   * @param fileName
   *    The name of the point cloud which is to be loaded.
   * @param baseUrl
   *    The url where the point cloud is located and from where we should load the octree nodes.
   */
  load(fileName: string, baseUrl: string): Promise<PointCloudOctree> {
    return this.potree
      .loadPointCloud(fileName,url => `${baseUrl}${url}`)
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
   * Updates the point clouds, cameras or any other objects which are in the scene.
   *
   * @param dt
   *    The time, in milliseconds, since the last update.
   */
  update(dt: number): void {
    this.cameraControls.update();

    // This is where most of the potree magic happens. It updates the
    // visiblily of the octree nodes based on the camera frustum and it
    // triggers any loads/unloads which are necessary to keep the number
    // of visible points in check.
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

    const prevTime = this.prevTime;
    this.prevTime = time;
    if (prevTime === undefined) {
      return;
    }

    this.update(time - prevTime);
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

  recolor(color: string): void {
    this.pointClouds.forEach(pco => {
      // pco.material.setUniform('visibleNodes', this.generateDataTexture(2048, 4, new Color(color)));
      pco.material.vertexColors = true;
      // pco.material.colorWrite = true;
      pco.material.color = new Color(color);
      pco.material.enablePointHighlighting = true;
      pco.material.weightRGB = 255;

      pco.material.updateMaterial(pco, pco.visibleNodes, this.camera, this.renderer);
      pco.material.needsUpdate = true;
    })
  }

  pointResize(size:number): void {
    this.pointClouds.forEach(pco => {
      pco.material.size = size;
    });
  }

  changeVisibility(visible: boolean): void {
    this.pointClouds.forEach(pco => {
      pco.material.visible = visible;
    });
  }
}
