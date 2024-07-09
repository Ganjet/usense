import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../model/currency.model';


@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private readonly apiUrl = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
  private currencySubject = new BehaviorSubject<Currency[]>([]);

  constructor(private http: HttpClient) {
    this.fetchExchangeRates();
  }

  public getExchnages(): Observable<Currency[]> {
    return this.currencySubject.asObservable();
  }

  public getExchangeRates(): Observable<{ usdRate?: Currency, eurRate?: Currency }> {
    return this.currencySubject.asObservable().pipe(
      map((currencies) => {
        const usdRate = currencies.find(currency => currency.cc === 'USD');
        const eurRate = currencies.find(currency => currency.cc === 'EUR');
        return { usdRate, eurRate };
      }),
      catchError(error => {
        console.error('Error in getExchangeRates', error);
        return of({ usdRate: {} as Currency, eurRate: {} as Currency });
      })
    )
  }

  private fetchExchangeRates(): void {
    this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        txt: item.txt,
        rate: item.rate,
        cc: item.cc
      })) as Currency[]),
      catchError(error => {
        console.error('Failed to fetch exchange rates', error);
        return of([]);
      })
    ).subscribe(currencies => {
      this.currencySubject.next(currencies);
    });
  }
}
