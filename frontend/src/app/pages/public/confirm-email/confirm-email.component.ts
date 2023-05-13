import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(
    private activate$: ActivatedRoute,
    private router$: Router,
    private account$: AccountService
  ) { 
    const params = this.activate$.snapshot.queryParams
    if(typeof params == "object" && params.user && params.user > 0 && params.activation_key) {
      const data = new FormData
      data.append('activation_key', params.activation_key)
      this.account$.getErrors().subscribe(errors => {
        this.router$.navigate([""])
      })
      this.account$.activateAccount(params.user, data).subscribe((response: IHttpResponse) => {
        
      })
    } else {
      this.router$.navigate([""])
    }
  }

  ngOnInit(): void {
  }

}
