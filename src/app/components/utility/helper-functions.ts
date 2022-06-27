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
