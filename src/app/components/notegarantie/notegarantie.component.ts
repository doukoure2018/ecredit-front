import { Component, Input, OnInit } from '@angular/core';
import {
  CustomHttpResponse,
  NoteGarantieState,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { User } from '../../interfaces/user';
import { DemandeIndividuelService } from '../../services/individuel.service';

@Component({
  selector: 'app-notegarantie',
  templateUrl: './notegarantie.component.html',
  styleUrl: './notegarantie.component.css',
})
export class NotegarantieComponent implements OnInit {
  @Input() user?: User;
  @Input() referenceCredit?: string;
  noteGarantieState$: Observable<State<CustomHttpResponse<NoteGarantieState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<NoteGarantieState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  public readonly DataState = DataState;

  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  noteGarantieForm!: FormGroup;

  // Options pour les notes
  valeurs: number[] = [1, 2, 3, 4, 5];

  readonly stateNoteProfile: string = 'ENCOURS';

  constructor(
    private fb: FormBuilder,
    private individuelService: DemandeIndividuelService
  ) {}

  ngOnInit(): void {
    this.noteGarantieForm = this.fb.group({
      referenceCredit: [''],
      user_id: [''],
      motif: ['', Validators.required],
      note: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      statusNote: [''],
    });
    // set the reference value as default
    this.noteGarantieForm.patchValue({ referenceCredit: this.referenceCredit });
    // set the user_id value as default
    this.noteGarantieForm.patchValue({ user_id: this.user?.id });
    this.noteGarantieForm.patchValue({ statusNote: 'ENCOURS' });
    this.noteGarantieState$ = this.individuelService
      .newNoteGarantie$(this.referenceCredit!, this.stateNoteProfile)
      .pipe(
        map((response) => {
          console.log(response.data);
          this.dataSubject.next(response);
          this.disableSubject.next(
            response.data?.noteGarantie?.referenceCredit == null
          );
          if (response.data != null) {
            this.noteGarantieForm.patchValue({
              note: response.data.noteGarantie?.note,
              motif: response.data.noteGarantie?.motif,
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
    this.noteGarantieState$ = this.individuelService
      .addNoteGarantie$(this.noteGarantieForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.disableSubject.next(response.data == null);
          this.loadingSubject.next(false);
          if (response.data != null) {
            this.noteGarantieForm.patchValue({
              note: response.data.noteGarantie?.note,
              motif: response.data.noteGarantie?.motif,
              referenceCredit: response.data.noteGarantie?.referenceCredit,
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
