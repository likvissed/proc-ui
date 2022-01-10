import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-edit-authority',
  templateUrl: './edit-authority.component.html',
  styleUrls: ['./edit-authority.component.scss']
})
export class EditAuthorityComponent implements OnInit {
  form: FormGroup;
  @Input() public el;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notification: NotificationService
  ) { }

  // Доступ для полномочий
  arr_selected_access = [
    { value: true, name: 'Всем пользователям' },
    { value: false, name: 'Ограничение по таб.номеру'}
  ]

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      access: new FormControl(true),
      name: new FormControl(null, [Validators.required, Validators.maxLength(700)]),
      tns: new FormArray([
        new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
      ])
    })

    if (this.el) {
      // console.log('el', this.el);

      this.form.controls['name'].setValue(this.el.duty)

      if (this.el.tn) {
        this.form.controls['access'].setValue(false)

        let array_tn = this.el.tn.split(', ');
        // console.log('array_tn', array_tn);

        // Удаление первого пустого элемента в массиве
        this.form.controls['tns'].removeAt(0);

        array_tn.forEach((value) => {
          // console.log('value', value);

          this.form.controls.tns.push(new FormControl(value, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]));
        });
      }

    }
  }

  closeModal() {
    this.activeModal.close();
  }

  save() {
    console.log(this.form);

    if (!this.form.value.access && !this.form.value.tns.length) {
      this.notification.show('Необходимо добавить табельный номер', { classname: 'bg-warning', headertext: 'Внимание'});
    }
  }

  onAddSTns () {
    this.form.controls
    .tns.push(new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]));
  }

  onRemoveTns (index) {
    this.form.controls['tns'].removeAt(index);
  }

  onCheckChange() {
    if (this.form.value.access) {
      (this.form.get('tns') as FormArray).clear();
    }
  }
}
