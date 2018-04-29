import { Component, TemplateRef, Pipe, PipeTransform, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.css']
})
export class CompanyRegisterComponent implements OnInit {
  modalRef: BsModalRef;
  companyReg: FormGroup;
  messageClass: String = null;
  message: String = null;
  formProcessing: Boolean = false;
  isEditCompany: Boolean = false;
  companyRegisterId: String = null;
  companyModalTitleTxt: String = null;
  companyModalSaveBtnTxt: String = null;
  userName: string = null;
  isAdmin: Boolean = false;
  companyList: any = [];
  company: any = [];
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.createForm();
    this.companyFetch();
   }

  ngOnInit() {
    const  userData = this.auth.getUserData();
    this.userName = userData.user.username;
    this.isAdmin  = userData.user.isadmin;
    }

  async companyFetch() {
    await this.auth.getRequest('/company-register', null ).subscribe(res => {
    if (!res.success) {
      this.messageClass = 'alert alert-danger';
      this.message = 'Something went wrong!!';
    } else {
      this.companyList = res.data;
    }
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
    });
  }
  /**
   * REGX: ^[-_ a-zA-Z0-9]+$ allow alpha numeric _ - and space
   *
   */
  createForm() {
    this.companyReg = this.fb.group({
      name: [null, Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
          ])
      ],
      type: [null, Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
          ])
      ],
      address: [null, Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
          ])
      ],
      address2: [null, Validators.compose([
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
          ])
      ],
      address3: [null, Validators.compose([
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
          ])
      ],
      city: [null, Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
          ])
      ],
      state: [null, Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
          ])
      ],
      zip: [null, Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
        ])
      ],
      country: [null, Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
        ])
        ],
      phone: [null, Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('(^[-_ a-zA-Z0-9]+$)')
        ])
      ],
      website: [null, Validators.compose([
        Validators.required
      ])
      ]
    });
  }

  onCreate(data) {
    this.auth.postRequest('/company-register/create', data ).subscribe(res => {
      this.modalRef.hide();
      this.formProcessing = false;
      if (!res.success) {
          this.messageClass = 'alert alert-danger';
          this.message = 'Something went wrong!!';
      }else {
          this.companyFetch();
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
      this.auth.postRequest('/company-register/update', data ).subscribe(res => {
      this.modalRef.hide();
      this.formProcessing = false;
      this.isEditCompany = false;
      this.companyRegisterId = null; // make id null
      this.companyReg.reset(); // reset form
      if (!res.success) {
          this.messageClass = 'alert alert-danger';
          this.message = res.message;
      }else {
          this.companyFetch();
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
      name: this.companyReg.get('name').value,
      type: this.companyReg.get('type').value,
      address:  this.companyReg.get('address').value,
      address2: this.companyReg.get('address2').value,
      address3: this.companyReg.get('address3').value,
      city:     this.companyReg.get('city').value,
      state:    this.companyReg.get('state').value,
      country:  this.companyReg.get('country').value,
      zip:    this.companyReg.get('zip').value,
      phone:  this.companyReg.get('phone').value,
      website: this.companyReg.get('website').value,
      added_by: this.userName
    };
    if (this.companyRegisterId !== null && this.isEditCompany) {
        data['company_id'] = this.companyRegisterId;
        this.onUpdate(data);
    } else {
        this.onCreate(data);
    }
  }

  openModal(template: TemplateRef<any>) {
    this.companyReg.reset();
    this.companyModalTitleTxt = 'Create Company';
    this.companyModalSaveBtnTxt = 'Submit';
    this.modalRef = this.modalService.show(template);
  }

  onEditCompany (index: number, template: any) {
    this.companyRegisterId = this.companyList[index]['_id'];
    this.isEditCompany = true;
    this.company = this.companyList[index];
    console.log(this.company);
    this.companyReg.patchValue({
      name: this.company['name'],
      type: this.company['type'],
      address:  this.company['address'],
      address2: this.company['address2'],
      address3: this.company['address3'],
      city:     this.company['city'],
      state:    this.company['state'],
      country:  this.company['country'],
      zip:    this.company['zip'],
      phone:  this.company['phone'],
      website: this.company['website']
    });
    this.companyModalTitleTxt = 'Edit Company';
    this.companyModalSaveBtnTxt = 'Update';
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'company-modal' })
    );
  }

  onRemoveCompany(cargoIndex: number, cargoId: any) {
    this.companyRegisterId = this.companyList[cargoIndex]['_id'];
    if (this.companyRegisterId) {
      if (confirm('Are you sure to delete this data?') ) {
         this.auth.postRequest('/company-register/delete', {company_id: this.companyRegisterId} ).subscribe(res => {
           if (!res.success) {
             this.messageClass = 'alert alert-danger';
             this.message = res.message;
           } else {
             this.companyList.splice(cargoIndex, 1);
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
