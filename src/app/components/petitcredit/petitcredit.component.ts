import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { State } from '../../interfaces/state';
import {
  CustomHttpResponse,
  PetitCreditState,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-petitcredit',
  templateUrl: './petitcredit.component.html',
  styleUrl: './petitcredit.component.css',
})
export class PetitcreditComponent implements OnInit {
  petitCreditState$: Observable<State<CustomHttpResponse<PetitCreditState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<PetitCreditState> | null>(null);

  private loadingSubject = new BehaviorSubject<Boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  readonly DataState = DataState;
  petitCreditForm!: FormGroup;
  private readonly REFERENCE_CREDIT: string = 'referencedcredit';

  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private individuelService: DemandeIndividuelService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  // referenceId
  private referenceId!: string;

  ngOnInit(): void {
    // get first the value
    this.referenceId =
      this.activatedRouter.snapshot.paramMap.get('referencedcredit') || '';

    this.petitCreditForm = this.fb.group({
      moyenPerson: ['', Validators.required],
      referenceCredit: [''],
      bien: ['', Validators.required],
      capital: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      creance: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      dette: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      statutActivite: ['', Validators.required],
      experience: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      lieuxAct: ['', Validators.required],
      personEmp: ['', Validators.required],
      lien: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      cumulCredit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      nbreCredit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    // set the reference value as default
    this.petitCreditForm.patchValue({ referenceCredit: this.referenceId });
    /**
     * Display Information
     */
    this.petitCreditState$ = this.activatedRouter.paramMap.pipe(
      switchMap((param: ParamMap) => {
        return this.individuelService
          .petitCredit$(param.get(this.REFERENCE_CREDIT)!)
          .pipe(
            map((response) => {
              this.dataSubject.next(response);
              this.disableSubject.next(
                response.data?.petitcredit?.referenceCredit == null
              );

              if (response.data?.petitcredit != null) {
                this.petitCreditForm.patchValue({
                  moyenPerson: response.data.petitcredit.moyenPerson,
                  referenceCredit: response.data.petitcredit.referenceCredit,
                  bien: response.data.petitcredit.bien,
                  capital: response.data.petitcredit.capital,
                  creance: response.data.petitcredit.creance,
                  dette: response.data.petitcredit.dette,
                  statutActivite: response.data.petitcredit.statutActivite,
                  experience: response.data.petitcredit.experience,
                  lieuxAct: response.data.petitcredit.lieuxAct,
                  personEmp: response.data.petitcredit.personEmp,
                  lien: response.data.petitcredit.lien,
                  nombre: response.data.petitcredit.nombre,
                  cumulCredit: response.data.petitcredit.cumulCredit,
                  nbreCredit: response.data.petitcredit.nbreCredit,
                });
              }
              return {
                dataState: DataState.LOADED,
                appData: this.dataSubject.value ?? undefined,
              };
            }),
            startWith({
              dataState: DataState.LOADING,
            }),
            catchError((error: string) => {
              return of({
                dataState: DataState.ERROR,
                error,
              });
            })
          );
      })
    );
  }

  public onSave(): void {
    this.loadingSubject.next(true);
    this.petitCreditState$ = this.activatedRouter.paramMap.pipe(
      switchMap((param: ParamMap) => {
        return this.individuelService
          .addPetitCredit$(
            param.get(this.REFERENCE_CREDIT)!,
            this.petitCreditForm.value
          )
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              this.loadingSubject.next(false);
              this.disableSubject.next(
                response.data?.petitcredit?.referenceCredit == null
              );
              if (response.data?.petitcredit != null) {
                this.petitCreditForm.patchValue({
                  moyenPerson: response.data.petitcredit.moyenPerson,
                  referenceCredit: response.data.petitcredit.referenceCredit,
                  bien: response.data.petitcredit.bien,
                  capital: response.data.petitcredit.capital,
                  creance: response.data.petitcredit.creance,
                  dette: response.data.petitcredit.dette,
                  statutActivite: response.data.petitcredit.statutActivite,
                  experience: response.data.petitcredit.experience,
                  lieuxAct: response.data.petitcredit.lieuxAct,
                  personEmp: response.data.petitcredit.personEmp,
                  lien: response.data.petitcredit.lien,
                  nombre: response.data.petitcredit.nombre,
                  cumulCredit: response.data.petitcredit.cumulCredit,
                  nbreCredit: response.data.petitcredit.nbreCredit,
                });
              }
              return {
                dataState: DataState.LOADED,
                appData: response,
              };
            }),
            startWith({ dataState: DataState.LOADING }),
            catchError((error: string) => {
              this.loadingSubject.next(false);
              return of({
                dataState: DataState.ERROR,
                error,
                appData: this.dataSubject.value ?? undefined,
              });
            })
          );
      })
    );
  }

  public updateData(): void {
    this.loadingSubject.next(true);
    this.petitCreditState$ = this.activatedRouter.paramMap.pipe(
      switchMap((param: ParamMap) => {
        return this.individuelService
          .udpateProfile$(
            param.get(this.REFERENCE_CREDIT)!,
            this.petitCreditForm.value
          )
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              this.loadingSubject.next(false);

              if (response.data?.petitcredit != null) {
                this.petitCreditForm.patchValue({
                  moyenPerson: response.data.petitcredit.moyenPerson,
                  referenceCredit: response.data.petitcredit.referenceCredit,
                  bien: response.data.petitcredit.bien,
                  capital: response.data.petitcredit.capital,
                  creance: response.data.petitcredit.creance,
                  dette: response.data.petitcredit.dette,
                  statutActivite: response.data.petitcredit.statutActivite,
                  experience: response.data.petitcredit.experience,
                  lieuxAct: response.data.petitcredit.lieuxAct,
                  personEmp: response.data.petitcredit.personEmp,
                  lien: response.data.petitcredit.lien,
                  nombre: response.data.petitcredit.nombre,
                  cumulCredit: response.data.petitcredit.cumulCredit,
                  nbreCredit: response.data.petitcredit.nbreCredit,
                });
              }
              return {
                dataState: DataState.LOADED,
                appData: response,
              };
            }),
            startWith({
              dataState: DataState.LOADING,
              appData: this.dataSubject.value ?? undefined,
            }),
            catchError((error: string) => {
              this.loadingSubject.next(false);
              return of({
                dataState: DataState.ERROR,
                error,
                appData: this.dataSubject.value ?? undefined,
              });
            })
          );
      })
    );
  }

  public onSaveAndContinue(): void {}

  public goNext(): void {
    this.router.navigate([`/charge/${this.referenceId}`]);
  }

  public goBack(): void {
    this.router.navigate([`/confirmedCredit/${this.referenceId}`]);
  }
}
