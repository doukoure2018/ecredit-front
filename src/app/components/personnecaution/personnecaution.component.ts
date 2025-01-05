import { Component, Input, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import {
  CustomHttpResponse,
  PersonneCautionState,
} from '../../interfaces/appstates';
import { State } from '../../interfaces/state';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Personnecaution } from '../../interfaces/personne-caution';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-personnecaution',
  templateUrl: './personnecaution.component.html',
  styleUrl: './personnecaution.component.css',
})
export class PersonnecautionComponent implements OnInit {
  @Input() referenceCredit?: string;
  personneCautionState$: Observable<
    State<CustomHttpResponse<PersonneCautionState>>
  > = new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<PersonneCautionState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  public readonly DataState = DataState;

  personnecautionForm!: FormGroup;
  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  // this is used to allow the modification button
  private disableUpdateData = new BehaviorSubject<boolean>(false);
  public isDisableData$ = this.disableUpdateData.asObservable();

  // Displaying material tables
  public dataSource: MatTableDataSource<Personnecaution> =
    new MatTableDataSource();
  displayedColumns: string[] = [
    'index',
    'nom',
    'prenom',
    'telephone',
    'profession',
    'activite',
    'age',
    'action',
  ];

  constructor(
    private fb: FormBuilder,
    private personnecautionService: DemandeIndividuelService
  ) {}
  ngOnInit(): void {
    this.personnecautionForm = this.fb.group({
      id: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      referenceCredit: [''],
      activite: [''],
      age: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      profession: ['', Validators.required],
    });
    // set the reference value as default
    this.personnecautionForm.patchValue({
      referenceCredit: this.referenceCredit,
    });

    this.personneCautionState$ = this.personnecautionService
      .newgarantiepersonnecaution$(this.referenceCredit!)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.dataSource.data = response.data?.garantiepersonnecaution ?? [];
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            error,
          });
        })
      );
  }

  onSave(): void {
    this.loadingSubject.next(true);
    this.personneCautionState$ = this.personnecautionService
      .addPersonneCaution$(this.personnecautionForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.loadingSubject.next(false);
          this.dataSource.data = response.data?.garantiepersonnecaution ?? [];
          this.personnecautionForm.reset();
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          this.loadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
          });
        })
      );
  }

  /**
   * MISE DES INFORMATIONS DE LA PERSONNE CAUTION
   */
  updataPersonneCaution(): void {
    this.loadingSubject.next(true);
    const personneCaution_ind = this.personnecautionForm.value;
    const personneCaution_id = personneCaution_ind.id;
    const personneCaution_referenceCredit = personneCaution_ind.referenceCredit;
    this.personneCautionState$ = this.personnecautionService
      .udpatePersonneCaution$(
        personneCaution_id,
        personneCaution_referenceCredit,
        personneCaution_ind
      )
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.dataSource.data = response.data?.garantiepersonnecaution ?? [];
          this.personnecautionForm.reset();
          //yes  If you still need `referenceCredit` in the form for adding a new entry:
          this.personnecautionForm.patchValue({
            referenceCredit: personneCaution_referenceCredit,
          });

          this.disableUpdateData.next(false);
          this.loadingSubject.next(false);
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }

  public viewPersonneCaution(personnecaution: Personnecaution): void {
    console.log(personnecaution);
    this.disableUpdateData.next(true);
    if (personnecaution != null) {
      this.personnecautionForm.patchValue({
        id: personnecaution.id,
        nom: personnecaution.nom,
        prenom: personnecaution.prenom,
        telephone: personnecaution.telephone,
        referenceCredit: personnecaution.referenceCredit,
        activite: personnecaution.activite,
        age: personnecaution.age,
        profession: personnecaution.profession,
      });
    }
  }

  public deletePersonneCaution(personnecaution: Personnecaution): void {
    this.personneCautionState$ = this.personnecautionService
      .deletePersonneCaution$(
        personnecaution.id!,
        personnecaution.referenceCredit!
      )
      .pipe(
        map((response) => {
          this.dataSubject.next(response);
          this.dataSource.data = response.data?.garantiepersonnecaution ?? [];
          this.disableSubject.next(false);
          this.disableUpdateData.next(false);
          this.personnecautionForm.reset();
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }
}
