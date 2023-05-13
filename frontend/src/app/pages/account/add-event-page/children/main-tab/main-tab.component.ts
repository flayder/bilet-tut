import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { EVENT_DATA, EVENT_SUBJECT } from 'src/app/exports/constans';
import { SetEventLocalStorageData } from 'src/app/exports/functions/SetEventLocalStorageData';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-main-tab]',
  templateUrl: './main-tab.component.html',
  styleUrls: ['./main-tab.component.css']
})
export class MainTabComponent implements OnInit {

  @Output() tab = new EventEmitter

  user: IUserItem
  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()

  form = new FormGroup({
    status: new FormControl<number>(2, [
      Validators.required
    ]),
    genre: new FormControl([], [
      Validators.required
    ]),
    age: new FormControl<number>(0, [
      Validators.required
    ]),
    type: new FormControl([], [
      Validators.required
    ]),
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    tax: new FormControl<number>(0),
    description: new FormControl<string>(''),
    payment: new FormControl<number>(0, [
      Validators.required
    ]),
  })

  private init: boolean = false

  constructor(
    private user$: UserService
  ) { 
    this.user$.user.subscribe(user => {
      if(user && typeof user == "object")
        this.user = user
    })

    EVENT_DATA.subscribe((items: any) => {
      for(let field in items) {
        // if(field == 'type') {
        //   const arr: any = []
        //   items.type.map((i: any) => {
        //     if(i && typeof i == "object" && i.hasOwnProperty('id'))
        //       arr.push(i.id)
        //     else if(i > 0) {
        //       arr.push(i)
        //     }
        //   })
        //   items.type = arr
        // } 
        if(field == 'genre') {
          const arr: any = []
          items.genre.map((i: any) => {
            if(i && typeof i == "object" && i.hasOwnProperty('id'))
              arr.push(i.id)
            else if(i > 0) {
              arr.push(i)
            }
          })
          items.genre = arr
        }
      }
      this.defaultValue.next(items)
    })

    EVENT_SUBJECT.subscribe((items:any) => {
      if(this.init) {
        this.formSubmit.next({})
        for(let field in items) {
          const con = this.form.get(field)
          if(con && items[field] != con.getRawValue()) {
            con.setValue(items[field])
          }
        }
      }
    })

    for(let field in this.form.value) {
      const control = this.form.get(field)
      if(control) {
        control.valueChanges.subscribe(value => {
          if(value) {
            const obj: any = {}
            obj[field] = value
            //console.log(field, value)
            SetEventLocalStorageData(obj)
          }
        })
      }
    }

    //console.log('router$', router$)
  }

  ngOnInit(): void {
    this.init = true
  }

  isPayment() {
    const value = new Subject

    return value
  }

  setPayment(id: number) {
    this.form.controls.payment.setValue(id)
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      EVENT_SUBJECT.next({})
    }
  }
}