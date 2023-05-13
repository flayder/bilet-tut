export class ObjectHandler {
  static AddItem(obj: any, key: string, value: any) {
    obj[key] = value

    return obj
  }
  
  static RemoveItem(obj: any, key: string) {
    if(obj.hasOwnProperty(key)) {
      delete obj[key]
    }

    return obj
  }
}