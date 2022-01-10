import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorService } from 'src/app/services/error.service';
import { RequestsService } from 'src/app/services/requests.service';
import { EditAuthorityComponent } from '../edit-authority/edit-authority.component';

@Component({
  selector: 'app-authority',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.scss']
})
export class AuthorityComponent implements OnInit {

  constructor(
    private requestsService: RequestsService,
    private error: ErrorService,
    private modalService: NgbModal
  ) { }

  lists

  statuses = [
    { disabled: 1, value: '', name: 'Выберите статус' },
    { disabled: 0, value: '', name: 'Все статусы' },
    { disabled: 0, value: 0, name: 'Новое' },
    { disabled: 0, value: 1, name: 'Одобренное' }
  ]

  filters = {
    tn: '',
    status: this.statuses[0].value,
    duty: ''
  }

  pagination = {
    currentPage: 1,
    totalItems: 0,
    recordsFiltered:0,
    maxSize: 20,
    startRecord: 1,
    endRecord: 20,
    totalPages: 1
  };

  ngOnInit(): void {
    this.loadAuthority()
  }

  loadAuthority() {
    this.requestsService.getAuthority(this.filters, this.pagination.currentPage, this.pagination.maxSize).subscribe((response) => {
      // console.log('response getAuthority', response)
      if (!response.lists) {
        this.error.handling(response)
        return
      }

      this.lists = response.lists
      this.pagination.totalItems = response.totalItems
      this.pagination.recordsFiltered = response.recordsFiltered

      this.calculatePagination()
    },
    (error) => {
      this.lists = []
      this.error.handling(error)
    })
    // this.lists = [{id: 1, tn: '210, 1212', duty: 'text', state: 0}]
  }

  filterChange() {
    this.pagination.currentPage = 1

    this.loadAuthority()
  }

  pageChanged(event){
    this.loadAuthority();
  }

  calculatePagination() {
    this.pagination.startRecord = (this.pagination.currentPage - 1) * this.pagination.maxSize + 1
    this.pagination.endRecord = this.pagination.startRecord + this.pagination.maxSize - 1
    this.pagination.totalPages = Math.ceil(this.pagination.recordsFiltered / this.pagination.maxSize)

    if (this.pagination.endRecord != this.pagination.recordsFiltered && this.pagination.totalPages == this.pagination.currentPage) {
      this.pagination.endRecord = this.pagination.recordsFiltered
    }
  }

  addAuthority() {
    this.modalService.open(EditAuthorityComponent, { size: 'lg', backdrop: 'static' })
  }

  deleteAuthority(id: number) {
    console.log('delete', id)
  }

  editAuthority(element) {
    // console.log('edit', element)

    const modalRef = this.modalService.open(EditAuthorityComponent, { size: 'lg', backdrop: 'static' })
    modalRef.componentInstance.el = element
  }
}
