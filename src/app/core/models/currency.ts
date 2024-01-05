export class Currency {
  name!: string;
  symbol!: string;
  short!: string;

  constructor(data: any) {
    this.name = data.name;
    this.symbol = data.symbol;
    this.short = data.short;
  }

  find(short: string, list: Array<Currency>): Currency | undefined {
    return list.find((el) => { return el.short === short });
  }

}
