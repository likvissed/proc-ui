import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../components/auth/confirmation-dialog/confirmation-dialog.component';

@Injectable({providedIn: 'root'})
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    message: string,
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize, centered: true, backdrop: 'static' });
    modalRef.componentInstance.message = message;;

    return modalRef.result;
  }

}
