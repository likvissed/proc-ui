export interface Request {
  tn: number,
  passport: string,
  date_passport: Date,
  date_start: Date,
  date_end: Date,
  array_authority: string[]

  fio: string,
  login: string,
  profession: string,

  author_tn: number,
  author_fio: string,
  author_login: string,
}

export interface RequestForm {
  tn: number,
  passport: string,
  date_passport: Date,
  date_start: Date,
  date_end: Date,
  array_authority: string[]
}
