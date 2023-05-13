import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import { IMessage } from '../exports/interfaces/IMessage';

//Сервис для работы с всплывающими сообщениями

type MessageType = "error" | "success" | "warning"

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  message$ = new Subject<IMessage>()

  constructor() { }

  //Запушить сообщение в трей
  handle(message: string, type: MessageType = "error") {
    const mess = {
      message,
      type
    }
    this.message$.next(mess)
  }

  //Отчистить сообщение
  clear() {
    this.message$.next({message: '', type: ''})
  }

  //Получить сообщение из трея
  getMessage() {
    return this.message$
  }
}
