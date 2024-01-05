import { DefaultCurrencyPipe } from './default-currency.pipe';

describe('DefaultCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new DefaultCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
