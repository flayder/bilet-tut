import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import { BreadcrumbService } from './services/breadcrumb.service';

@Component({
  selector: 'div[data-app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'Bilet';

  loading = false;

  constructor(
    private router: Router,
    private breadcrumb$: BreadcrumbService
  ) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          // const breadcrumbs = this.breadcrumb$.items.getValue()
          // if(breadcrumbs.length > 0)
          //   this.breadcrumb$.items.next([breadcrumbs[0]])
          break;
        }

        case event instanceof NavigationEnd: {
          setTimeout(() => {
            this.loading = false
          }, 500)
          window.scrollTo(0, 0)
          break;
        }
        case event instanceof NavigationCancel: {
          //console.log('NavigationCancel')
          break;
        }
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit() {

  }
}
