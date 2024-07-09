export class Currency {
  constructor(
    public txt: string,
    public rate: number,
    public cc: string
  ) { }
}
export const UKRAINE_CURRENCY = new Currency('Українська гривня', 1, 'UAH');