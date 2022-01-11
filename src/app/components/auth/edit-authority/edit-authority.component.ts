import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorService } from 'src/app/services/error.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-edit-authority',
  templateUrl: './edit-authority.component.html',
  styleUrls: ['./edit-authority.component.scss']
})
export class EditAuthorityComponent implements OnInit {
  form: FormGroup;
  @Input() public el;

  name = 'Добавить полномочие';

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private requestsService: RequestsService,
    private error: ErrorService
  ) { }

  // Доступ для полномочий
  arr_selected_access = [
    { value: true, name: 'Всем пользователям' },
    { value: false, name: 'Ограничение по таб.номеру'}
  ]

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      id: [null],
      access: new FormControl(true),
      name: new FormControl(null, [Validators.required, Validators.maxLength(700)]),
      tns: new FormArray([])
    })

    if (this.el) {
      this.name = 'Редактирование полномочия';
      this.form.controls['id'].setValue(this.el.id)
      this.form.controls['name'].setValue(this.el.duty)

      if (this.el.tn) {
        this.form.controls['access'].setValue(false)

        let array_tn = this.el.tn.split(',');

        // Удаление первого пустого элемента в массиве
        // this.form.controls['tns'].removeAt(0);
        (<FormArray>this.form.controls["tns"]).removeAt(0)

        array_tn.forEach((value) => {
          // this.form.controls.tns.push(new FormControl(value, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]));
          (<FormArray>this.form.controls['tns']).push(new FormControl(value, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]));
        });
      }

    }
  }

  closeModal() {
    this.activeModal.close();
  }

  save() {
    if (!this.form.value.access && !this.form.value.tns.length) {
      this.notification.show('Необходимо добавить табельный номер', { classname: 'bg-warning', headertext: 'Внимание'});

      return
    }

    if (this.form.value.id) {
      this.requestsService.updateAuthority(this.form.getRawValue())
        .subscribe((response) => {
          this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});
          this.closeModal()
        },
        (error) => {
          this.error.handling(error)
        })
    } else {
      this.requestsService.addAuthority(this.form.getRawValue())
        .subscribe((response) => {
          this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});
          this.closeModal()
        },
        (error) => {
          this.error.handling(error)
        })
    }

  }

  onAddSTns () {
    (<FormArray>this.form.controls['tns']).push(new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]));
  }

  onRemoveTns (index) {
    (<FormArray>this.form.controls["tns"]).removeAt(index)
  }

  onCheckChange() {
    if (this.form.value.access) {
      (this.form.get('tns') as FormArray).clear();
    }
  }

  getFormsArray() : FormArray {
    return this.form.controls['tns'] as FormArray;
  }
}
