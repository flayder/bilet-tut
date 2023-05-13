import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';
import { CurrentUserType } from '../exports/types/CurrentUserType';
import { BilethttpService } from './bilethttp.service';
import { IUserCheckerItem } from '../exports/interfaces/ICheckerItem';
import { IUserItem } from '../exports/interfaces/IUserItem';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: CurrentUserType = false
  user = new Subject<CurrentUserType>()
  init: boolean = false
  checkers = new Subject<IUserCheckerItem[]>()

  constructor(
    private route$: Router,
    private http$: BilethttpService
  ) { 
    http$.getErrors().subscribe(errors => {
      this.init = false
    })
  }

  getErrors() {
    return this.http$.getErrors()
  }

  //Авторизация через телегу
  telegramAuth(data: {}) {
    return this.http$.post('/api/user/telegram_auth/', data)
  }

  //Авторизация через vk
  vkAuth(data: {}) {
    return this.http$.post('/api/user/vk_auth/', data)
  }

  //Сконфигурировать фамилию имя отчество пользователя
  getUserName(user: IUserItem) {
    let name = ''
    if(user?.surname || user?.username) {
      if(user?.surname) {
        name += user?.surname + ' '
      }

      if(user?.username) {
        name += user?.username
      }
    } else {
      if(user?.legal_first_name) {
        name += user?.legal_first_name + ' '
      }

      if(user?.legal_name) {
        name += user?.legal_name
      }
    }

    return name
  }

  //Проверить авторизацию текущего пользователя
  isAuth() {
    return !!this.currentUser
  }
  
  //Повторно получить данные текущего пользователя из базы
  reloadUser(strict = false) {
    if(!this.init) {
      this.init = true
      const token = localStorage.getItem('token')
      if(token) {
        if(!strict && this.currentUser && typeof this.currentUser == "object") {
          this.init = false
          setTimeout(() => {
            this.user.next(this.currentUser)
          }, 200);
        } else {
          this.http$.get("/api/user/current/")
            //.pipe(repeat(2))
            .subscribe((response: IHttpResponse) => {
              this.init = false
              this.currentUser = response.results
              this.user.next(response.results)
            })
        }
        
      } else {
        this.user.next(false)
        this.init = false
      }
    }
  }

  // private getData() {
  //   return this.currentUser
  // }

  //Добавить проверяющего
  addChecker(data: object, params = {}) {
    return this.http$.post('/api/user_checker/', data, params)
  }

  //Получить список данных проверяющих
  getCheckers(params = {}, id = null) {
    const response = this.http$.get('/api/user_checker/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.checkers.next(response.results)
    })

    return response
  }

  //Обновить проверяющего
  updateChecker(id: number, data = {}) {
    return this.http$.put(`/api/user_checker/${id}/`, data)
  }

  //Удалить проверяющего
  deleteChecker(id: number) {
    return this.http$.delete(`/api/user_checker/${id}/`)
  }

  //Получить конкретного провреяющего
  getChecker(id: number, params = {}) {
    return this.http$.get(`/api/user_checker/${id}/`, params)
  }

  //Отправить смс код
  sendSmsCode(id: number) {
    return this.http$.post(`/api/user/sms_code/${id}/`, {})
  }

  //Проверить смс
  checkSms(id: number, code: any) {
    const data = new FormData
    data.append('code', code)
    return this.http$.post(`/api/user/check_sms/${id}/`, data)
  }

  //Востановление пароля отправка нового пароля на почту
  recovery(data = {}) {
    return this.http$.post(`/api/user/password/recovery/`, data)
  }

  //Востановление пароля часть №2
  recoverySecond(data = {}) {
    return this.http$.post(`/api/user/password/recovery_second/`, data)
  }

  //Востановление пароля через телефон
  recoveryPhone(data = {}) {
    return this.http$.post(`/api/user/password/recovery_phone/`, data)
  }


  //admin
  admin = {
    //Получить список пользователей для админа
    getUser: (data = {}) => {
      return this.http$.get("/api/admin_user/", data)
    },
    //Получить данные конкретного пользователя для админа
    getUserDetail: (id: number, params = {}) => {
      return this.http$.get(`/api/user/get_user/${id}/`, params)
    },
    //Обновить данные конкретного пользователя для админа
    updateUser: (id: number, data = {}) => {
      return this.http$.put(`/api/user/admin_user_update/${id}/`, data)
    },
    //Удалить данные конкретного пользователя для админа
    deleteUser: (id: number) => {
      return this.http$.delete(`/api/admin_user/${id}/`)
    }
  }
}
