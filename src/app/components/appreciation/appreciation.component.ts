import { Component, Input, OnInit } from '@angular/core';
import {
  AppreciationState,
  CustomHttpResponse,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-appreciation',
  templateUrl: './appreciation.component.html',
  styleUrl: './appreciation.component.css',
})
export class AppreciationComponent implements OnInit {
  @Input() referenceCredit?: string;
  @Input() user?: User;
  @Input() montantDemande?: number;
  AppreciationState$: Observable<State<CustomHttpResponse<AppreciationState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<AppreciationState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  public readonly DataState = DataState;

  private disableSubject = new BehaviorSubject<boolean>(false);
  public isDisabled$ = this.disableSubject.asObservable();

  appreciationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private individuelService: DemandeIndividuelService
  ) {}

  ngOnInit(): void {
    this.appreciationForm = this.fb.group({
      referenceCredit: [''],
      user_id: [''],
      motif: ['', Validators.required],
      montantSuggere: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      montantDemande: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
    // set the reference value as default
    this.appreciationForm.patchValue({ referenceCredit: this.referenceCredit });
    this.appreciationForm.patchValue({ user_id: this.user?.id });
    this.appreciationForm.patchValue({ montantDemande: this.montantDemande });

    this.AppreciationState$ = this.individuelService
      .newAppreciation$(this.referenceCredit!)
      .pipe(
        map((response) => {
          console.log('this is the response of appreciation : ' + response);
          this.dataSubject.next(response);
          this.disableSubject.next(
            response.data?.appreciation?.referenceCredit == null
          );
          if (response.data?.appreciation?.referenceCredit != null) {
            this.appreciationForm.patchValue({
              montantSuggere: response.data.appreciation?.montantSuggere,
              motif: response.data.appreciation?.motif,
            });
          }
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

  public onSave(): void {
    this.loadingSubject.next(true);
    this.AppreciationState$ = this.individuelService
      .addAppreciation$(this.appreciationForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.disableSubject.next(response.data?.appreciation == null);
          this.loadingSubject.next(false);
          if (response.data?.appreciation != null) {
            this.appreciationForm.patchValue({
              montantDemande: response.data.appreciation?.montantDemande,
              montantSuggere: response.data.appreciation?.montantSuggere,
              motif: response.data.appreciation?.motif,
              referenceCredit: response.data.appreciation?.referenceCredit,
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
          });
        })
      );
  }

  public updateData(): void {
    console.log('this is update information');
  }
}
