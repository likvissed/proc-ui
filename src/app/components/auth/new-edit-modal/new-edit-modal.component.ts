import { NotificationService } from './../../../services/notification.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-edit-modal',
  templateUrl: './new-edit-modal.component.html',
  styleUrls: ['./new-edit-modal.component.scss']
})
export class NewEditModalComponent implements OnInit {
  form: FormGroup;
  @Input() public text;
  @Input() public array_authority;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.onInitialValues();
  }

  onInitialValues() {
    // Удалить из массива текущее полномочие для дальнейшей проверки уникальности
    let index = this.array_authority.indexOf(this.text);
    if (index !== -1) {
      this.array_authority.splice(index, 1);
    }

    this.form = this.formBuilder.group({
      value: new FormControl(this.text, [Validators.required, Validators.maxLength(699)])
    })
  }

  onSaveValue() {
    if (this.form.invalid) {
      this.notification.show('Проверьте корректность полномочия', { classname: 'bg-danger text-light', headertext: 'Внимание' });
      return
    }

    let not_uniq = this.array_authority.find(x => x == this.form.value.value);

    // Проверка, если в списке полномочий нет такого значения, то можно изменить наименование полномочия
    if (not_uniq == undefined) {
      this.activeModal.close(this.form.value.value);
    } else {
      this.notification.show('Введённое полномочие уже существует', { classname: 'bg-danger text-light', headertext: 'Невозможно внести изменения' });
    }
  }

}
