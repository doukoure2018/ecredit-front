import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  ConfirmedCreditIndState,
  CustomHttpResponse,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-confirmedcredit',
  templateUrl: './confirmedcredit.component.html',
  styleUrl: './confirmedcredit.component.css',
})
export class ConfirmedcreditComponent implements OnInit {
  confirmedCreditState$: Observable<
    State<CustomHttpResponse<ConfirmedCreditIndState>>
  > = new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<ConfirmedCreditIndState> | null>(
      null
    );
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  readonly DataState = DataState;
  confirmedCreditForm!: FormGroup;

  private readonly REFERENCE_CREDIT: string = 'referencedcredit';

  private referenceId!: string;

  constructor(
    private fb: FormBuilder,
    private individuelService: DemandeIndividuelService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.confirmedCreditForm = this.fb.group({
      typeActivite: ['', Validators.required],
      referenceCredit: [''],
      montant: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.referenceId =
      this.activatedRouter.snapshot.paramMap.get('referencedcredit') || '';
    this.confirmedCreditForm.patchValue({ referenceCredit: this.referenceId });

    this.confirmedCreditState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.individuelService
          .confirmedCredit$(params.get(this.REFERENCE_CREDIT)!)
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              //setting defaults values
              this.confirmedCreditForm.patchValue({
                typeActivite: response.data?.confirmedCredit?.typeActivite,
              });
              this.confirmedCreditForm.patchValue({
                montant: response.data?.confirmedCredit?.montant,
              });
              this.disableSubject.next(
                response.data?.confirmedCredit?.referenceCredit == null
              );

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
                appData: this.dataSubject.value ?? undefined,
              });
            })
          );
      })
    );
  }

  public onSave(): void {
    this.loadingSubject.next(true);
    this.confirmedCreditState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.individuelService
          .addConfirmedCreditInd$(
            params.get(this.REFERENCE_CREDIT)!,
            this.confirmedCreditForm.value
          )
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              this.loadingSubject.next(false);
              if (response.data?.confirmedCredit?.referenceCredit == null) {
                this.disableSubject.next(true);
              } else {
                this.disableSubject.next(false);
              }
              //setting defaults values after saving
              this.confirmedCreditForm.patchValue({
                typeActivite: response.data?.confirmedCredit?.typeActivite,
              });
              this.confirmedCreditForm.patchValue({
                montant: response.data?.confirmedCredit?.montant,
              });

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
                appData: this.dataSubject.value ?? undefined,
              });
            })
          );
      })
    );
  }

  public onSaveAndContinue(): void {
    this.loadingSubject.next(true);
    this.confirmedCreditState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.individuelService
          .addConfirmedCreditInd$(
            params.get(this.REFERENCE_CREDIT)!,
            this.confirmedCreditForm.value
          )
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              this.loadingSubject.next(false);

              // save and go the next page
              this.router.navigate([
                `/petitcredit/${response.data?.confirmedCredit?.referenceCredit}`,
              ]);
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
                appData: this.dataSubject.value ?? undefined,
              });
            })
          );
      })
    );
  }

  public goNext(): void {
    this.router.navigate([`/petitcredit/${this.referenceId}`]);
  }

  public updateData(): void {}
}
