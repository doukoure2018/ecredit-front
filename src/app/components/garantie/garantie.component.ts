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
import { CustomHttpResponse, GarantieState } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-garantie',
  templateUrl: './garantie.component.html',
  styleUrl: './garantie.component.css',
})
export class GarantieComponent implements OnInit {
  garantieMatState$: Observable<State<CustomHttpResponse<GarantieState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<GarantieState> | null>(null);
  private loadingSubject = new BehaviorSubject<Boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  readonly DataState = DataState;
  garantieMatForm!: FormGroup;
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

    this.garantieMatForm = this.fb.group({
      referenceCredit: [''],
      libele: ['', Validators.required],
      montant: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    // Set the reference value as default
    this.garantieMatForm.patchValue({ referenceCredit: this.referenceId });
    /**
     * Display Information
     */
    this.garantieMatState$ = this.activatedRouter.paramMap.pipe(
      switchMap((param: ParamMap) => {
        return this.individuelService
          .garantieMateriel$(param.get(this.REFERENCE_CREDIT)!)
          .pipe(
            map((response) => {
              this.dataSubject.next(response);
              this.disableSubject.next(
                response.data?.garantieMat?.referenceCredit == null
              );

              if (response.data?.garantieMat != null) {
                this.garantieMatForm.patchValue({
                  libele: response.data.garantieMat.libele,
                  montant: response.data.garantieMat.montant,
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
    this.garantieMatState$ = this.activatedRouter.paramMap.pipe(
      switchMap((param: ParamMap) => {
        return this.individuelService
          .addGarantieMaterielle$(this.garantieMatForm.value)
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              this.loadingSubject.next(false);
              this.disableSubject.next(
                response.data?.garantieMat?.referenceCredit == null
              );
              if (response.data?.garantieMat != null) {
                this.garantieMatForm.patchValue({
                  libele: response.data.garantieMat.libele,
                  montant: response.data.garantieMat.montant,
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
    console.log('this is updata information');
  }

  public goBack(): void {
    this.router.navigate([`/vente/${this.referenceId}`]);
  }
}
