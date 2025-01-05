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
import { ChargeIndState, CustomHttpResponse } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChargesInd } from '../../interfaces/charge-ind';
import { MatTableDataSource } from '@angular/material/table';
import { response } from 'express';

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrl: './charge.component.css',
})
export class ChargeComponent implements OnInit {
  chargeState$: Observable<State<CustomHttpResponse<ChargeIndState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<ChargeIndState> | null>(null);
  private loadingSubject = new BehaviorSubject<Boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  public readonly DataState = DataState;

  chargeIndForm!: FormGroup;
  private readonly REFERENCE_CREDIT: string = 'referencedcredit';

  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  // this is used to allow the modification button
  private disableUpdateData = new BehaviorSubject<boolean>(false);
  public isDisableData$ = this.disableUpdateData.asObservable();
  // referenceId
  private referenceId!: string;

  // Displaying material tables
  public dataSource: MatTableDataSource<ChargesInd> = new MatTableDataSource();
  displayedColumns: string[] = [
    'index',
    'libele',
    'qte',
    'prixUnit',
    'prixTotal',
    'action',
  ];
  constructor(
    private fb: FormBuilder,
    private indService: DemandeIndividuelService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // get first the value
    this.referenceId =
      this.activatedRouter.snapshot.paramMap.get('referencedcredit') || '';
    this.chargeIndForm = this.fb.group({
      id: [''],
      libele: ['', Validators.required],
      referenceCredit: [''],
      prixUnit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      qte: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    // set the reference value as default
    this.chargeIndForm.patchValue({ referenceCredit: this.referenceId });

    /**
     * Display Information
     */
    this.chargeState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.indService
          .chargesInd$(params.get(this.REFERENCE_CREDIT)!)
          .pipe(
            map((response) => {
              this.dataSubject.next(response);
              this.dataSource.data = response.data?.chargeind ?? [];
              return {
                dataState: DataState.LOADED,
                appData: response,
              };
            }),
            startWith({ dataState: DataState.LOADING }),
            catchError((error: string) => {
              return of({ dataState: DataState.ERROR, error });
            })
          );
      })
    );
  }

  public onSave(): void {
    this.chargeState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const referenceCredit = params.get(this.REFERENCE_CREDIT);
        if (!referenceCredit) {
          throw new Error('Reference credit is required');
        }
        return this.indService
          .addChargesInd$(referenceCredit, this.chargeIndForm.value)
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              this.dataSource.data = response.data?.chargeind ?? [];
              this.chargeIndForm.reset();
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
              return of({
                dataState: DataState.ERROR,
                error,
              });
            })
          );
      })
    );
  }

  public onSaveAndContinue(): void {}

  public goNext(): void {
    this.router.navigate([`/vente/${this.referenceId}`]);
  }

  public goBack(): void {
    this.router.navigate([`/petitcredit/${this.referenceId}`]);
  }

  public deleteChargeInd(id: number): void {
    this.chargeState$ = this.indService
      .deleteChargesInd$(id, this.referenceId)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.dataSource.data = response.data?.chargeind ?? [];

          // Re-initialize or reset the form
          this.chargeIndForm.reset();
          // Patch back the reference credit or any default values you need
          this.chargeIndForm.patchValue({ referenceCredit: this.referenceId });

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

  public viewChargeInd(chargesInd: ChargesInd): void {
    this.disableUpdateData.next(true);
    if (chargesInd != null) {
      this.chargeIndForm.patchValue({
        id: chargesInd.id,
        libele: chargesInd.libele,
        referenceCredit: chargesInd.referenceCredit,
        prixUnit: chargesInd.prixUnit,
        qte: chargesInd.qte,
      });
    }
  }

  /**
   * Modification de la charge
   */
  public updateChargesInd(): void {
    const chargesInd = this.chargeIndForm.value;
    const chargesInd_id = chargesInd.id;
    const chargesInd_referenceCredit = chargesInd.referenceCredit;
    this.chargeState$ = this.indService
      .updateChargesInd$(chargesInd_id, chargesInd_referenceCredit, chargesInd)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSource.data = response.data?.chargeind ?? [];
          this.chargeIndForm.reset();
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
          this.disableSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }
}
