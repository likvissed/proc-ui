import { RequestsService } from './../requests.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Request } from './../interfaces';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  form: FormGroup;

  constructor(
    private requestsService: RequestsService
  ) { }

  ngOnInit() {
    console.log('NewComponent')

    this.form = new FormGroup({
      tn: new FormControl(null, [Validators.required]),
      passport: new FormControl(null, [Validators.required]),
      date_passport: new FormControl(null, [Validators.required]),
      date_start: new FormControl(null, [Validators.required]),
      date_end: new FormControl(null, [Validators.required])
      // array_authority: new FormControl(null)
    })
  }

  submit() {
    console.log('submit', this.form)
    if (this.form.invalid) {
      return
    }

    const req : Request = {
      tn: this.form.value.tn,
      passport: this.form.value.passport,
      date_passport: this.form.value.date_passport,
      date_start: this.form.value.date_start,
      date_end: this.form.value.date_end
    }

    console.log('request', req)

    // this.requestsService.valid(request).subscribe(() => {
    //   // this.form.reset()
    // })

    this.requestsService.valid(req).subscribe(() => {
      // this.form.reset()
    })
  }

}
