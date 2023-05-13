import { AfterContentInit, Component} from '@angular/core';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IRubricItem } from 'src/app/exports/interfaces/IRubricItem';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: '[data-app-main]',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterContentInit {

  rubrics: IRubricItem[] = []

  constructor(
    private design$: DesignService
  ) { }

  ngAfterContentInit(): void {
    this.design$.getRubrics().subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results))
        this.rubrics = response.results
    })
  }
}
