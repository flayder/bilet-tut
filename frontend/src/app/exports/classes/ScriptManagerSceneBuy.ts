import { MessageService } from "src/app/services/message.service"
import { IEventPrice } from "../interfaces/IEventPrice"

declare var $: any

export class ScriptManagerSceneBuy {
  prices: number[] = []

  constructor(
    private $id: string,
    private getting: any
  ) {
  }

  getSub() {
    return this.getting
  }

  

}