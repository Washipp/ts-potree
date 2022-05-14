import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { PointCloudOctree, Potree } from '@pnext/three-loader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class Viewer {

  private targetEl: HTMLElement | undefined;

  private renderer = new WebGLRenderer();

  private scene = new Scene();

  public camera = new PerspectiveCamera(45, NaN, 0.1, 1000);

  private cameraControls = new OrbitControls(this.camera, this.renderer.domElement);

  private potree = new Potree();

  public pointClouds: PointCloudOctree[] = [];

  private prevTime: number | undefined;

  private reqAnimationFrameHandle: number | undefined;

  private gl: any;

  private vertexShader = '';

  private fragmentShader = '';

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

    this.gl = this.renderer.getContext();

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
      .loadPointCloud(fileName, url => `${baseUrl}${url}`)
      .then((pco: PointCloudOctree) => {
        // Add the point cloud to the scene and to our list of
        // point clouds. We will pass this list of point clouds to
        // potree to tell it to update them.

        this.scene.add(pco);
        this.pointClouds.push(pco);

        this.vertexShader = pco.material.vertexShader;
        this.fragmentShader = pco.material.fragmentShader;

        return pco;
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
   * Call to change color of all loaded point clouds
   *
   * @param color
   *        color as hex string '#ff0000'
   */
  recolor(color: string): void {
    this.pointClouds.forEach(pco => {

      let frag = `
precision highp float;
precision highp int;

uniform vec3 uColor;

void main() {
  gl_FragColor = vec4(uColor, 1.0);
}
`;

      let vert = `
precision highp float;
precision highp int;

attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float size;

void main() {
    gl_PointSize = size;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;


      let size = pco.material.size;
      pco.material.vertexShader = pco.material.applyDefines(vert);
      pco.material.fragmentShader = pco.material.applyDefines(frag);
      pco.material.vertexColors = true;
      pco.material.uniforms.uColor.value.set(new Color(color));
      pco.material.uniforms.size.value = size;
      pco.material.needsUpdate = true;
    })
  }

  resetColor(): void {
    this.pointClouds.forEach(pco => {
      pco.material.vertexShader = this.vertexShader;
      pco.material.fragmentShader = this.fragmentShader;
      pco.material.needsUpdate = true;
    });
  }


  /**
   * Call to change size of points in all point clouds.
   *
   * @param size
   *        new size
   */
  pointResize(size: number): void {
    this.pointClouds.forEach(pco => {
      pco.material.size = size;
    });
  }

  /**
   * Call to toggle all point clouds on/off
   *
   */
  toggleVisibility(): void {
    this.pointClouds.forEach(pco => {
      pco.material.visible = !pco.material.visible;
    });
  }

  compileShader(shader: WebGLShader, source: string) {
    let gl = this.gl;

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      let info = gl.getShaderInfoLog(shader);
      let numberedSource = source.split("\n").map((a, i) => `${i + 1}`.padEnd(5) + a).join("\n");
      throw `could not compile shader : ${info}, \n${numberedSource}`;
    }
  }

}
