export interface Request {
  tn: number,
  sn_passport: string,
  passport_issued: string,
  date_passport: string,
  code_passport: string,
  date_start: string,
  select_time: number,
  general: string,
  array_authority: string[]

  fio: string,
  login: string,

  author_tn: number,
  author_fio: string,
  author_login: string,
}

export interface RequestForm {
  tn: number,
  sn_passport: string,
  passport_issued: string,
  date_passport: Date,
  general: string,
  date_start: Date,
  code_passport: string,
  array_authority: string[]
  select_time: number
}

export interface WithdrawForm {
  id: number,
  reason: string,
  flag_document: boolean,
  reason_document: string,
}

