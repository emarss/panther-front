export class CountryCode {
  name!: string;
  dial_code!: string;
  code!: string;
  flag!: string;

  constructor(data: any) {
    this.name = data.name;
    this.dial_code = data.dial_code;
    this.code = data.code;
    this.flag = data.flag;
  }

  find(dial_code: string, list: Array<CountryCode>): CountryCode | undefined {
    return list.find((el) => { return el.dial_code === dial_code });
  }

}
