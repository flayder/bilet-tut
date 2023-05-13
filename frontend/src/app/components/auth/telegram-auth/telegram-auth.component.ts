import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import {Router} from '@angular/router'

@Component({
  selector: 'span[data-app-telegram-auth]',
  templateUrl: './telegram-auth.component.html',
  styleUrls: ['./telegram-auth.component.css']
})
export class TelegramAuthComponent implements AfterViewInit {

  @ViewChild('script', {static: true}) script: ElementRef

  telegramBotName = 'FlayderAuthBot'
  win: any = window

  constructor(
    private message$: MessageService,
    private user$: UserService,
    private router$: Router
  ) {}

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?5';
    script.setAttribute('data-telegram-login', this.telegramBotName)
    script.setAttribute('data-userpic', "false")
    script.setAttribute('data-size', 'large')
    // Callback function in global scope
    script.setAttribute('data-onauth', 'loginViaTelegram(user)')
    script.setAttribute('data-request-access', 'write')
    element.parentElement.replaceChild(script, element)
  }

  ngAfterViewInit() {
    this.win.loginViaTelegram = (user: any) => {}
    this.convertToScript()
  }

  // testData() {
  //   return {
  //     id: 365373627, 
  //     first_name: 'Art', 
  //     last_name: 'Lost', 
  //     username: 'flayder_lost', 
  //     photo_url: 'https://t.me/i/userpic/320/A9vGoqVSSK1P-U4QK6Dx2GyS7C5bwfkJ7k0MopQ0PIk.jpg',
  //     auth_date: 1679825495,
  //     hash: "0bb5ef8cac402167354407c81574753fc1bbb5f8516c5b4498f245c84dab07f0"
  //   }
  // }

  request(data: any) {
    const fields = new FormData

    for(let i in data) {
      fields.append(i, data[i])
    }

    this.user$.telegramAuth(fields).subscribe((response: IHttpResponse) => {
      if(response.results) {
        this.message$.handle("Вы успешно авторизовались", "success")

        localStorage.setItem('token', response.results)
        this.router$.navigateByUrl('account')
      }
    })
  }

  login(event: any) {
    event.preventDefault()

    this.win.Telegram.Login.auth(
      { bot_id: 6059948325, request_access: true },
      (data: any) => {
        if (!data) {
          this.message$.handle("Неверные данные авторизации")
          return
        }
    
        this.request(data)
      }
    )
  }

}
