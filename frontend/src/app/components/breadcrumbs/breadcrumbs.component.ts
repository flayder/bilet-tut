import { AfterViewInit, Component } from '@angular/core';
import { IBreadcrumbItem } from 'src/app/exports/interfaces/IBreadcrumbItem';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';

@Component({
  selector: 'div[data-app-breadcrumbs]',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements AfterViewInit {

  items: Array<IBreadcrumbItem> = this.breadcrumb$.getItems().getValue()

  constructor(
    private breadcrumb$: BreadcrumbService
  ) {
    breadcrumb$.getItems().subscribe((items: Array<IBreadcrumbItem>) => {
      this.items = items
    })
  }

  ngAfterViewInit(): void {
    
  }

  getItem(item: any, param: string = "") {
    if(typeof item == "object" && item.hasOwnProperty(param))
      return item[param]
    return ''
  }

  getKey(key: any) {
    return parseInt(key) + 1
  }

}
