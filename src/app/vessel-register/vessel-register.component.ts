import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vessel-register',
  templateUrl: './vessel-register.component.html',
  styleUrls: ['./vessel-register.component.css']
})
export class VesselRegisterComponent  {
  modalRef: BsModalRef;
  vesselFrom: FormGroup;
  messageClass: String = null;
  message: String = null;
  cargoModalTitleTxt: String = '';
  cargoModalSaveBtnTxt: String = '';
  vesselId: String;
  vesselList = [] ;
  vessel = [];
  formProcessing: Boolean = false;
  isEditVessel: Boolean = false;
  vesselRegisterId: String ;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.createForm();
    this.vesselFetch();
   }

  async vesselFetch() {
    await this.auth.getRequest('/vessel-register', null ).subscribe(res => {
    if (!res.success) {
      this.messageClass = 'alert alert-danger';
      this.message = 'Something went wrong!!';
    } else {
      this.vesselList = res.data;
    }
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
    });
  }

  createForm() {
    this.vesselFrom = this.fb.group({
      name: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      type: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      owner: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      imo: [null, Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      flag: [null, Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ]
    });
  }

  onCreate(data) {
      this.auth.postRequest('/vessel-register/create', data ).subscribe(res => {
      this.modalRef.hide();
      this.formProcessing = false;
      this.vesselFrom.reset();
      if (!res.success) {
          this.messageClass = 'alert alert-danger';
          this.message = res.message;
      }else {
          this.vesselFetch();
          this.messageClass = 'alert alert-success';
          this.message = res.message;
      }
      setTimeout(() => {
        this.messageClass = '';
        this.message = '';
      }, 10000);
    });
  }

  onUpdate (data) {
      this.auth.postRequest('/vessel-register/update', data ).subscribe(res => {
      this.modalRef.hide();
      this.formProcessing = false;
      this.isEditVessel = false;
      this.vesselId = null; // make id null
      this.vesselFrom.reset(); // reset form
      if (!res.success) {
          this.messageClass = 'alert alert-danger';
          this.message = res.message;
      }else {
          this.vesselFetch();
          this.messageClass = 'alert alert-success';
          this.message = res.message;
      }
      setTimeout(() => {
        this.messageClass = '';
        this.message = '';
      }, 10000);
    });
  }

  onSubmit() {
    this.formProcessing = true;
    const data = {
        name: this.vesselFrom.get('name').value,
        type: this.vesselFrom.get('type').value,
        own:  this.vesselFrom.get('owner').value,
        imo:  this.vesselFrom.get('imo').value,
        flag: this.vesselFrom.get('flag').value
    };
    if (this.vesselId !== null && this.isEditVessel) {
        data['vessel_id'] = this.vesselId;
        this.onUpdate(data);
    } else {
        this.onCreate(data);
    }
  }

  openModal(template: TemplateRef<any>) {
    this.vesselFrom.reset();
    this.cargoModalTitleTxt = 'Create New Vessel';
    this.cargoModalSaveBtnTxt = 'Submit';
    this.modalRef = this.modalService.show(template);
  }

  onEditVessel (vesselIndex: number, template: any) {
    this.vesselId = this.vesselList[vesselIndex]['_id'];
    this.isEditVessel = true;
    this.vessel = this.vesselList[vesselIndex];
    this.vesselFrom.patchValue({
      name: this.vessel['name'],
      type: this.vessel['type'],
      owner:  this.vessel['own'],
      imo:  this.vessel['imo'],
      flag: this.vessel['flag']
    });
    this.cargoModalTitleTxt = 'Edit Vessel';
    this.cargoModalSaveBtnTxt = 'Update';
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'vessel-modal' })
    );
  }

  onRemoveVessel(vesselIndex: number, veseelId: any) {
    if (veseelId) {
      if (confirm('Are you sure to delete this Vessel Registry?') ) {
         this.auth.postRequest('/vessel-register/delete', {vessel_id: veseelId} ).subscribe(res => {
           if (!res.success) {
             this.messageClass = 'alert alert-danger';
             this.message = res.message;
           } else {
             this.vesselList.splice(vesselIndex, 1);
             this.messageClass = 'alert alert-success';
             this.message = res.message;
           }
         setTimeout(() => {
           this.messageClass = '';
           this.message = '';
         }, 10000);
         });
      }
    }
  }
}
