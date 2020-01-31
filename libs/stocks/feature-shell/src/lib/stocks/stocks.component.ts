import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  from;
  to;
  today;

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.period = "max";
    this.today = new Date();
    let amonthago = new Date();
    amonthago.setMonth(amonthago.getMonth() - 1)
    this.to = this.today;
    this.from  = amonthago
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      to: [],
      from: []
    });
  }

  changeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    if(this.to.value < this.from.value){
      this.stockPickerForm.controls['to'].setValue(this.from.value)
      this.to = new FormControl(this.from.value)
    }
  }

  ngOnInit() {
    this.stockPickerForm.valueChanges.subscribe(x => this.fetchQuote(this));
  }

  fetchQuote(value) {
    if (this.stockPickerForm.valid) {
      const { symbol } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, this.period);
    }
  }
}
