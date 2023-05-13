import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {throwError, ObservableInput, Subject} from "rxjs";
import {catchError} from "rxjs/operators";
import {IErrorResponse} from "../exports/interfaces/IErrorResponse";
import {HTTP_PROTOCOL, SITE_URL} from "../exports/constans";
import { MessageService } from './message.service';

//Общий сервис для обработки данных с сайтом по API
@Injectable({
  providedIn: 'root',
})

export class BilethttpService{
  constructor(
    private http: HttpClient,
    private router: Router,
    private message: MessageService
  ) {}

  errors: Subject<IErrorResponse> = new Subject()

  //Обработчик ошибок с сайта и вывод ошибок
  processErrors(errorMessage: any) {
    let error = errorMessage
    if(typeof errorMessage === "object" && errorMessage.hasOwnProperty('error')) {
      error = error.error
    }
    if(
      typeof error === "object" &&
      !Array.isArray(error)
    ) {
      
      for(let err in error) {
        if(Array.isArray(error[err])) {
          error[err].map((item: any) => {
            if(typeof item == 'string')
              this.message.handle(item)
            else
              this.processErrors(item)
          })
        } else {
          if(typeof error[err] == 'string')
            this.message.handle(error[err])
          else
            this.processErrors(error[err])
        }
      }
    } else if(
      typeof error === "object" &&
      Array.isArray(error)
    ) {
      error.map((item: any) => {
        if(typeof item == 'string')
          this.message.handle(item)
        else
          this.processErrors(item)
      })
      
    }
  }

  //Обработчик ошибок №2
  throwError(error: any) :ObservableInput<any> {
    this.processErrors(error)
    this.errors.next(error)
    if(error.status === 401 && error.statusText === "Unauthorized") {
      //console.log('this.router.url', this.router.url)
      if(this.router.url != '/auth')
        localStorage.setItem('previousRoute', this.router.url)
      console.log('http prev')
      this.router.navigate(['/auth'])
      localStorage.setItem('token', '')
    }
    return throwError(error)
  }

  //Подставление токена в шапку запроса для работы с API для атворизированного пользователя
  createAuthorizationHeader(headers: HttpHeaders) {
    const token = localStorage.getItem('token')
    return headers.append('Authorization', `Token ${token}`)
  }

  getErrors() {
    return this.errors
  }

  //Метод GET
  get(url: string, params :any = {}) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.get(`${HTTP_PROTOCOL}${SITE_URL}${url}`, {
      headers,
      params: new HttpParams({
        fromObject: params
      })
    })
      .pipe(
        catchError((error :IErrorResponse) :ObservableInput<any> => {
          return this.throwError(error)
        })
      )
  }

  //Метод POST
  post(url: string, data: object, params: any = {}) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.post(`${HTTP_PROTOCOL}${SITE_URL}${url}`, data, {
      headers,
      params: new HttpParams({
        fromObject: params
      })
    })
      .pipe(
        catchError((error :IErrorResponse) :ObservableInput<any> => {
          return this.throwError(error)
        })
      )
  }

  //Метод DELETE
  delete(url: string, params = {}) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.delete(`${HTTP_PROTOCOL}${SITE_URL}${url}`, {
      headers,
      params: new HttpParams({
        fromObject: params
      })
    })
      .pipe(
        catchError((error :IErrorResponse) :ObservableInput<any> => {
          return this.throwError(error)
        })
      )
  }

  //Метод PUT
  put(url: string, params = {}) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.put(`${HTTP_PROTOCOL}${SITE_URL}${url}`, params, {
      headers,
    })
      .pipe(
        catchError((error :IErrorResponse) :ObservableInput<any> => {
          return this.throwError(error)
        })
      )
  }
}
