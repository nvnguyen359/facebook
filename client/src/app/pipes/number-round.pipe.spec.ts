import { NumberRoundPipe } from './number-round.pipe';

describe('NumberRoundPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberRoundPipe();
    expect(pipe).toBeTruthy();
  });
});
