import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
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
import {
  CustomHttpResponse,
  NoteAnalyseState,
} from '../../interfaces/appstates';
import { State } from '../../interfaces/state';
import { DemandeIndividuelService } from '../../services/individuel.service';

@Component({
  selector: 'app-noteanalyse',
  templateUrl: './noteanalyse.component.html',
  styleUrl: './noteanalyse.component.css',
})
export class NoteanalyseComponent implements OnInit {
  @Input() user?: User;
  @Input() referenceCredit?: string;
  noteAnalyseState$: Observable<State<CustomHttpResponse<NoteAnalyseState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<NoteAnalyseState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  public readonly DataState = DataState;

  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  noteAnalyseForm!: FormGroup;

  // Options pour les notes
  valeurs: number[] = [1, 2, 3, 4, 5];

  readonly stateNoteProfile: string = 'ENCOURS';

  constructor(
    private fb: FormBuilder,
    private individuelService: DemandeIndividuelService
  ) {}

  ngOnInit(): void {
    this.noteAnalyseForm = this.fb.group({
      referenceCredit: [''],
      user_id: [''],
      motif: ['', Validators.required],
      note: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      statusNote: [''],
    });
    // set the reference value as default
    this.noteAnalyseForm.patchValue({ referenceCredit: this.referenceCredit });
    // set the user_id value as default
    this.noteAnalyseForm.patchValue({ user_id: this.user?.id });
    this.noteAnalyseForm.patchValue({ statusNote: 'ENCOURS' });
    this.noteAnalyseState$ = this.individuelService
      .newNoteAnalyse$(this.referenceCredit!, this.stateNoteProfile)
      .pipe(
        map((response) => {
          console.log(response.data);
          this.dataSubject.next(response);
          this.disableSubject.next(
            response.data?.noteAnalyse?.referenceCredit == null
          );
          if (response.data?.noteAnalyse != null) {
            this.noteAnalyseForm.patchValue({
              note: response.data.noteAnalyse?.note,
              motif: response.data.noteAnalyse?.motif,
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
    this.noteAnalyseState$ = this.individuelService
      .addNoteAnalyse$(this.noteAnalyseForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.disableSubject.next(response.data?.noteAnalyse == null);
          this.loadingSubject.next(false);
          if (response.data != null) {
            this.noteAnalyseForm.patchValue({
              note: response.data.noteAnalyse?.note,
              motif: response.data.noteAnalyse?.motif,
              referenceCredit: response.data.noteAnalyse?.referenceCredit,
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
