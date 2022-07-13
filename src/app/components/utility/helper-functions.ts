import { CameraState } from "../../viewer/viewer";

export class HelperFunctions {
  static enumFromStringValue<T>(enm: { [s: string]: T }, value: string): T | undefined {
    return (Object.values(enm) as unknown as string[]).includes(value)
      ? value as unknown as T
      : undefined;
  }

  static urlToCameraState(data: any): CameraState {
    return {
      position: data.position.split(','),
      quaternion: data.quaternion.split(','),
      up: data.up.split(','),
      zoom: Number(data.zoom),
      fov: Number(data.fov),
      near: Number(data.near),
      far: Number(data.far),
      lastUpdate: 0
    };
  }

  static cameraStateToUrlParams(state: CameraState): string {
    return `?&position=${state.position}
&quaternion=${state.quaternion}
&fov=${state.fov}
&zoom=${state.zoom}
&up=${state.up}
&near=${state.near}
&far=${state.far}`
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
