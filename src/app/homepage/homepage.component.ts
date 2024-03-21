import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../common.service';

import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  public allData: any = [];
  public tableData: any = [];
  // imageUrl: string | ArrayBuffer | null = null;
public setDt:any
  registrationForm: any;
  selectedValue: number = 20;
  imageUrl: string =
    'https://t4.ftcdn.net/jpg/04/32/62/27/240_F_432622715_W5LJ15OpH5mROEr4qPPTwhXwNDCwlmK7.jpg';
  isFormSubmit: boolean = false;
  states: string[] = [
    'Maharashtra',
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'Madhya Pradesh',
  ];
  countries: string[] = ['India', 'Japan', 'Sri Lanka', 'Australia'];
  tags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private comser: CommonService,
    private route: Router
  ) {
    this.registrationForm = this.fb.group({
      imagepath:['',[Validators.required]],
      firstname: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.maxLength(20),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.maxLength(20),
        ],
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      mob: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          this.validateMobileNumber,
        ],
      ],

      age: [0, [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      // address: ['', [Validators.required]],
      addressType: ['', Validators.required], // Default to 'home'
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      companyAddress1: ['', Validators.required],
      companyAddress2: ['', Validators.required],
      tags: ['', [Validators.required]],
      newsletter: [false],
    });

    this.getData();

    

  this.registrationForm.get('companyAddress1').disable();
  this.registrationForm.get('companyAddress2').disable();

  }


  get firstName() {
    return this.registrationForm.get('firstName');
  }
  validateMobileNumber(control: any) {
    const mobileNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if (control.value && !mobileNumberPattern.test(control.value)) {
      return { invalidMobileNumber: true };
    }
    return null;
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result as string; // Ensure the result is treated as a string
        console.log('Image path:', file.name);
      };
    }
  }

ngOnInit(){
  this.comser.getDtService1().subscribe({
   next: (res:any)=>{
  
    this.setDt=res
    console.log(this.setDt)
   }

  })

this.registrationForm.patchValue(this.setDt)

}


  onSubmit() {
    this.isFormSubmit = true;
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      this.comser.sendDataService(this.registrationForm.value);
      this.sendData()

  
      this.route.navigate(['profile']);
    } else {
    }

    //  this.registrationForm.reset();
  }

  // onSubmit() {
  //   this.isFormSubmit = true;
  //   if (this.registrationForm.valid) {
  //     const formData = this.registrationForm.value;
  //     // this.comser.sendDtApi(formData).subscribe(
  //     //   response => {
  //     //     console.log('Data saved successfully:', response);

  //     //     // this.registrationForm.reset();
  //     //   },
  //     //   error => {
  //     //     console.error('Error saving data:', error);
  //     //   }
  //     // );

  //         this.comser.sendDataService(this.registrationForm.value)

  // this.route.navigate(['.profile'])
  // this.route.navigate(['profile']);

  //   } else {

  //   }

  //      this.registrationForm.reset();

  // }

  getData() {
    this.comser.getApi().subscribe({
      next: (res: any) => {
        console.log(res);
        this.tableData = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  sendData() {
    this.comser
      .sendDtApi(this.registrationForm.value).subscribe({
        next:(res:any)=>{
          console.log(res)
          this.tableData = res;
        }
      })
    
      // .then((res) => {
      //   console.log(res);
      //   this.tableData = res;
      // });
  }

  onClick() {
    this.tags.push(this.registrationForm.get('tags').value);
    console.log(this.tags);
  }

  onCancel() {}

  get f() {
    return this.registrationForm.controls;
  }

  onRangeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedValue = parseInt(target.value);
  }



  toggleCompanyAddressFields(): void {
    const addressType = this.registrationForm.get('addressType').value;
    if (addressType === 'company') {
      this.registrationForm.get('address1').disable();
      this.registrationForm.get('address2').disable();
      this.registrationForm.get('companyAddress1').enable();
      this.registrationForm.get('companyAddress2').enable();
    } else {
      this.registrationForm.get('address1').enable();
      this.registrationForm.get('address2').enable();
      this.registrationForm.get('companyAddress1').disable();
      this.registrationForm.get('companyAddress2').disable();
    }
  }
}
