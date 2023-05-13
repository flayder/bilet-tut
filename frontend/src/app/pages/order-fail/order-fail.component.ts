import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-fail',
  templateUrl: './order-fail.component.html',
  styleUrls: ['./order-fail.component.css']
})
export class OrderFailComponent implements OnInit {

  id: any = false

  constructor(
    private activate$: ActivatedRoute,
    private router$: Router
  ) { 
    const params = this.activate$.snapshot.queryParams
    
    if(typeof params == "object" && params.orderNumber) {
      this.id = params.orderNumber
    } else {
      this.router$.navigate([""])
    }
  }

  ngOnInit(): void {
  }

}
