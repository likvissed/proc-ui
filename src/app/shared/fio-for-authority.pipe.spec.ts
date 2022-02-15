import { FioForAuthorityPipe } from './fio-for-authority.pipe';

xdescribe('FioForAuthorityPipe', () => {
  it('create an instance', () => {
    const pipe = new FioForAuthorityPipe();
    expect(pipe).toBeTruthy();
  });
});
