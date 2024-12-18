import { Component, Input, OnInit } from '@angular/core';
import {
  CustomHttpResponse,
  LocalisationState,
} from '../../interfaces/appstates';
import { State } from '../../interfaces/state';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandeIndividuelService } from '../../services/individuel.service';

@Component({
  selector: 'app-localisation',
  templateUrl: './localisation.component.html',
  styleUrl: './localisation.component.css',
})
export class LocalisationComponent implements OnInit {
  @Input() referenceCredit?: string;
  localisationState$: Observable<State<CustomHttpResponse<LocalisationState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<LocalisationState> | null>(null);

  private loadingSubject = new BehaviorSubject<Boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  readonly DataState = DataState;
  localisationForm!: FormGroup;

  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private localisationService: DemandeIndividuelService
  ) {}

  ngOnInit(): void {
    this.localisationForm = this.fb.group({
      it_ass: ['', Validators.required],
      referenceCredit: [''],
      it_pc: ['', Validators.required],
    });

    // set the reference value as default
    this.localisationForm.patchValue({ referenceCredit: this.referenceCredit });
    /**
     * Display Information
     */
    this.localisationState$ = this.localisationService
      .newLocalisation$(this.referenceCredit!)
      .pipe(
        map((response) => {
          this.dataSubject.next(response);
          this.disableSubject.next(
            response.data?.localisation?.referenceCredit == null
          );
          if (response.data?.localisation != null) {
            this.localisationForm.patchValue({
              it_ass: response.data.localisation.it_ass,
              it_pc: response.data.localisation.it_pc,
            });
          }
          return {
            dataState: DataState.LOADED,
            appData: response,
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
  }

  public onSave(): void {
    this.loadingSubject.next(true);
    this.localisationState$ = this.localisationService
      .addLocalisation$(this.localisationForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.loadingSubject.next(false);
          this.disableSubject.next(response.data?.localisation == null);
          if (response.data?.localisation != null) {
            this.localisationForm.patchValue({
              it_ass: response.data.localisation.it_ass,
              referenceCredit: response.data.localisation.referenceCredit,
              it_pc: response.data.localisation.it_pc,
            });
          }
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

  public onSaveAndContinue(): void {}

  public updateData(): void {
    console.log('this is updata information');
  }
}
