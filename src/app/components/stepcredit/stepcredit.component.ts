import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-stepcredit',
  templateUrl: './stepcredit.component.html',
  styleUrl: './stepcredit.component.css',
})
export class StepcreditComponent {
  confirmedCreditForm!: FormGroup;
  autreInformationForm!: FormGroup;
  analyseCreditForm!: FormGroup;
  secondFormulaire!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.confirmedCreditForm = this.fb.group({
      typeActivite: ['', Validators.required],
      montant: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });

    // this.autreInformationForm = this.fb.group({
    //   moyenPerson: ['', Validators.required],
    //   bien: ['', Validators.required],
    //   capital: [''],
    //   creance: [''],
    //   dette: [''],
    //   statutActivite: ['', Validators.required],
    //   experience: ['', Validators.required],
    //   lieuxAct: ['', Validators.required],
    //   personEmp: ['', Validators.required],
    //   lien: ['', Validators.required],
    //   nombre: [''],
    //   // individuel_id: ['', Validators.required],
    //   // user_id: ['', Validators.required],
    //   // referenceCredit: ['', Validators.required],
    // });

    // this.analyseCreditForm = this.fb.group({
    //   moyenPerson: ['', Validators.required],
    //   bien: ['', Validators.required],
    //   capital: [''],
    //   creance: [''],
    //   dette: [''],
    //   statutActivite: ['', Validators.required],
    //   experience: ['', Validators.required],
    //   lieuxAct: ['', Validators.required],
    //   personEmp: ['', Validators.required],
    //   lien: ['', Validators.required],
    //   nombre: [''],
    //   // individuel_id: ['', Validators.required],
    //   // user_id: ['', Validators.required],
    //   // referenceCredit: ['', Validators.required],
    // });

    // this.secondFormulaire = this.fb.group({
    //   nom: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    // });
  }
}
