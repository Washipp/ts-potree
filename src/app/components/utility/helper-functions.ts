import { CameraState, MinifiedCameraState } from "../../viewer/viewer";
import { Quaternion, Vector3 } from "three";

export class HelperFunctions {
  static enumFromStringValue<T>(enm: { [s: string]: T }, value: string): T | undefined {
    return (Object.values(enm) as unknown as string[]).includes(value)
      ? value as unknown as T
      : undefined;
  }

  static minifiedToFullCameraState(minifiedState: MinifiedCameraState): CameraState {
    let pos = new Vector3()
    pos.fromArray(minifiedState.position)
    let rot = new Quaternion()
    rot.fromArray(minifiedState.rotation)
    return {
      position: pos,
      rotation: rot,
      fov: minifiedState.fov,
      near: minifiedState.near,
      far: minifiedState.far,
      lastUpdate: minifiedState.lastUpdate,
    }
  }

  static fullToMinifiedCameraState(fullState: CameraState): MinifiedCameraState {
    return {
      position: [fullState.position.x, fullState.position.y, fullState.position.z],
      rotation: [fullState.rotation.x, fullState.rotation.y, fullState.rotation.z, fullState.rotation.w],
      fov: fullState.fov,
      near: fullState.near,
      far: fullState.far,
      lastUpdate: fullState.lastUpdate,
    }
  }

  static urlToFullCameraState(data: any): CameraState {
    data = data.params;
    return {
      position: new Vector3(Number(data.p_x), Number(data.p_y), Number(data.p_z)),
      rotation: new Quaternion(Number(data.r_x), Number(data.r_y), Number(data.r_z), Number(data.r_w)),
      fov: Number(data.fov),
      near: Number(data.near),
      far: Number(data.far),
      lastUpdate: 0
    }
  }

  static cameraStateToUrlParams(fullState: CameraState): string {
    return `?p_x=${fullState.position.x}&
p_y=${fullState.position.y}&
p_z=${fullState.position.z}&
r_x=${fullState.rotation.x}&
r_y=${fullState.rotation.y}&
r_z=${fullState.rotation.z}&
r_w=${fullState.rotation.w}&
fov=${fullState.fov}&
near=${fullState.near}&
far=${fullState.far}`
  }

  /**
   * Computes a log value from a linear value range slider
   *
   * @param outputMin Lower bound of the interval of output values
   * @param outputMax Upper bound of the interval of output values
   * @param sliderMin integer low value
   * @param sliderMax integer highest value
   * @param value value that is in [sliderMin, sliderMax]
   */
  static logRange(outputMin: number, outputMax: number, sliderMin: number, sliderMax: number, value: number): number {
    let min = Math.log(outputMin);
    let max = Math.log(outputMax);

    let scale = (max - min) / (sliderMax - sliderMin);

    return Math.exp(min + scale*(value-sliderMin));

  }
}
