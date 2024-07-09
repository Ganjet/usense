import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from '../../model/currency.model';

@Component({
  selector: 'app-currency-converter-item',
  templateUrl: './currency-converter-item.component.html',
  styleUrl: './currency-converter-item.component.scss'
})
export class CurrencyConverterItemComponent {
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() dropdownControlName: string = '';
  @Input() inputControlName: string = '';
  @Input() options: Currency[] = [];
  @Output() inputChange = new EventEmitter<{ value: number, controlName: string }>();
  @Output() dropdownChange = new EventEmitter<{ originalEvent: Event, value: Currency }>();

  public onInputChange(value: number, controlName: string): void {
    this.inputChange.emit({ value, controlName });
  }

  public onDropdownChange(event: { originalEvent: Event, value: Currency }): void {
    this.dropdownChange.emit(event);
  }
}
