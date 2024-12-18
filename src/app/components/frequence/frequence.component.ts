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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataState } from '../../enum/datastate.enum';
import { CustomHttpResponse, FrequenceState } from '../../interfaces/appstates';
import { DemandeIndividuelService } from '../../services/individuel.service';

@Component({
  selector: 'app-frequence',
  templateUrl: './frequence.component.html',
  styleUrl: './frequence.component.css',
})
export class FrequenceComponent implements OnInit {
  frequenceState$: Observable<State<CustomHttpResponse<FrequenceState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<FrequenceState> | null>(null);

  private loadingSubject = new BehaviorSubject<Boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  readonly DataState = DataState;
  frequenceForm!: FormGroup;
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

    this.frequenceForm = this.fb.group({
      referenceCredit: [''],
      frequence: ['', Validators.required],
    });
    // set the reference value as default
    this.frequenceForm.patchValue({ referenceCredit: this.referenceId });
    /**
     * Display Information
     */
    this.frequenceState$ = this.activatedRouter.paramMap.pipe(
      switchMap((param: ParamMap) => {
        return this.individuelService
          .frequence$(param.get(this.REFERENCE_CREDIT)!)
          .pipe(
            map((response) => {
              this.dataSubject.next(response);
              this.disableSubject.next(
                response.data?.frequence?.referenceCredit == null
              );

              if (response.data?.frequence != null) {
                this.frequenceForm.patchValue({
                  frequence: response.data.frequence.frequence,
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
    this.frequenceState$ = this.activatedRouter.paramMap.pipe(
      switchMap((param: ParamMap) => {
        return this.individuelService
          .addFrequence$(
            param.get(this.REFERENCE_CREDIT)!,
            this.frequenceForm.value
          )
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              this.loadingSubject.next(false);
              this.disableSubject.next(
                response.data?.frequence?.referenceCredit == null
              );
              if (response.data?.frequence != null) {
                this.frequenceForm.patchValue({
                  frequence: response.data.frequence.frequence,
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

  public onSaveAndContinue(): void {}

  public updateData(): void {
    console.log('this is updata information');
  }

  public goNext(): void {
    this.router.navigate([`/garanties/${this.referenceId}`]);
  }

  public goBack(): void {
    this.router.navigate([`/vente/${this.referenceId}`]);
  }
}
