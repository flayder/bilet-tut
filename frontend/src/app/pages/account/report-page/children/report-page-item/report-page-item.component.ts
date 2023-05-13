import { Component, OnInit, Input } from '@angular/core';
import { IReportItem } from '../../../../../exports/interfaces/IReportItem';
import { MessageService } from '../../../../../services/message.service';
import { ReportService } from '../../../../../services/report.service';

@Component({
  selector: 'tr[data-app-report-page-item]',
  templateUrl: './report-page-item.component.html',
  styleUrls: ['./report-page-item.component.css']
})
export class ReportPageItemComponent implements OnInit {
  
  @Input() item: IReportItem

  constructor(
    private message$: MessageService,
    private report$: ReportService
  ) { }

  ngOnInit(): void {
  }

  toActivate(event: any) {
    this.report$.updateReport(this.item.id, {active: event.target.checked}).subscribe(response => {
      this.message$.handle("Отчет успешно изменен", "success")
    })
  }

}
