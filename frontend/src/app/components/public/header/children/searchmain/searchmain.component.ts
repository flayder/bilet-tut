import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'span[data-app-searchmain]',
  templateUrl: './searchmain.component.html',
  styleUrls: ['./searchmain.component.css']
})
export class SearchmainComponent implements OnInit {

  searching: any = ''

  constructor(
    private router$: Router
  ) { 
    const search = this.router$.getCurrentNavigation()?.extractedUrl.queryParamMap.get('search')
    if(search) {
      this.searching = search
    }
  }

  ngOnInit(): void {
  }

  getSearch(search: any) {
    this.searching = search.target.value
    if(search.key == "Enter") {
      this.search()
    }
  }

  search() {
    this.router$.navigate(['/search'], {
      queryParams: {
        search: this.searching
      }
    })
  }

}
