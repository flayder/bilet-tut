import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'span[data-app-vk-auth]',
  templateUrl: './vk-auth.component.html',
  styleUrls: ['./vk-auth.component.css']
})
export class VkAuthComponent implements AfterViewInit {

  @ViewChild('script', {static: true}) script: ElementRef

  app_id = 51593329
  win: any = window

  constructor(
    private message$: MessageService,
    private user$: UserService,
    private router$: Router
  ) {}

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://vk.com/js/api/openapi.js?169'
    script.async = true
    element.parentElement.replaceChild(script, element)
      
  }

  ngAfterViewInit() {
    this.win.vkAsyncInit = () => {
      this.win.VK.init({
        apiId: this.app_id
      });
    }
    this.convertToScript()
  }

  login(event: any) {
    event.preventDefault()

    this.win.VK.Auth.login((settings: any) => {
      if(typeof settings == "object" && settings.status == "connected") {
        //console.log('settings.session', settings.session)
        const data = new FormData

        for(let i in settings.session) {
          data.append(i, settings.session[i])
        }
        
        this.user$.vkAuth(data).subscribe((response: IHttpResponse) => {
          if(response.results) {
            this.message$.handle("Вы успешно авторизовались", "success")
    
            localStorage.setItem('token', response.results)
            this.router$.navigateByUrl('account')
          }
        })
      } else {
        this.message$.handle('Неверные данные атворизации')
      }
    })
  }

}
