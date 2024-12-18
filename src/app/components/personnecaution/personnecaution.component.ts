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

  updataPersonneCaution(): void {}
}
