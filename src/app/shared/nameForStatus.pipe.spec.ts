import { NameForStatusPipe } from './nameForStatus.pipe';

describe('NameForStatusPipe', () => {
  const pipe = new NameForStatusPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms status 0 as Новая', () => {
    expect(pipe.transform(0)).toBe("<span class='badge badge-info'> Новая </span>");
  });

  it('transforms status 1 as Действующая', () => {
    expect(pipe.transform(1)).toBe("<span class='badge badge-success'> Действующая </span>");
  });

  it('transforms status 2 as Просроченная', () => {
    expect(pipe.transform(2)).toBe("<span class='badge badge-warning'> Просроченная </span>");
  });

  it('transforms status 3 as Отклонённая', () => {
    expect(pipe.transform(3)).toBe("<span class='badge badge-danger'> Отклонённая </span>");
  });

  it('transforms status 4 as Отозванная', () => {
    expect(pipe.transform(4)).toBe("<span class='badge badge-secondary'> Отозванная </span>");
  });

  it('transforms status 5 as Согласованная', () => {
    expect(pipe.transform(5)).toBe("<span class='badge badge-primary'> Согласованная </span>");
  });

  it('transforms status as default', () => {
    expect(pipe.transform(9999)).toBe("<span class='badge badge-light'> Неизвестный </span>");
  });
});
