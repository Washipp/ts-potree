import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'StringToUrlString'})
export class StringToUrlStringPipe implements PipeTransform {

  transform(value: string): any {
    let split = value.toString().split(',');
    let returnValue: string = '';
    split.forEach((s: string) => {
      returnValue += s + '/';
    })
    return returnValue;
  }

}
