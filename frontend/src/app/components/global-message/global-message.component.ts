import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IMessage } from 'src/app/exports/interfaces/IMessage';
import { MessageService } from "../../services/message.service";

@Component({
  selector: 'div[data-app-global-message]',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GlobalMessageComponent implements OnInit {

  messages: Array<IMessage> = []

  constructor(
    public messageService: MessageService
  ) { 
    messageService.getMessage().subscribe(({message, type}) => {

      const str = RandomStringFunction()
      const messages = this.messages

      if(messages.filter(i => i.message == message && i.type == type).length == 0) {
        messages.push({
          key: str,
          message,
          type
        })

        this.messages = messages

        setTimeout(() => {
          this.close(str)
        }, 3000)
      }
    })
  }

  ngOnInit(): void {
    
  }

  close(key: string | undefined) {
    try {
      this.messages.map((mess, k) => {
        if(mess.key === key)
          this.messages.splice(k, 1)
      })
    } catch(e) {}
  }

}
