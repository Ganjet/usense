import { Component, OnDestroy, OnInit } from '@angular/core';
import { Currency } from '../../model/currency.model';
import { Subject, takeUntil } from 'rxjs';
import { ExchangeService } from '../../service/exchange.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  public usdRate?: Currency;
  public eurRate?: Currency;
  public isLoading = true;

  private ngUnsubscribe = new Subject<void>();
  constructor(
    private exchangeService: ExchangeService,
  ) { }


  ngOnInit(): void {
    this.exchangeService.getExchangeRates().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      ({ usdRate, eurRate }) => {
        if (usdRate && eurRate) {
          this.usdRate = usdRate;
          this.eurRate = eurRate;
        }
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
