import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorHandlerClass } from '../../../../../exports/classes/ErrorHandlerClass';
import { IReportItem } from '../../../../../exports/interfaces/IReportItem';
import { ReportService } from '../../../../../services/report.service';
import { MessageService } from '../../../../../services/message.service';
import { CurrentUserType } from '../../../../../exports/types/CurrentUserType';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: '[data-app-wrap-report-page]',
  templateUrl: './wrap-report-page.component.html',
  styleUrls: ['./wrap-report-page.component.css']
})
export class WrapReportPageComponent implements OnInit {

  items: IReportItem[] = []
  user_id: number = 0
  
  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  color: string = ""
  id: number = 0

  form = new FormGroup({
    type: new FormControl<number>(0, [
      Validators.required
    ]),
    period: new FormControl<number>(0, [
      Validators.required
    ]),
  })
  
  constructor(
    private report$: ReportService,
    private message$: MessageService,
    private user$: UserService
  ) { 
    this.report$.reports.subscribe(items => {
      this.items = items
    })
    this.user$.user.subscribe((user: CurrentUserType) => {
      if(typeof user == "object" && user.hasOwnProperty('id')) {
        this.user_id = user.id
        //this.report$.getReports({user: this.user_id})
      }
    })
  }

  ngOnInit(): void {
  }

  save() {
    // this.formSubmit.next({})
    // this.errors.next({})
    // console.log('fieldsDefault', this.form)
    // if(!ErrorHandlerClass.AnyErrors(this.form)) {
    //   this.report$.addReport(this.form.value).subscribe(response => {
    //     this.message$.handle('Отчет успешно добавлен', 'success')
    //     this.report$.getReports({user: this.user_id})
    //   })
    // }
  }

}
