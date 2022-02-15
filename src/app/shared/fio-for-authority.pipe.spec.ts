import { FioForAuthorityPipe } from './fio-for-authority.pipe';

describe('FioForAuthorityPipe', () => {
  const pipe = new FioForAuthorityPipe();
  let data = [
    {
      fio: "Иванов И.В.",
      fullname: "Иванов Иван Владимирович",
      tn: 12345
    },
    {
      fio: "Петров И.О.",
      fullname: "Петров Илья Олегович",
      tn: 54321
    }
  ]

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms data as fio', () => {
    let result = data.map(e => e.fio).join(', ');

    expect(pipe.transform(data)).toBe(result);
  });

  it('transforms data as default', () => {
    expect(pipe.transform([])).toBe('Для всех');
  });
});
