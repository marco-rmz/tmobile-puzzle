
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subscription } from 'rxjs';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  private subs: Subscription
  from;
  to;
  today;
  error:any={isError:false,errorMessage:''};

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
      to: [null, Validators.required],
      from: [null, Validators.required]
    });

    this.stockPickerForm.controls['to'].setValue(this.to);
    this.stockPickerForm.controls['from'].setValue(this.from);
  }

  changeDate(type: string, event: MatDatepickerInputEvent<Date>) {

    this.to = this.stockPickerForm.controls['to'].value;
    this.from = this.stockPickerForm.controls['from'].value;

    if(this.to < this.from){
      this.stockPickerForm.controls['to'].setValue(null)
      this.error={isError:true,errorMessage:"End Date can't before start date"};
    }else{
      this.error = {isError:false,errorMessage:''}
    }


  }

  ngOnInit() {
    this.subs = this.stockPickerForm.valueChanges.subscribe(x => this.fetchQuote(this));
  }

  fetchQuote(value) {
    if (this.stockPickerForm.valid) {
      const { symbol } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, this.period);
    }
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
