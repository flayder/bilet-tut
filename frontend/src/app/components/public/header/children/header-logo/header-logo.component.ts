import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'span[data-app-header-logo]',
  templateUrl: './header-logo.component.html',
  styleUrls: ['./header-logo.component.css']
})
export class HeaderLogoComponent implements OnInit {

  constructor(
    private router$: Router
  ) { }

  ngOnInit(): void {
  }

  home(event: any) {
    event.preventDefault()
    
    this.router$.navigateByUrl("/")
  }

}
