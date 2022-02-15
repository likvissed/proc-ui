import { ShortNamePipe } from './shortName.pipe';

describe('ShortNamePipe', () => {
  const pipe = new ShortNamePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms fullName as initial', () => {
    let fullname = 'Иванов Иван Владимирович';
    let result = fullname.split(" ")
                          .map((el, index) => {
                            return index == 0 ? `${el} ` : `${el[0]}.`
                          }).join("");

    expect(pipe.transform(fullname)).toBe(result);
  });
});
