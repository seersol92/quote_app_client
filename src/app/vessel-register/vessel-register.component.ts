import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-vessel-register',
  templateUrl: './vessel-register.component.html',
  styleUrls: ['./vessel-register.component.css']
})
export class VesselRegisterComponent  {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}