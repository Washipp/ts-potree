import { Pipe, PipeTransform } from '@angular/core';
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";

@Pipe({name: 'enumToReadableString'})
export class EnumToReadableString implements PipeTransform {

  transform(value: SceneElementsEnum): any {
    let split = value.toString().split('_');
    let returnValue: string = '';
    split.forEach((s: string) => {
      returnValue += s[0].toUpperCase() + s.slice(1) + ' ';
    })
    return returnValue;
  }
}
