import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-cargo-quotes',
  templateUrl: './cargo-quotes.component.html',
  styleUrls: ['./cargo-quotes.component.css']
})
export class CargoQuotesComponent  {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}