import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyConverterItemComponent } from './currency-converter-item.component';

describe('CurrencyConverterItemComponent', () => {
  let component: CurrencyConverterItemComponent;
  let fixture: ComponentFixture<CurrencyConverterItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyConverterItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
