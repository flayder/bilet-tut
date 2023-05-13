import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'withkey', pure: true})
export class WithKeyPipe implements PipeTransform {

    constructor() {}

    transform(arr: any) {
      const array: any[] = []
      arr.map((value: any, key: any) => {
          array.push({key, value})
      })

      return array
    }
}