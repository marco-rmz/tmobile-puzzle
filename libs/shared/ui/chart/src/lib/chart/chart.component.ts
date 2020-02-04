import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data$: Observable<any>;
  @Input() startDate$;
  @Input() endDate$;
  chartData: any;
  chart: {
    title: string;
    type: string;
    data: any;
    columnNames: string[];
    options: any;
  };
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };

    this.data$.subscribe(newData => {
      let filterData = newData.filter((d)=> {
        const date = moment(d[0])
        return date.isSameOrAfter(moment(this.startDate$)) && date.isSameOrBefore(moment(this.endDate$))
      })
      return this.chartData = filterData
    });
  }
}
