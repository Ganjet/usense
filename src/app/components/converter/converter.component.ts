import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Currency, UKRAINE_CURRENCY } from '../../model/currency.model';
import { Subject, merge, takeUntil } from 'rxjs';
import { ExchangeService } from '../../service/exchange.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public currencyArray: Currency[] = [];
  public isLoading: boolean = true;

  private isUpdating = false;
  private firstConvert = 1;
  private secondConvert = 1;
  private usdRate?: Currency;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private exchangeService: ExchangeService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      firstDropdown: [''],
      secondDropdown: [''],
      value1: [10],
      value2: [1]
    });
  }

  ngOnInit(): void {
    this.exchangeService.getExchnages().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((mergedArray: Currency[]) => {
      this.currencyArray = mergedArray;
      this.currencyArray.push(UKRAINE_CURRENCY);
      this.usdRate = mergedArray.find(currency => currency.cc === 'USD');
      this.isLoading = false;

      this.form.patchValue({
        firstDropdown: this.usdRate,
        secondDropdown: UKRAINE_CURRENCY
      });
      this.updateConversionRates();
    });

    merge(
      this.form.get('firstDropdown')!.valueChanges,
      this.form.get('secondDropdown')!.valueChanges
    ).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => {
      this.updateConversionRates();
    });
  }

  public updateConversionRates(): void {
    const value = this.form.value;

    if (((value.firstDropdown && value.secondDropdown) || (value.value1 !== null && value.value1 !== '')) && this.usdRate) {
      this.firstConvert = (this.usdRate.rate / value.secondDropdown.rate) / (this.usdRate.rate / value.firstDropdown.rate);
      this.secondConvert = (this.usdRate.rate / value.firstDropdown.rate) / (this.usdRate.rate / value.secondDropdown.rate);

      this.onInputChange({ value: value.value1, controlName: 'value1' }, false);
    }
  }

  public onInputChange(event: { value: number, controlName: string }, emitEvent = true): void {
    if (this.isUpdating) return;
    this.isUpdating = true;

    const targetControlName = event.controlName === 'value1' ? 'value2' : 'value1';
    const conversionRate = event.controlName === 'value1' ? this.firstConvert : this.secondConvert;

    this.setControlValue(targetControlName, event.value * conversionRate, emitEvent);

    this.isUpdating = false;
  }


  private setControlValue(controlName: string, value: number, emitEvent: boolean): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value, { emitEvent });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

