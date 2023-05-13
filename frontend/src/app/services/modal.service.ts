import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import { IModalTypeParams } from '../exports/interfaces/IModalTypeParams';
import { ModalType } from '../exports/types/ModalType';
import { ModalButtonClickType } from '../exports/types/ModalButtonClickType';

//Сервис для работы с модальными окнами

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  isType$ = new BehaviorSubject<Array<ModalType>>([])
  params: Array<IModalTypeParams> = []
  accountPrice = new Subject
  buttonClick = new Subject<ModalButtonClickType>()

  constructor() { }

  //Получить данные типа окна
  private getValue() {
    return this.isType$.getValue()
  }

  //Проверить есть нужный тип модального окна
  private getKey(type: ModalType) {
    return this.getValue().indexOf(type)
  }

  //Открыть или закрыть модальное окно
  toggle(type: ModalType, params: object = {}) {
    const values = this.getValue()
    const key = this.getKey(type)
    if(key != -1) {
      values.splice(key, 1)
      this.params.splice(key, 1)
    } else {
      values.push(type)
      this.params.push({
        type,
        params
      })
    }

    this.isType$.next(values)
  }

  //Открыть модальное окно
  open(type: ModalType, params: object = {}) {
    const values = this.getValue()
    const key = this.getKey(type)
    if(key == -1) {
      values.push(type)
      this.params.push({
        type,
        params
      })
      this.isType$.next(values)
    }
  }

  //Закрыть модальное окно
  close(type: ModalType) {
    const values = this.getValue()
    const key = this.getKey(type)
    if(key != -1) {
      values.splice(key, 1)
      this.params.splice(key, 1)
      this.isType$.next(values)
    }
  }
}
